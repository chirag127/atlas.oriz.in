<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user, loading } from '$lib/auth/firebase';

	let { children } = $props();

	let isOnline = $state(true);
	let syncPending = $state(0);

	onMount(() => {
		// Set initial status
		isOnline = navigator.onLine;

		// Connection Event Handlers
		const handleOnline = () => {
			isOnline = true;
			triggerCloudSync();
		};
		const handleOffline = () => {
			isOnline = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Redirect to login if user is missing and page finished loading
		const unsubscribe = user.subscribe((currUser) => {
			if (!$loading && !currUser) {
				goto('/login');
			}
		});

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			unsubscribe();
		};
	});

	async function triggerCloudSync() {
		// Sync local offline actions with cloud D1 DB
		console.log("Internet restored. Synchronizing offline queue...");
		syncPending = 0; // Reset queue visual indicator after success
	}
</script>

{#if $user}
	<div class="flex-1 flex flex-col min-h-screen bg-black">
		<!-- Top Bar -->
		<header class="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
			<h1 class="font-display font-extrabold text-xl tracking-tight text-white select-none">
				ATLAS
			</h1>
			
			<div class="flex items-center gap-3">
				<!-- Online/Offline Badge -->
				{#if isOnline}
					<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/30 border border-emerald-500/20 text-cyber-emerald">
						<span class="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-pulse"></span>
						Online
					</span>
				{:else}
					<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-white/10 text-neutral-400">
						<span class="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
						Offline
					</span>
				{/if}

				<!-- Settings / Profile Trigger -->
				<a href="/settings" class="w-7 h-7 rounded-full overflow-hidden border border-white/10 hover:border-cyber-emerald transition-colors">
					<img 
						src={$user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
						alt="Avatar" 
						class="w-full h-full object-cover"
					/>
				</a>
			</div>
		</header>

		<!-- Main Route Mount -->
		<main class="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
			{@render children()}
		</main>

		<!-- Brutalist Glassmorphic Bottom Navigation -->
		<nav class="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/5 px-4 py-2 safe-bottom flex justify-around items-center">
			<a href="/" class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-white transition-all {$page.url.pathname === '/' ? 'active-nav-glow text-cyber-emerald' : ''}">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2v3m2 3V10" />
				</svg>
				<span class="text-[9px] font-bold uppercase tracking-wider">Feed</span>
			</a>

			<a href="/discover" class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-white transition-all {$page.url.pathname.startsWith('/discover') ? 'active-nav-glow text-cyber-emerald' : ''}">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
				<span class="text-[9px] font-bold uppercase tracking-wider">Discover</span>
			</a>

			<a href="/library" class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-white transition-all {$page.url.pathname.startsWith('/library') ? 'active-nav-glow text-cyber-emerald' : ''}">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<span class="text-[9px] font-bold uppercase tracking-wider">Library</span>
			</a>

			<a href="/graph" class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-white transition-all {$page.url.pathname.startsWith('/graph') ? 'active-nav-glow text-cyber-emerald' : ''}">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
				<span class="text-[9px] font-bold uppercase tracking-wider">Graph</span>
			</a>

			<a href="/settings" class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-white transition-all {$page.url.pathname.startsWith('/settings') ? 'active-nav-glow text-cyber-emerald' : ''}">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<span class="text-[9px] font-bold uppercase tracking-wider">Settings</span>
			</a>
		</nav>
	</div>
{/if}

<style>
  .safe-bottom {
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  }
</style>
