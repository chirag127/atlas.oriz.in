<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/auth/firebase';
	import dbLocal, { type LocalArticle } from '$lib/offline/dexie';

	let clickbaitThreshold = $state(0.3);
	let articles = $state<LocalArticle[]>([]);
	let filteredArticles = $derived(
		articles.filter(art => (art.clickbait_score ?? 0) <= clickbaitThreshold)
	);

	let curiosityScore = $state(74); // Mock score out of 100
	let dailyGoalMinutes = $state(30);
	let currentStreak = $state(5);
	let dailyMinutesRead = $state(18);

	onMount(async () => {
		// Populate some default tech articles into local db if empty
		const count = await dbLocal.articles.count();
		if (count === 0) {
			const initialArticles: LocalArticle[] = [
				{
					id: 'art-d1',
					feed_id: 'feed-tech',
					external_url: 'https://simonwillison.net/2026/May/local-llms',
					title: 'Running Llama 3 locally in the browser with WebGPU',
					author: 'Simon Willison',
					tldr: 'Run full transformer networks locally at 30 tokens/sec using in-browser WebGPU drivers.',
					summary: 'Simon details a step-by-step framework to host model inference on the client. By bypassing standard API models, applications can run with zero server cost and maximum user data privacy.',
					quality_score: 96,
					clickbait_score: 0.12,
					reading_time_min: 6,
					is_saved_offline: 1,
					published_at: new Date().toISOString()
				},
				{
					id: 'art-d2',
					feed_id: 'feed-finance',
					external_url: 'https://finshots.in/daily/indias-semiconductor-push',
					title: 'IS THIS THE MOMENT? India\'s Multi-Billion Dollar Fab Push Exposed!',
					author: 'Finshots',
					tldr: 'An analysis of Indias semiconductor fabrication incentives and geopolitical hurdles.',
					summary: 'Finshots breaks down the subsidies provided to international chipmakers. While promising, talent deficits and supply-chain infrastructure lag behind competitors.',
					quality_score: 72,
					clickbait_score: 0.68,
					reading_time_min: 4,
					is_saved_offline: 1,
					published_at: new Date().toISOString()
				},
				{
					id: 'art-d3',
					feed_id: 'feed-security',
					external_url: 'https://krebsonsecurity.com/2026/05/new-phishing-vector-using-browser-tabs',
					title: 'New tab-nabbing exploit targets Google Chrome profiles',
					author: 'Brian Krebs',
					tldr: 'A critical vulnerability allows background tabs to swap URLs and clone sign-in interfaces.',
					summary: 'Krebs warns about a newly discovered session hijacking vector. Unfocused browser tabs exploit timing handlers to present fake corporate login prompts to unsuspecting users.',
					quality_score: 93,
					clickbait_score: 0.18,
					reading_time_min: 5,
					is_saved_offline: 1,
					published_at: new Date().toISOString()
				}
			];
			await dbLocal.articles.bulkAdd(initialArticles);
		}
		
		articles = await dbLocal.articles.toArray();
	});
</script>

<svelte:head>
	<title>Atlas — Discover</title>
</svelte:head>

