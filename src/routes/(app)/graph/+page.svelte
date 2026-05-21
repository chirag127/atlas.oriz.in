<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/firebase';
	import dbLocal from '$lib/offline/dexie';

	let graphContainer = $state<HTMLElement | null>(null);
	let cyInstance: any = null;
	let selectedNodeInfo = $state<{ title: string; type: string; id: string } | null>(null);

	onMount(async () => {
		if (!$user) {
			goto('/login');
			return;
		}

		// Dynamically import Cytoscape to prevent SSR errors
		const cytoscape = (await import('cytoscape')).default;

		// Fetch all notes and articles
		const notes = await dbLocal.notes.where('user_id').equals($user.uid).toArray();
		const articles = await dbLocal.articles.toArray();

		// Compile Cytoscape elements
		const elements: any[] = [];

		// Add article nodes
		articles.forEach(art => {
			elements.push({
				data: {
					id: art.id,
					label: art.title.substring(0, 15) + '...',
					fullTitle: art.title,
					type: 'article'
				}
			});
		});

		// Add note nodes and edges to articles
		notes.forEach(note => {
			elements.push({
				data: {
					id: note.id,
					label: note.title.substring(0, 15) + '...',
					fullTitle: note.title,
					type: 'note'
				}
			});

			if (note.article_id) {
				elements.push({
					data: {
						id: `edge-${note.id}-${note.article_id}`,
						source: note.id,
						target: note.article_id
					}
				});
			}
		});

		// Fallback elements if graph is empty to show how it looks
		if (elements.length === 0) {
			elements.push(
				{ data: { id: 'n1', label: 'Deep Work', type: 'article', fullTitle: 'Deep Work: Rules for Focused Success' } },
				{ data: { id: 'n2', label: 'My Habits', type: 'note', fullTitle: 'Notes on Deep Work Integration' } },
				{ data: { id: 'e1', source: 'n2', target: 'n1' } },
				{ data: { id: 'n3', label: 'Llama 3 WebGPU', type: 'article', fullTitle: 'Running Llama 3 locally in browser' } },
				{ data: { id: 'n4', label: 'WebGPU Note', type: 'note', fullTitle: 'My WebGPU findings & notes' } },
				{ data: { id: 'e2', source: 'n4', target: 'n3' } },
				{ data: { id: 'e3', source: 'n2', target: 'n4' } } // link between notes
			);
		}

		if (graphContainer) {
			cyInstance = cytoscape({
				container: graphContainer,
				elements,
				style: [
					{
						selector: 'node',
						style: {
							'background-color': '#8b5cf6',
							'label': 'data(label)',
							'color': '#9ca3af',
							'font-size': '10px',
							'font-family': 'Plus Jakarta Sans',
							'text-valign': 'bottom',
							'text-margin-y': 6,
							'width': 22,
							'height': 22,
							'transition-property': 'background-color, border-color, width, height',
							'transition-duration': 0.2
						}
					},
					{
						selector: 'node[type="article"]',
						style: {
							'background-color': '#10b981'
						}
					},
					{
						selector: 'edge',
						style: {
							'width': 1,
							'line-color': 'rgba(255, 255, 255, 0.08)',
							'curve-style': 'bezier'
						}
					},
					{
						selector: 'node:selected',
						style: {
							'background-color': '#ffffff',
							'border-width': 2,
							'border-color': '#8b5cf6',
							'width': 28,
							'height': 28,
							'color': '#ffffff'
						}
					},
					{
						selector: 'node[type="article"]:selected',
						style: {
							'border-color': '#10b981'
						}
					}
				],
				layout: {
					name: 'cose',
					animate: true,
					fit: true,
					padding: 30
				}
			});

			// Handle node selection events
			cyInstance.on('select', 'node', (evt: any) => {
				const node = evt.target;
				selectedNodeInfo = {
					id: node.id(),
					title: node.data('fullTitle'),
					type: node.data('type')
				};
			});

			cyInstance.on('unselect', 'node', () => {
				selectedNodeInfo = null;
			});
		}
	});

	function handleAction() {
		if (!selectedNodeInfo) return;
		if (selectedNodeInfo.type === 'note') {
			goto(`/notes/${selectedNodeInfo.id}`);
		} else {
			// Article action
			alert(`Viewing article: ${selectedNodeInfo.title}`);
		}
	}
</script>

<svelte:head>
	<title>Atlas — Knowledge Graph</title>
</svelte:head>

<div class="space-y-6 pb-24 h-[80vh] flex flex-col justify-between relative">
	<!-- Top Headers -->
	<div>
		<h2 class="font-display font-extrabold text-2xl tracking-tight text-white uppercase">Knowledge Graph</h2>
		<p class="text-xs text-neutral-400 font-medium">Interactive connection web of your articles and notes</p>
	</div>

	<!-- Canvas Graph Area -->
	<div class="flex-1 border border-white/5 bg-neutral-950/40 rounded-2xl overflow-hidden relative min-h-[300px]">
		<div bind:this={graphContainer} class="w-full h-full absolute inset-0"></div>

		<!-- Node Detail Modal overlay -->
		{#if selectedNodeInfo}
			<div class="absolute bottom-4 left-4 right-4 z-20 glass-card p-4 rounded-xl border-white/10 animate-[slideUp_0.2s_ease-out] flex justify-between items-center">
				<div class="space-y-1 flex-1 min-w-0 pr-4">
					<span class="text-[9px] font-display font-extrabold tracking-widest uppercase 
						{selectedNodeInfo.type === 'article' ? 'text-cyber-emerald' : 'text-cyber-violet'}">
						{selectedNodeInfo.type}
					</span>
					<h4 class="font-display font-bold text-sm text-white truncate">
						{selectedNodeInfo.title}
					</h4>
				</div>
				<button 
					onclick={handleAction}
					class="px-4 py-2 rounded-lg bg-white text-black font-extrabold text-xs uppercase tracking-wider shrink-0 active:scale-95 transition-all"
				>
					{selectedNodeInfo.type === 'note' ? 'Edit Note' : 'View'}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
