<script lang="ts">
	import { auth } from '$lib/auth/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !password || !confirmPassword) {
			errorMessage = "All fields are required.";
			return;
		}
		if (password !== confirmPassword) {
			errorMessage = "Passwords do not match.";
			return;
		}
		if (password.length < 6) {
			errorMessage = "Password must be at least 6 characters long.";
			return;
		}
		errorMessage = "";
		isSubmitting = true;
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (error: any) {
			console.error(error);
			if (error.code === 'auth/email-already-in-use') {
				errorMessage = "Email is already registered. Please sign in.";
			} else {
				errorMessage = error.message || "An registration error occurred.";
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Atlas — Register</title>
</svelte:head>

<div class="flex-1 flex flex-col items-center justify-center p-6 bg-black min-h-[80vh]">
	<div class="w-full max-w-sm glass-card p-8 rounded-2xl border-white/10 relative overflow-hidden">
		<!-- Aesthetic background blur highlight -->
		<div class="absolute -top-12 -left-12 w-32 h-32 bg-cyber-orange/10 blur-3xl rounded-full"></div>
		<div class="absolute -bottom-12 -right-12 w-32 h-32 bg-cyber-violet/10 blur-3xl rounded-full"></div>

		<!-- Title -->
		<div class="text-center mb-8 relative z-10">
			<h1 class="font-display font-extrabold text-3xl tracking-tight text-white mb-2">ATLAS</h1>
			<p class="text-xs text-neutral-400 font-sans tracking-wide">CREATE KNOWLEDGE ACCESS</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleRegister} class="space-y-5 relative z-10">
			{#if errorMessage}
				<div class="p-3 text-xs bg-red-950/40 border border-red-500/30 text-red-400 rounded-lg text-center font-medium">
					{errorMessage}
				</div>
			{/if}

			<div class="space-y-1.5">
				<label for="email" class="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Email Address</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email}
					placeholder="name@company.com" 
					class="w-full px-4 py-3 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
					required
				/>
			</div>

			<div class="space-y-1.5">
				<label for="password" class="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Password</label>
				<input 
					type="password" 
					id="password" 
					bind:value={password}
					placeholder="••••••••" 
					class="w-full px-4 py-3 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
					required
				/>
			</div>

			<div class="space-y-1.5">
				<label for="confirmPassword" class="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Confirm Password</label>
				<input 
					type="password" 
					id="confirmPassword" 
					bind:value={confirmPassword}
					placeholder="••••••••" 
					class="w-full px-4 py-3 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
					required
				/>
			</div>

			<button 
				type="submit" 
				disabled={isSubmitting}
				class="w-full py-3 rounded-lg bg-white text-black font-bold text-sm tracking-wide uppercase hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50"
			>
				{isSubmitting ? 'Registering...' : 'Register'}
			</button>
		</form>

		<div class="mt-6 text-center text-xs text-neutral-500 relative z-10 font-medium">
			Already have an account? 
			<a href="/login" class="text-cyber-orange hover:underline font-bold ml-1">Log in here</a>
		</div>
	</div>
</div>
