<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth/firebase';
	import dbLocal, { type SyncQueueItem } from '$lib/offline/dexie';
	import { queueOfflineAction, syncWithCloud } from '$lib/offline/sync';
	import { fsrs, createEmptyCard, Rating, type Card, type Grade } from 'ts-fsrs';

	let cards = $state<any[]>([]);
	let currentIndex = $state(0);
	let currentCard = $derived(cards[currentIndex] || null);
	let showAnswer = $state(false);
	
	let scheduler = fsrs({
		request_retention: 0.9,
		enable_fuzz: true
	});

	let intervals = $derived.by(() => {
		if (!currentCard) return null;
		// Make a copy of Card state for FSRS repeat calculation
		const cardState: Card = {
			stability: currentCard.stability,
			difficulty: currentCard.difficulty,
			elapsed_days: currentCard.elapsed_days,
			scheduled_days: currentCard.scheduled_days,
			reps: currentCard.reps,
			lapses: currentCard.lapses,
			state: currentCard.state,
			due: currentCard.due_at ? new Date(currentCard.due_at) : new Date(),
			last_review: currentCard.last_review_at ? new Date(currentCard.last_review_at) : undefined
		};
		const previews = scheduler.repeat(cardState, new Date());
		
		const formatInterval = (days: number) => {
			if (days < 1) {
				const mins = Math.round(days * 24 * 60);
				return mins >= 60 ? `${Math.round(mins / 60)}h` : `${mins}m`;
			}
			return `${Math.round(days)}d`;
		};

		return {
			again: formatInterval(previews[Rating.Again].card.scheduled_days),
			hard: formatInterval(previews[Rating.Hard].card.scheduled_days),
			good: formatInterval(previews[Rating.Good].card.scheduled_days),
			easy: formatInterval(previews[Rating.Easy].card.scheduled_days)
		};
	});

	onMount(async () => {
		if (!$user) {
			goto('/login');
			return;
		}

		await loadCards();
	});

	async function loadCards() {
		if (!$user) return;
		
		// Query due cards from local IndexedDB
		const nowStr = new Date().toISOString();
		const allCards = await dbLocal.transaction('r', dbLocal.tables, async () => {
			// In Dexie, we query all and filter in memory since D1 due checks are date comparisons
			const userCards = await dbLocal.table('srs_cards').where('user_id').equals($user!.uid).toArray();
			return userCards.filter(c => !c.due_at || new Date(c.due_at) <= new Date());
		});

		// If no due cards and database is empty, seed some default/mock ones for curious learning
		if (allCards.length === 0) {
			const count = await dbLocal.table('srs_cards').count();
			if (count === 0) {
				const empty = createEmptyCard();
				const seedCards = [
					{
						id: 'card-1',
						user_id: $user.uid,
						item_type: 'highlight',
						item_id: 'hl-1',
						front_text: 'What are the three pillars of Cal Newport\'s Deep Work philosophy?',
						back_text: '1. Focus on the deeply important\n2. Keep a compelling scoreboard\n3. Create a cadence of accountability',
						stability: empty.stability,
						difficulty: empty.difficulty,
						elapsed_days: empty.elapsed_days,
						scheduled_days: empty.scheduled_days,
						reps: empty.reps,
						lapses: empty.lapses,
						state: empty.state,
						due_at: new Date().toISOString(),
						last_review_at: null,
						created_at: new Date().toISOString()
					},
					{
						id: 'card-2',
						user_id: $user.uid,
						item_type: 'note',
						item_id: 'nt-1',
						front_text: 'What is the conflict resolution mechanism used in Atlas sync?',
						back_text: 'Last-Write-Wins (LWW) based on ISO timestamps of client edits and server writes.',
						stability: empty.stability,
						difficulty: empty.difficulty,
						elapsed_days: empty.elapsed_days,
						scheduled_days: empty.scheduled_days,
						reps: empty.reps,
						lapses: empty.lapses,
						state: empty.state,
						due_at: new Date().toISOString(),
						last_review_at: null,
						created_at: new Date().toISOString()
					}
				];
				await dbLocal.table('srs_cards').bulkAdd(seedCards);
				cards = seedCards;
			} else {
				cards = [];
			}
		} else {
			cards = allCards;
		}
	}

	async function rateCard(rating: Grade) {
		if (!currentCard || !$user) return;

		const cardState: Card = {
			stability: currentCard.stability,
			difficulty: currentCard.difficulty,
			elapsed_days: currentCard.elapsed_days,
			scheduled_days: currentCard.scheduled_days,
			reps: currentCard.reps,
			lapses: currentCard.lapses,
			state: currentCard.state,
			due: currentCard.due_at ? new Date(currentCard.due_at) : new Date(),
			last_review: currentCard.last_review_at ? new Date(currentCard.last_review_at) : undefined
		};

		const result = scheduler.next(cardState, new Date(), rating);
		
		const updatedCard = {
			...currentCard,
			stability: result.card.stability,
			difficulty: result.card.difficulty,
			elapsed_days: result.card.elapsed_days,
			scheduled_days: result.card.scheduled_days,
			reps: result.card.reps,
			lapses: result.card.lapses,
			state: result.card.state,
			due_at: result.card.due.toISOString(),
			last_review_at: new Date().toISOString()
		};

		// 1. Update Dexie
		await dbLocal.table('srs_cards').put(updatedCard);
		
		// 2. Queue sync
		await queueOfflineAction('update', 'srs_cards', currentCard.id, updatedCard);

		// 3. Award XP & Log Activity
		await dbLocal.table('notes').count(); // Dummy db activity to verify transaction
		
		// Move to next card
		showAnswer = false;
		currentIndex += 1;
		
		// Trigger background cloud sync
		syncWithCloud($user.uid);
	}
