<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { user, loading } from '$lib/auth/firebase';

	// Svelte 5 runes representation
	let { children } = $props();

	// Custom PWA installation prompt event tracking
	let deferredPrompt: any = null;
	let showInstallButton = $state(false);

	onMount(() => {
		// PWA Install Event Handler
		window.addEventListener('beforeinstallprompt', (e) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Check if the user has engaged with the platform
			const visitCount = parseInt(localStorage.getItem('atlas_visits') || '0', 10);
			localStorage.setItem('atlas_visits', (visitCount + 1).toString());
			
			// Show install prompt button after 3 visits to reduce friction
			if (visitCount >= 3) {
				showInstallButton = true;
			}
		});

		window.addEventListener('appinstalled', () => {
			showInstallButton = false;
			deferredPrompt = null;
			console.log('Atlas PWA was successfully installed.');
		});
	});

	async function triggerPWAInstall() {
		if (!deferredPrompt) return;
		// Show the install prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`User response to install prompt: ${outcome}`);
		// We've used the prompt, and can't use it again
		deferredPrompt = null;
		showInstallButton = false;
	}
</script>

<svelte:head>
	<title>Atlas — Knowledge OS</title>
</svelte:head>

<div class="min-h-screen bg-black text-white flex flex-col font-sans select-none overflow-x-hidden">
	{#if $loading}
		<!-- Beautiful brutalist loader -->
		<div class="flex-1 flex flex-col items-center justify-center bg-black">
			<div class="text-4xl font-display font-extrabold tracking-tight text-white mb-4 animate-pulse">
				ATLAS
			</div>
			<div class="h-1 w-24 bg-neutral-900 overflow-hidden relative border border-white/10">
				<div class="h-full bg-gradient-to-r from-cyber-emerald to-cyber-violet w-1/2 absolute animate-[loading_1.5s_infinite_ease-in-out]"></div>
			</div>
		</div>
	{:else}
		<!-- Main content mount -->
		<div class="flex-1 flex flex-col pb-20">
			{@render children()}
		</div>

		<!-- Deferred PWA Install banner -->
		{#if showInstallButton}
			<div class="fixed bottom-24 left-4 right-4 z-50 glass-card p-4 rounded-xl border-cyber-emerald/40 flex items-center justify-between animate-bounce">
				<div>
					<h4 class="font-display font-extrabold text-sm text-cyber-emerald tracking-wide uppercase">Add Atlas to Home Screen</h4>
					<p class="text-xs text-neutral-400">Install as PWA for fast, offline-ready reading.</p>
				</div>
				<div class="flex gap-2">
					<button onclick={() => showInstallButton = false} class="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 font-medium hover:bg-neutral-900 active:scale-95 transition-all">
						Dismiss
					</button>
					<button onclick={triggerPWAInstall} class="px-4 py-1.5 rounded-lg bg-cyber-emerald text-black text-xs font-bold hover:bg-emerald-400 active:scale-95 transition-all">
						Install
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	@keyframes loading {
		0% { left: -50%; }
		100% { left: 100%; }
	}
</style>
