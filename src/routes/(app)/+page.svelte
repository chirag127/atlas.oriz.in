<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultFeeds } from '$lib/rss/feeds';

	// Category mapping
	const categories = ['all', 'productivity', 'tech', 'ai', 'finance', 'security', 'howto'];
	let selectedCategory = $state('all');
	
	// Mock articles for initial rendering/offline seed
	let articles = $state([
		{
			id: 'art-1',
			title: 'Deep Work: Rules for Focused Success in a Distracted World',
			source: 'Cal Newport Study Hacks',
			category: 'productivity',
			published_at: '2 hours ago',
			reading_time_min: 5,
			quality_score: 95,
			tldr: 'True focus requires digital minimalism and structured time blocks free from modern communication distractions.',
			summary: 'Cal Newport details systems for engineering deep focus, arguing that our hyper-connected habits destroy cognitive capability. By creating dedicated distraction-free environments, professional output increases exponentially.'
		},
		{
			id: 'art-2',
			title: 'Building a Local-First PWA in 2026 with SvelteKit and WebGPU',
			source: 'Simon Willison Blog',
			category: 'tech',
			published_at: '4 hours ago',
			reading_time_min: 7,
			quality_score: 92,
			tldr: 'Run small quantized language models locally in-browser via Transformers.js v4 using WebGPU hardware acceleration.',
			summary: 'Running embeddings and simple semantic search queries locally inside IndexedDB via Dexie.js guarantees extreme user privacy and zero server GPU hosting overhead.'
		},
		{
			id: 'art-3',
			title: 'How India\'s Finshots Simplified Complex Business Models',
			source: 'Finshots Daily',
			category: 'finance',
			published_at: '1 day ago',
			reading_time_min: 4,
			quality_score: 89,
			tldr: 'Aggregating simple business narratives instead of complicated metrics attracts a highly curious financial audience.',
			summary: 'A look at Finshots business model reveals that story-driven economic writing is highly viral. India\'s personal investing scene is expanding rapidly among younger software developers.'
		}
	]);

	// Filtered articles
	let filteredArticles = $derived(
		selectedCategory === 'all' 
			? articles 
			: articles.filter(a => a.category === selectedCategory)
	);

	let activeArticleId = $state<string | null>(null);

	function toggleSummary(id: string) {
		if (activeArticleId === id) {
			activeArticleId = null;
		} else {
			activeArticleId = id;
		}
	}
</script>

<svelte:head>
	<title>Atlas — Your Feed</title>
</svelte:head>

<div class="space-y-5 pb-10">
	<!-- Search bar -->
	<div class="relative">
		<input 
			type="search" 
			placeholder="Search knowledge..." 
			class="w-full px-4 py-3 pl-10 rounded-xl bg-neutral-900/60 border border-white/5 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyber-emerald focus:ring-1 focus:ring-cyber-emerald transition-all"
		/>
		<svg class="w-4 h-4 text-neutral-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	</div>

	<!-- Categories slider -->
	<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 select-none">
		{#each categories as cat}
			<button 
				onclick={() => selectedCategory = cat}
				class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border shrink-0 
				{selectedCategory === cat 
					? 'bg-white border-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.25)]' 
					: 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'}"
			>
				{cat}
			</button>
		{/each}
	</div>

	<!-- Articles list -->
	<div class="space-y-4">
		{#each filteredArticles as art}
			<div class="glass-card rounded-xl p-5 border-white/5 space-y-4 hover:border-cyber-emerald/30 group">
				<div class="flex justify-between items-start">
					<div class="space-y-1">
						<span class="text-[9px] font-bold uppercase tracking-widest text-cyber-emerald bg-emerald-950/20 px-2 py-0.5 rounded border border-cyber-emerald/10">
							{art.source}
						</span>
						<h3 class="font-display font-bold text-base text-white tracking-tight leading-snug group-hover:text-cyber-emerald transition-colors">
							{art.title}
						</h3>
					</div>
					
					<!-- Quality Score -->
					<span class="text-[10px] font-display font-extrabold text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded">
						{art.quality_score}% Q
					</span>
				</div>

				<p class="text-xs text-neutral-400 leading-relaxed font-medium">
					{art.tldr}
				</p>

				<div class="flex justify-between items-center text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
					<span>{art.published_at} • {art.reading_time_min} min read</span>
					
					<button 
						onclick={() => toggleSummary(art.id)}
						class="text-cyber-violet hover:text-purple-400 hover:underline transition-colors flex items-center gap-1"
					>
						{activeArticleId === art.id ? 'Hide AI Summary' : 'View AI Summary'}
					</button>
				</div>

				<!-- AI Summary Block (Expanded) -->
				{#if activeArticleId === art.id}
					<div class="p-4 rounded-lg bg-neutral-950 border border-white/5 space-y-2 animate-[slideDown_0.2s_ease-out]">
						<h4 class="text-[10px] font-display font-extrabold text-cyber-violet tracking-widest uppercase">AI SUMMARY</h4>
						<p class="text-xs text-neutral-300 leading-relaxed">
							{art.summary}
						</p>
						<div class="flex gap-2 pt-2 border-t border-white/5">
							<button class="text-[9px] uppercase tracking-wider font-extrabold text-cyber-emerald hover:underline">Discuss with Chatbot</button>
							<span class="text-neutral-700">|</span>
							<button class="text-[9px] uppercase tracking-wider font-extrabold text-cyber-orange hover:underline">Convert to Note</button>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Scrollbar hiding utility */
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-5px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