<div class="space-y-6 pb-24">
	<!-- Top Headers -->
	<div>
		<h2 class="font-display font-extrabold text-2xl tracking-tight text-white uppercase">Discover</h2>
		<p class="text-xs text-neutral-400 font-medium">AI-curated high-signal digest & recommendation engine</p>
	</div>

	<!-- Stats & Streak Gamification -->
	<div class="grid grid-cols-2 gap-3">
		<div class="glass-card rounded-xl p-4 border-white/5 space-y-2">
			<span class="text-[9px] font-display font-extrabold tracking-widest text-cyber-emerald uppercase">CURIOSITY SCORE</span>
			<div class="flex items-baseline gap-1.5">
				<span class="text-3xl font-display font-extrabold text-white">{curiosityScore}%</span>
				<span class="text-[10px] text-cyber-emerald font-bold">▲ 5% this wk</span>
			</div>
			<div class="h-1 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
				<div class="h-full bg-cyber-emerald" style="width: {curiosityScore}%"></div>
			</div>
		</div>

		<div class="glass-card rounded-xl p-4 border-white/5 space-y-2">
			<span class="text-[9px] font-display font-extrabold tracking-widest text-cyber-violet uppercase">STREAK & XP</span>
			<div class="flex items-baseline gap-1.5">
				<span class="text-3xl font-display font-extrabold text-white">{currentStreak} Days</span>
				<span class="text-[10px] text-cyber-violet font-bold">1200 XP</span>
			</div>
			<div class="flex justify-between text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
				<span>Daily Goal: {dailyMinutesRead}/{dailyGoalMinutes}m</span>
				<span>{Math.round((dailyMinutesRead/dailyGoalMinutes)*100)}%</span>
			</div>
		</div>
	</div>

	<!-- AI Daily Digest -->
	<div class="glass-card rounded-xl p-5 border-cyber-violet/30 bg-gradient-to-br from-purple-950/10 to-black/20 space-y-4">
		<div class="flex justify-between items-center">
			<span class="text-[10px] font-display font-extrabold tracking-widest text-cyber-violet uppercase bg-purple-950/20 px-2 py-0.5 rounded border border-cyber-violet/10">
				Today's Briefing
			</span>
			<span class="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">AI Generated</span>
		</div>
		<h3 class="font-display font-extrabold text-lg text-white leading-tight">
			Local-First browser compilation and Tab-nabbing browser vulnerabilities dominate technical discussions.
		</h3>
		<p class="text-xs text-neutral-300 leading-relaxed font-medium">
			The open source community is pivoting heavily to edge execution utilizing WebGPU, making server LLM deployments obsolete for single-user apps. On security fronts, browser profiles remain vulnerable to active context-switching vectors.
		</p>
	</div>

	<!-- Clickbait Filter Settings Card -->
	<div class="glass-card rounded-xl p-5 border-white/5 space-y-3">
		<div class="flex justify-between items-center">
			<h4 class="text-sm font-display font-extrabold uppercase text-white tracking-wide">De-Clickbait Filter</h4>
			<span class="text-xs font-display font-extrabold text-cyber-orange">
				Threshold: {clickbaitThreshold * 100}%
			</span>
		</div>
		<p class="text-xs text-neutral-400 leading-relaxed">
			Automatically hides articles with high AI-predicted clickbait probabilities (sensationalized headlines, lack of details).
		</p>
		<input 
			type="range" 
			min="0.1" 
			max="1.0" 
			step="0.05" 
			bind:value={clickbaitThreshold}
			class="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-cyber-orange border border-white/5"
		/>
		<div class="flex justify-between text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
			<span>Extreme Filter (10%)</span>
			<span>Allow All (100%)</span>
		</div>
	</div>

	<!-- Recommendations list -->
	<div class="space-y-4">
		<span class="text-[10px] font-display font-extrabold tracking-widest text-neutral-500 uppercase">Recommended for You</span>
		
		{#if filteredArticles.length === 0}
			<div class="glass-card rounded-xl p-8 border-white/5 text-center">
				<p class="text-xs text-neutral-500 font-medium">All articles filtered out based on Clickbait Threshold.</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each filteredArticles as art}
					<div class="glass-card rounded-xl p-4 border-white/5 space-y-3">
						<div class="flex justify-between items-start">
							<span class="text-[9px] font-bold uppercase tracking-widest text-cyber-violet bg-purple-950/20 px-2 py-0.5 rounded border border-cyber-violet/10">
								{art.author || 'Feed'}
							</span>
							<span class="text-[9px] font-display font-extrabold text-neutral-400">
								Clickbait: {Math.round((art.clickbait_score ?? 0)*100)}%
							</span>
						</div>
						<h4 class="font-display font-bold text-sm text-white leading-snug">
							{art.title}
						</h4>
						<p class="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
							{art.tldr}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