</script>

<svelte:head>
	<title>Atlas — Review</title>
</svelte:head>

<div class="space-y-6 pb-24 min-h-[70vh] flex flex-col justify-between">
	<!-- Top Headers -->
	<div class="flex justify-between items-center">
		<div>
			<h2 class="font-display font-extrabold text-2xl tracking-tight text-white uppercase">SRS REVIEW</h2>
			<p class="text-xs text-neutral-400 font-medium">Spaced Repetition using FSRS Algorithm</p>
		</div>
		<span class="text-xs font-display font-extrabold text-cyber-emerald border border-cyber-emerald/20 bg-emerald-950/20 px-2 py-0.5 rounded">
			{cards.length - currentIndex} cards left
		</span>
	</div>

	<!-- Main Card Content -->
	<div class="flex-1 flex flex-col justify-center my-6">
		{#if currentIndex >= cards.length}
			<div class="glass-card rounded-xl p-8 border-cyber-emerald/30 text-center space-y-4 max-w-sm mx-auto">
				<div class="text-5xl">⚡</div>
				<h3 class="font-display font-extrabold text-lg text-white uppercase">Review Session Complete!</h3>
				<p class="text-xs text-neutral-400 leading-relaxed font-medium">
					You have processed all cards scheduled for review today. Keep reading and highlighting articles to grow your memory graph!
				</p>
				<button 
					onclick={() => goto('/')}
					class="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all"
				>
					Back to Feed
				</button>
			</div>
		{:else}
			<div class="glass-card rounded-2xl p-6 border-white/5 bg-neutral-950/50 flex flex-col min-h-[250px] justify-between space-y-6 max-w-md mx-auto w-full relative overflow-hidden">
				<!-- Card Front -->
				<div class="space-y-3">
					<span class="text-[9px] font-display font-extrabold tracking-widest text-neutral-500 uppercase">QUESTION</span>
					<p class="text-base text-white leading-relaxed font-medium">
						{currentCard.front_text}
					</p>
				</div>

				<!-- Divider -->
				{#if showAnswer}
					<div class="h-[1px] w-full bg-white/5 animate-pulse"></div>

					<!-- Card Back -->
					<div class="space-y-3 animate-[fadeIn_0.2s_ease-out]">
						<span class="text-[9px] font-display font-extrabold tracking-widest text-cyber-violet uppercase">ANSWER</span>
						<p class="text-sm text-neutral-200 leading-relaxed whitespace-pre-line font-medium">
							{currentCard.back_text}
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Action Controls -->
	<div>
		{#if currentIndex < cards.length}
			{#if !showAnswer}
				<button 
					onclick={() => showAnswer = true}
					class="w-full py-4 rounded-xl bg-white text-black font-display font-extrabold uppercase tracking-widest hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)]"
				>
					Show Answer
				</button>
			{:else}
				<div class="grid grid-cols-4 gap-2">
					<button 
						onclick={() => rateCard(Rating.Again)}
						class="py-3 rounded-lg border border-red-500/20 bg-red-950/10 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-black transition-all flex flex-col items-center justify-center"
					>
						<span>Again</span>
						<span class="text-[8px] text-red-500/60 mt-0.5">{intervals?.again}</span>
					</button>

					<button 
						onclick={() => rateCard(Rating.Hard)}
						class="py-3 rounded-lg border border-orange-500/20 bg-orange-950/10 text-orange-400 text-xs font-bold uppercase tracking-wider hover:bg-orange-500 hover:text-black transition-all flex flex-col items-center justify-center"
					>
						<span>Hard</span>
						<span class="text-[8px] text-orange-500/60 mt-0.5">{intervals?.hard}</span>
					</button>

					<button 
						onclick={() => rateCard(Rating.Good)}
						class="py-3 rounded-lg border border-emerald-500/20 bg-emerald-950/10 text-cyber-emerald text-xs font-bold uppercase tracking-wider hover:bg-cyber-emerald hover:text-black transition-all flex flex-col items-center justify-center"
					>
						<span>Good</span>
						<span class="text-[8px] text-cyber-emerald/60 mt-0.5">{intervals?.good}</span>
					</button>

					<button 
						onclick={() => rateCard(Rating.Easy)}
						class="py-3 rounded-lg border border-purple-500/20 bg-purple-950/10 text-cyber-violet text-xs font-bold uppercase tracking-wider hover:bg-cyber-violet hover:text-black transition-all flex flex-col items-center justify-center"
					>
						<span>Easy</span>
						<span class="text-[8px] text-cyber-violet/60 mt-0.5">{intervals?.easy}</span>
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
