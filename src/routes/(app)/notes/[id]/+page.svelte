<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/firebase';
	import dbLocal, { type LocalNote } from '$lib/offline/dexie';
	import { queueOfflineAction, syncWithCloud } from '$lib/offline/sync';

	let noteId = $state($page.params.id);
	let note = $state<LocalNote | null>(null);
	let title = $state('Untitled');
	let isPinned = $state(false);
	let isSaving = $state(false);
	let syncStatus = $state<'synced' | 'pending' | 'offline'>('synced');

	let editorElement = $state<HTMLElement | null>(null);
	let crepeInstance: any = null;

	onMount(async () => {
		const currentUser = $user;
		if (!currentUser) {
			goto('/login');
			return;
		}

		// Handle new note creation
		if (noteId === 'new') {
			const newId = 'note_' + Math.random().toString(36).substring(2, 15);
			const newNote: LocalNote = {
				id: newId,
				user_id: currentUser.uid,
				title: 'Untitled Note',
				content_md: '',
				is_pinned: 0,
				word_count: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			await dbLocal.notes.add(newNote);
			await queueOfflineAction('insert', 'notes', newId, newNote);
			
			// Background sync
			syncStatus = 'pending';
			syncWithCloud(currentUser.uid).then((res) => {
				syncStatus = res.success ? 'synced' : 'offline';
			});

			goto(`/notes/${newId}`, { replaceState: true });
			return;
		}

		// Fetch existing note from IndexedDB
		const existingNote = await dbLocal.notes.get(noteId as string);
		if (!existingNote) {
			console.error(`Note with ID ${noteId} not found.`);
			goto('/library');
			return;
		}

		note = existingNote;
		title = existingNote.title;
		isPinned = existingNote.is_pinned === 1;

		// Dynamically import @milkdown/crepe to prevent SSR issues
		const { Crepe } = await import('@milkdown/crepe');
		await import('@milkdown/crepe/theme/common/style.css');
		await import('@milkdown/crepe/theme/frame.css');

		if (editorElement) {
			crepeInstance = new Crepe({
				root: editorElement,
				defaultValue: existingNote.content_md || '# ' + existingNote.title + '\n\nStart writing...'
			});

			await crepeInstance.create();

			// Listen for content updates to auto-save
			crepeInstance.on((listener: any) => {
				listener.markdownUpdated(async (ctx: any, markdown: string) => {
					if (!note || !$user) return;
					
					isSaving = true;
					syncStatus = 'pending';

					const updatedNote: LocalNote = {
						...note,
						content_md: markdown,
						word_count: markdown.split(/\s+/).length,
						updated_at: new Date().toISOString()
					};

					await dbLocal.notes.put(updatedNote);
					await queueOfflineAction('update', 'notes', note.id, updatedNote);

					isSaving = false;
					
					// Background sync
					syncWithCloud($user.uid).then((res) => {
						syncStatus = res.success ? 'synced' : 'offline';
					});
				});
			});
		}
	});

	onDestroy(() => {
		if (crepeInstance) {
			crepeInstance.destroy();
		}
	});

	async function handleTitleChange() {
		if (!note || !$user) return;

		syncStatus = 'pending';
		const updatedNote: LocalNote = {
			...note,
			title,
			updated_at: new Date().toISOString()
		};

		await dbLocal.notes.put(updatedNote);
		await queueOfflineAction('update', 'notes', note.id, updatedNote);

		// Background sync
		syncWithCloud($user.uid).then((res) => {
			syncStatus = res.success ? 'synced' : 'offline';
		});
	}

	async function togglePin() {
		if (!note || !$user) return;

		isPinned = !isPinned;
		syncStatus = 'pending';
		const updatedNote: LocalNote = {
			...note,
			is_pinned: isPinned ? 1 : 0,
			updated_at: new Date().toISOString()
		};

		await dbLocal.notes.put(updatedNote);
		await queueOfflineAction('update', 'notes', note.id, updatedNote);

		// Background sync
		syncWithCloud($user.uid).then((res) => {
			syncStatus = res.success ? 'synced' : 'offline';
		});
	}

	async function deleteNote() {
		if (!note || !$user) return;

		const confirmed = confirm('Are you sure you want to delete this note?');
		if (!confirmed) return;

		syncStatus = 'pending';
		await dbLocal.notes.delete(note.id);
		await queueOfflineAction('delete', 'notes', note.id, null);

		// Trigger background sync and navigate back
		syncWithCloud($user.uid).then(() => {
			goto('/library');
		});
	}
</script>

<svelte:head>
	<title>Atlas — {title}</title>
</svelte:head>

<div class="min-h-screen bg-black text-white flex flex-col pb-24">
	<!-- Editor Top Bar -->
	<div class="flex items-center justify-between border-b border-white/5 py-3 px-4 sticky top-14 bg-black/80 backdrop-blur-md z-30">
		<button 
			onclick={() => goto('/library')}
			class="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors uppercase font-bold tracking-wider"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back
		</button>

		<div class="flex items-center gap-3">
			<!-- Sync Badge -->
			{#if syncStatus === 'synced'}
				<span class="text-[9px] uppercase font-bold text-cyber-emerald border border-cyber-emerald/20 bg-emerald-950/20 px-2 py-0.5 rounded">
					Saved
				</span>
			{:else}
				<span class="text-[9px] uppercase font-bold text-cyber-orange border border-cyber-orange/20 bg-orange-950/20 px-2 py-0.5 rounded animate-pulse">
					Syncing...
				</span>
			{/if}

			<!-- Pin Note -->
			<button 
				onclick={togglePin}
				class="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white transition-colors {isPinned ? 'border-cyber-emerald text-cyber-emerald bg-emerald-950/10' : ''}"
				title="Pin Note"
			>
				<svg class="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
				</svg>
			</button>

			<!-- Delete Note -->
			<button 
				onclick={deleteNote}
				class="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
				title="Delete Note"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Title Area -->
	<div class="px-6 pt-6">
		<input 
			type="text" 
			bind:value={title} 
			oninput={handleTitleChange}
			placeholder="Untitled Note" 
			class="w-full bg-transparent border-none outline-none font-display font-extrabold text-3xl tracking-tight text-white placeholder-neutral-700 focus:ring-0 p-0"
		/>
		<div class="h-[1px] w-full bg-white/5 mt-4"></div>
	</div>

	<!-- Editor Area -->
	<div class="flex-1 px-6 py-4 milkdown-editor-container">
		<div bind:this={editorElement} class="w-full h-full text-neutral-300"></div>
	</div>
</div>

<style>
	/* Custom Milkdown styles to fit Brutalist OLED theme */
	:global(.milkdown) {
		background-color: transparent !important;
		color: #e5e7eb !important;
		font-family: 'Plus Jakarta Sans', sans-serif !important;
	}
	:global(.milkdown .editor) {
		padding: 0 !important;
		outline: none !important;
	}
	:global(.milkdown h1, .milkdown h2, .milkdown h3) {
		font-family: 'Cabinet Grotesk', sans-serif !important;
		font-weight: 800 !important;
		color: #ffffff !important;
		margin-top: 1.5rem !important;
	}
	:global(.milkdown p) {
		font-size: 0.95rem !important;
		line-height: 1.6 !important;
		color: #d1d5db !important;
	}
</style>
