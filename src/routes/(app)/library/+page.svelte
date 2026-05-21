<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/firebase';
	import dbLocal, { type LocalNote, type LocalArticle, type LocalHighlight } from '$lib/offline/dexie';
	import { syncWithCloud } from '$lib/offline/sync';

	let activeTab = $state<'notes' | 'bookmarks' | 'highlights'>('notes');
	let notes = $state<LocalNote[]>([]);
	let bookmarks = $state<LocalArticle[]>([]);
	let highlights = $state<LocalHighlight[]>([]);
	
	let syncStatus = $state<'synced' | 'syncing' | 'error'>('synced');
	let syncMessage = $state('All changes saved locally.');

	onMount(async () => {
		const currentUser = $user;
		if (!currentUser) {
			goto('/login');
			return;
		}

		await refreshData();

		// Trigger background sync
		syncStatus = 'syncing';
		syncMessage = 'Syncing library with cloud...';
		const res = await syncWithCloud(currentUser.uid);
		if (res.success) {
			syncStatus = 'synced';
			syncMessage = 'Synced with cloud.';
			await refreshData(); // Refresh to catch pulled changes
		} else {
			syncStatus = 'error';
			syncMessage = `Sync warning: ${res.errors?.join(', ') || 'Offline mode'}`;
		}
	});

	async function refreshData() {
		if (!$user) return;
		
		// Fetch notes from Dexie sorted by pinned then updated
		const allNotes = await dbLocal.notes
			.where('user_id')
			.equals($user.uid)
			.toArray();
		
		notes = allNotes.sort((a, b) => {
			if (a.is_pinned !== b.is_pinned) {
				return b.is_pinned - a.is_pinned;
			}
			return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
		});

		// Fetch bookmarked articles from Dexie
		bookmarks = await dbLocal.articles
			.where('is_saved_offline') // check if saved locally or fetch bookmarks
			.equals(1)
			.toArray();
		
		// Fetch highlights
		highlights = await dbLocal.highlights
			.where('user_id')
			.equals($user.uid)
			.toArray();
	}

	async function createNewNote() {
		goto('/notes/new');
	}
</script>

<svelte:head>
	<title>Atlas — Library</title>
</svelte:head>

<div class="space-y-6 pb-20">
	<!-- Header / Sync Status -->
	<div class="flex justify-between items-center">
		<div>
			<h2 class="font-display font-extrabold text-2xl tracking-tight text-white uppercase">Library</h2>
			<p class="text-xs text-neutral-400 font-medium">Your personal knowledge base</p>
		</div>

		<!-- Sync Indicator -->
		<div class="text-right">
			<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider 
				{syncStatus === 'synced' ? 'text-cyber-emerald' : syncStatus === 'syncing' ? 'text-cyber-orange' : 'text-neutral-500'}">
				<span class="w-1.5 h-1.5 rounded-full 
					{syncStatus === 'synced' ? 'bg-cyber-emerald' : syncStatus === 'syncing' ? 'bg-cyber-orange animate-pulse' : 'bg-neutral-500'}"></span>
				{syncStatus}
			</span>
			<p class="text-[9px] text-neutral-500 font-medium truncate max-w-[150px]">{syncMessage}</p>
		</div>
	</div>

	<!-- Custom Segmented Tabs -->
	<div class="flex border border-white/5 bg-neutral-950 p-1 rounded-xl">
		<button 
			onclick={() => activeTab = 'notes'} 
			class="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest rounded-lg transition-all
			{activeTab === 'notes' ? 'bg-white text-black font-extrabold shadow-[0_2px_8px_rgba(255,255,255,0.15)]' : 'text-neutral-400 hover:text-white'}"
		>
			Notes ({notes.length})
		</button>
		<button 
			onclick={() => activeTab = 'bookmarks'} 
			class="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest rounded-lg transition-all
			{activeTab === 'bookmarks' ? 'bg-white text-black font-extrabold shadow-[0_2px_8px_rgba(255,255,255,0.15)]' : 'text-neutral-400 hover:text-white'}"
		>
			Bookmarks ({bookmarks.length})
		</button>
		<button 
			onclick={() => activeTab = 'highlights'} 
			class="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest rounded-lg transition-all
			{activeTab === 'highlights' ? 'bg-white text-black font-extrabold shadow-[0_2px_8px_rgba(255,255,255,0.15)]' : 'text-neutral-400 hover:text-white'}"
		>
			Highlights ({highlights.length})
		</button>
	</div>

	<!-- Tab Contents -->
	{#if activeTab === 'notes'}
		<div class="space-y-4">
			<!-- Pinned/Create Section -->
			<div class="flex justify-between items-center">
				<span class="text-[10px] font-display font-extrabold tracking-widest text-neutral-500 uppercase">My Notes</span>
				<button 
					onclick={createNewNote}
					class="text-xs font-extrabold text-cyber-emerald border border-cyber-emerald/20 bg-emerald-950/10 px-3 py-1 rounded-lg hover:bg-cyber-emerald hover:text-black active:scale-95 transition-all flex items-center gap-1"
				>
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					New Note
				</button>
			</div>

			<!-- Notes List -->
			{#if notes.length === 0}
				<div class="glass-card rounded-xl p-8 border-white/5 text-center space-y-3">
					<p class="text-sm text-neutral-500 font-medium">No notes created yet.</p>
					<button onclick={createNewNote} class="text-xs font-bold uppercase text-cyber-violet hover:underline">Create your first note</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-3">
					{#each notes as nt}
						<a 
							href="/notes/{nt.id}" 
							class="glass-card rounded-xl p-5 border-white/5 hover:border-cyber-violet/30 transition-all flex justify-between items-start group"
						>
							<div class="space-y-1.5 flex-1 min-w-0">
								<h4 class="font-display font-bold text-base text-white tracking-tight leading-tight group-hover:text-cyber-violet transition-colors truncate">
									{nt.title}
								</h4>
								<p class="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
									{nt.content_md ? nt.content_md.replace(/[#*`_]/g, '').substring(0, 120) : 'Empty note...'}
								</p>
								<div class="text-[9px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-2">
									<span>{new Date(nt.updated_at).toLocaleDateString()}</span>
									<span>•</span>
									<span>{nt.word_count} words</span>
								</div>
							</div>

							{#if nt.is_pinned === 1}
								<span class="text-cyber-emerald ml-3">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
									</svg>
								</span>
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="glass-card rounded-xl p-8 border-white/5 text-center">
			<p class="text-sm text-neutral-500 font-medium">Feature coming soon or populated via aggregation.</p>
		</div>
	{/if}
</div>
