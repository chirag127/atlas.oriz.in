<script lang="ts">
	import { user, logOut } from '$lib/auth/firebase';
	import { onMount } from 'svelte';
	import dbLocal, { type LocalArticle } from '$lib/offline/dexie';
	import { getEmbedding, cosineSimilarity } from '$lib/ai/embeddings';
	
	// API Configuration states
	let provider = $state('puter');
	let openrouterKey = $state('');
	let openrouterModel = $state('openrouter/free');
	let geminiKey = $state('');
	let geminiModel = $state('gemini-1.5-flash');
	let nvidiaKey = $state('');
	let nvidiaUrl = $state('https://integrate.api.nvidia.com/v1');
	let nvidiaModel = $state('meta/llama-3.1-70b-instruct');
	let mistralKey = $state('');
	let mistralModel = $state('mistral-large-latest');
	let hfToken = $state('');
	let hfModel = $state('meta-llama/Llama-3-8b-instruct');
	let vercelGatewayUrl = $state('');
	let vercelGatewayKey = $state('');
	let vercelGatewayModel = $state('');
	let opencodeZenKey = $state('');
	let opencodeZenModel = $state('opencode/gpt-5.5');
	let cerebrasKey = $state('');
	let cerebrasModel = $state('llama3.1-8b');
	let groqKey = $state('');
	let groqModel = $state('llama-3.3-70b-versatile');
	let cohereKey = $state('');
	let cohereModel = $state('command-r-plus');
	let githubToken = $state('');
	let githubModel = $state('gpt-4o-mini');
	let cfAccountId = $state('');
	let cfToken = $state('');
	let cfModel = $state('@cf/meta/llama-3.1-8b-instruct');
	
	// Embeddings Configuration
	let embeddingsEngine = $state<'local' | 'cloudflare' | 'hf' | 'cohere' | 'nvidia'>('local');

	// UI/UX & Feed state variables
	let usePuterJs = $state(true);
	let autoSummarize = $state(true);
	let theme = $state('dark');
	let feedRefreshInterval = $state('1h');
	let maxOfflineArticles = $state(100);
	
	// Message notifications
	let saveSuccessMessage = $state('');

	// Sandbox Semantic Search States
	let sandboxQuery = $state('');
	let sandboxResults = $state<{ article: LocalArticle; score: number }[]>([]);
	let sandboxSearching = $state(false);
	let sandboxError = $state('');

	onMount(() => {
		// Load settings from LocalStorage
		provider = localStorage.getItem('atlas_ai_provider') || 'puter';
		openrouterKey = localStorage.getItem('atlas_openrouter_key') || '';
		openrouterModel = localStorage.getItem('atlas_openrouter_model') || 'openrouter/free';
		geminiKey = localStorage.getItem('atlas_gemini_key') || '';
		geminiModel = localStorage.getItem('atlas_gemini_model') || 'gemini-1.5-flash';
		nvidiaKey = localStorage.getItem('atlas_nvidia_key') || '';
		nvidiaUrl = localStorage.getItem('atlas_nvidia_url') || 'https://integrate.api.nvidia.com/v1';
		nvidiaModel = localStorage.getItem('atlas_nvidia_model') || 'meta/llama-3.1-70b-instruct';
		mistralKey = localStorage.getItem('atlas_mistral_key') || '';
		mistralModel = localStorage.getItem('atlas_mistral_model') || 'mistral-large-latest';
		hfToken = localStorage.getItem('atlas_hf_token') || '';
		hfModel = localStorage.getItem('atlas_hf_model') || 'meta-llama/Llama-3-8b-instruct';
		vercelGatewayUrl = localStorage.getItem('atlas_vercel_gateway_url') || '';
		vercelGatewayKey = localStorage.getItem('atlas_vercel_gateway_key') || '';
		vercelGatewayModel = localStorage.getItem('atlas_vercel_gateway_model') || '';
		opencodeZenKey = localStorage.getItem('atlas_opencodezen_key') || '';
		opencodeZenModel = localStorage.getItem('atlas_opencodezen_model') || 'opencode/gpt-5.5';
		cerebrasKey = localStorage.getItem('atlas_cerebras_key') || '';
		cerebrasModel = localStorage.getItem('atlas_cerebras_model') || 'llama3.1-8b';
		groqKey = localStorage.getItem('atlas_groq_key') || '';
		groqModel = localStorage.getItem('atlas_groq_model') || 'llama-3.3-70b-versatile';
		cohereKey = localStorage.getItem('atlas_cohere_key') || '';
		cohereModel = localStorage.getItem('atlas_cohere_model') || 'command-r-plus';
		githubToken = localStorage.getItem('atlas_github_token') || '';
		githubModel = localStorage.getItem('atlas_github_model') || 'gpt-4o-mini';
		cfAccountId = localStorage.getItem('atlas_cf_account_id') || '';
		cfToken = localStorage.getItem('atlas_cf_token') || '';
		cfModel = localStorage.getItem('atlas_cf_model') || '@cf/meta/llama-3.1-8b-instruct';
		
		embeddingsEngine = (localStorage.getItem('atlas_embeddings_engine') || 'local') as any;

		usePuterJs = localStorage.getItem('atlas_use_puterjs') !== 'false';
		autoSummarize = localStorage.getItem('atlas_auto_summarize') !== 'false';
		theme = localStorage.getItem('atlas_theme') || 'dark';
		feedRefreshInterval = localStorage.getItem('atlas_feed_refresh') || '1h';
		maxOfflineArticles = parseInt(localStorage.getItem('atlas_max_offline') || '100', 10);
	});

	function saveSettings() {
		// Save settings to LocalStorage
		localStorage.setItem('atlas_ai_provider', provider);
		localStorage.setItem('atlas_openrouter_key', openrouterKey);
		localStorage.setItem('atlas_openrouter_model', openrouterModel);
		localStorage.setItem('atlas_gemini_key', geminiKey);
		localStorage.setItem('atlas_gemini_model', geminiModel);
		localStorage.setItem('atlas_nvidia_key', nvidiaKey);
		localStorage.setItem('atlas_nvidia_url', nvidiaUrl);
		localStorage.setItem('atlas_nvidia_model', nvidiaModel);
		localStorage.setItem('atlas_mistral_key', mistralKey);
		localStorage.setItem('atlas_mistral_model', mistralModel);
		localStorage.setItem('atlas_hf_token', hfToken);
		localStorage.setItem('atlas_hf_model', hfModel);
		localStorage.setItem('atlas_vercel_gateway_url', vercelGatewayUrl);
		localStorage.setItem('atlas_vercel_gateway_key', vercelGatewayKey);
		localStorage.setItem('atlas_vercel_gateway_model', vercelGatewayModel);
		localStorage.setItem('atlas_opencodezen_key', opencodeZenKey);
		localStorage.setItem('atlas_opencodezen_model', opencodeZenModel);
		localStorage.setItem('atlas_cerebras_key', cerebrasKey);
		localStorage.setItem('atlas_cerebras_model', cerebrasModel);
		localStorage.setItem('atlas_groq_key', groqKey);
		localStorage.setItem('atlas_groq_model', groqModel);
		localStorage.setItem('atlas_cohere_key', cohereKey);
		localStorage.setItem('atlas_cohere_model', cohereModel);
		localStorage.setItem('atlas_github_token', githubToken);
		localStorage.setItem('atlas_github_model', githubModel);
		localStorage.setItem('atlas_cf_account_id', cfAccountId);
		localStorage.setItem('atlas_cf_token', cfToken);
		localStorage.setItem('atlas_cf_model', cfModel);
		
		localStorage.setItem('atlas_embeddings_engine', embeddingsEngine);

		localStorage.setItem('atlas_use_puterjs', usePuterJs.toString());
		localStorage.setItem('atlas_auto_summarize', autoSummarize.toString());
		localStorage.setItem('atlas_theme', theme);
		localStorage.setItem('atlas_feed_refresh', feedRefreshInterval);
		localStorage.setItem('atlas_max_offline', maxOfflineArticles.toString());

		saveSuccessMessage = "Settings saved successfully!";
		setTimeout(() => { saveSuccessMessage = ''; }, 3000);
	}

	async function runSemanticSearch() {
		if (!sandboxQuery.trim()) {
			sandboxError = "Please enter a search query.";
			return;
		}
		sandboxSearching = true;
		sandboxError = '';
		sandboxResults = [];

		const currentSettings = {
			provider,
			openrouterKey,
			openrouterModel,
			geminiKey,
			geminiModel,
			nvidiaKey,
			nvidiaUrl,
			nvidiaModel,
			mistralKey,
			mistralModel,
			hfToken,
			hfModel,
			vercelGatewayUrl,
			vercelGatewayKey,
			vercelGatewayModel,
			opencodeZenKey,
			opencodeZenModel,
			cerebrasKey,
			cerebrasModel,
			groqKey,
			groqModel,
			cohereKey,
			cohereModel,
			githubToken,
			githubModel,
			cfAccountId,
			cfToken,
			cloudflareModel: cfModel
		};

		try {
			// Get query vector
			const queryVector = await getEmbedding(
				sandboxQuery,
				currentSettings,
				embeddingsEngine
			);

			// Retrieve local articles
			const localArts = await dbLocal.articles.toArray();
			if (localArts.length === 0) {
				sandboxError = "No local articles found. Please pull feeds first.";
				sandboxSearching = false;
				return;
			}

			// Generate vectors on the fly for articles missing them
			const scored: { article: LocalArticle; score: number }[] = [];
			for (const art of localArts) {
				if (!art.embedding) {
					try {
						// Embed title + tldr/summary
						const contentToEmbed = `${art.title} ${art.tldr || art.summary || ''}`;
						art.embedding = await getEmbedding(
							contentToEmbed,
							currentSettings,
							embeddingsEngine
						);
						await dbLocal.articles.put(art);
					} catch (e) {
						console.error(`Failed to embed article ${art.id}`, e);
						continue;
					}
				}
				if (art.embedding) {
					const score = cosineSimilarity(queryVector, art.embedding);
					scored.push({ article: art, score });
				}
			}

			// Sort by similarity descending
			sandboxResults = scored
				.sort((a, b) => b.score - a.score)
				.slice(0, 3);

		} catch (e: any) {
			console.error("Semantic search failed:", e);
			sandboxError = e.message || "Failed running semantic search.";
		} finally {
			sandboxSearching = false;
		}
	}
</script>

<svelte:head>
	<title>Atlas — Settings</title>
</svelte:head>

<div class="space-y-6 pb-24">
	<!-- Page Header -->
	<div>
		<h2 class="font-display font-extrabold text-2xl tracking-tight text-white">SETTINGS</h2>
		<p class="text-xs text-neutral-400">Manage API keys, feeds, and configurations.</p>
	</div>

	<!-- Save Alert -->
	{#if saveSuccessMessage}
		<div class="p-3 text-xs bg-emerald-950/40 border border-cyber-emerald/30 text-cyber-emerald rounded-lg text-center font-bold animate-pulse">
			{saveSuccessMessage}
		</div>
	{/if}

	<!-- Profile card -->
	{#if $user}
		<div class="glass-card p-4 rounded-xl flex items-center justify-between border-white/5">
			<div class="flex items-center gap-3">
				<img src={$user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} alt="Avatar" class="w-10 h-10 rounded-full border border-white/10" />
				<div>
					<h3 class="text-sm font-bold text-white">{$user.displayName || 'Atlas Explorer'}</h3>
					<p class="text-xs text-neutral-500">{$user.email}</p>
				</div>
			</div>
			<button onclick={logOut} class="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/10 active:scale-95 transition-all">
				Log Out
			</button>
		</div>
	{/if}

	<!-- Settings Form -->
	<div class="space-y-6">
		<!-- 1. AI Routing Config -->
		<section class="glass-card p-5 rounded-xl border-white/5 space-y-4">
			<h3 class="font-display font-extrabold text-sm tracking-wide text-cyber-emerald uppercase">🧠 Active AI Provider</h3>
			
			<div class="space-y-2">
				<label for="provider" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Select Model Engine</label>
				<select id="provider" bind:value={provider} class="w-full px-3 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyber-emerald transition-all">
					<option value="puter">Puter.js (Free popup auth)</option>
					<option value="groq">Groq Console (Fast Llama)</option>
					<option value="gemini">Google AI Studio (Gemini Flash)</option>
					<option value="openrouter">OpenRouter (BYOK Multi-model)</option>
					<option value="cerebras">Cerebras Cloud (Fast Inference)</option>
					<option value="nvidia">NVIDIA NIM Endpoint</option>
					<option value="mistral">Mistral AI Platform</option>
					<option value="cohere">Cohere Dashboard</option>
					<option value="github">GitHub Models PAT</option>
					<option value="cloudflare">Cloudflare Workers AI</option>
				</select>
			</div>
		</section>

		<!-- 2. Embeddings Provider Config -->
		<section class="glass-card p-5 rounded-xl border-white/5 space-y-4">
			<h3 class="font-display font-extrabold text-sm tracking-wide text-cyber-emerald uppercase">🌐 Vector Embeddings Engine</h3>
			
			<div class="space-y-2">
				<label for="embed-engine" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Select Embeddings Generator</label>
				<select id="embed-engine" bind:value={embeddingsEngine} class="w-full px-3 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyber-emerald transition-all">
					<option value="local">Transformers.js (Local In-Browser)</option>
					<option value="cloudflare">Cloudflare Workers AI (BGE-Large)</option>
					<option value="hf">Hugging Face (Inference API)</option>
					<option value="cohere">Cohere Embed (v3.0 / v4.0)</option>
					<option value="nvidia">NVIDIA NIM Embeddings (QA-4)</option>
				</select>
			</div>
		</section>

		<!-- 3. API Keys Config -->
		<section class="glass-card p-5 rounded-xl border-white/5 space-y-4">
			<h3 class="font-display font-extrabold text-sm tracking-wide text-cyber-violet uppercase">🔑 Configure API Keys & Models (BYOK)</h3>
			<p class="text-[10px] text-neutral-500 leading-normal">Keys are stored locally in your browser storage and sent directly to the respective endpoints.</p>

			<div class="space-y-4">
				<!-- OpenRouter -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="or" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">OpenRouter Key</label>
						<input type="password" id="or" bind:value={openrouterKey} placeholder="sk-or-v1-..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="or-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="or-m" bind:value={openrouterModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Google AI Studio -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="gem" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Google AI Studio Key</label>
						<input type="password" id="gem" bind:value={geminiKey} placeholder="AIzaSy..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="gem-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="gem-m" bind:value={geminiModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Groq -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="grq" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Groq API Key</label>
						<input type="password" id="grq" bind:value={groqKey} placeholder="gsk_..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="grq-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="grq-m" bind:value={groqModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Cerebras -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="cer" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Cerebras Key</label>
						<input type="password" id="cer" bind:value={cerebrasKey} placeholder="csk-..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="cer-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="cer-m" bind:value={cerebrasModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- NVIDIA NIM -->
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label for="nim" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">NVIDIA NIM Key</label>
							<input type="password" id="nim" bind:value={nvidiaKey} placeholder="nvapi-..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
						<div class="space-y-1.5">
							<label for="nim-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
							<input type="text" id="nim-m" bind:value={nvidiaModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
					</div>
					<div class="space-y-1.5">
						<label for="nim-url" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">NVIDIA NIM Base URL</label>
						<input type="text" id="nim-url" bind:value={nvidiaUrl} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Mistral -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="mis" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Mistral Key</label>
						<input type="password" id="mis" bind:value={mistralKey} placeholder="Mistral API Key..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="mis-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="mis-m" bind:value={mistralModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Hugging Face -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="hf" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">HuggingFace Token</label>
						<input type="password" id="hf" bind:value={hfToken} placeholder="hf_..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="hf-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="hf-m" bind:value={hfModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Cohere -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="coh" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Cohere Key</label>
						<input type="password" id="coh" bind:value={cohereKey} placeholder="Cohere API Token..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="coh-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="coh-m" bind:value={cohereModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- GitHub Token -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="gh" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">GitHub PAT Token</label>
						<input type="password" id="gh" bind:value={githubToken} placeholder="ghp_..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="gh-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="gh-m" bind:value={githubModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- OpenCode Zen -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="zen" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">OpenCode Zen Token</label>
						<input type="password" id="zen" bind:value={opencodeZenKey} placeholder="OpenCode Zen API Token..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
					<div class="space-y-1.5">
						<label for="zen-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="zen-m" bind:value={opencodeZenModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Cloudflare -->
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label for="cf-id" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">CF Account ID</label>
							<input type="text" id="cf-id" bind:value={cfAccountId} placeholder="ID..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
						<div class="space-y-1.5">
							<label for="cf-tok" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">CF AI Token</label>
							<input type="password" id="cf-tok" bind:value={cfToken} placeholder="Token..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
					</div>
					<div class="space-y-1.5">
						<label for="cf-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Cloudflare Workers AI Model</label>
						<input type="text" id="cf-m" bind:value={cfModel} class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>

				<!-- Vercel Gateway URL -->
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label for="v-gw" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Vercel AI Gateway URL</label>
							<input type="url" id="v-gw" bind:value={vercelGatewayUrl} placeholder="https://gateway.ai.vercel.academy/..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
						<div class="space-y-1.5">
							<label for="v-gw-k" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Authorization Key (Optional)</label>
							<input type="password" id="v-gw-k" bind:value={vercelGatewayKey} placeholder="Bearer token..." class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-violet transition-all" />
						</div>
					</div>
					<div class="space-y-1.5">
						<label for="v-gw-m" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Model</label>
						<input type="text" id="v-gw-m" bind:value={vercelGatewayModel} placeholder="gpt-4o-mini" class="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyber-violet transition-all" />
					</div>
				</div>
			</div>
		</section>

		<!-- 4. Offline & PWA settings -->
		<section class="glass-card p-5 rounded-xl border-white/5 space-y-4">
			<h3 class="font-display font-extrabold text-sm tracking-wide text-cyber-orange uppercase">💾 Offline Caching</h3>
			
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-xs text-neutral-300 font-medium">Auto-summarize New Articles</span>
					<input type="checkbox" bind:checked={autoSummarize} class="rounded text-cyber-emerald focus:ring-cyber-emerald" />
				</div>
				<div class="flex items-center justify-between">
					<span class="text-xs text-neutral-300 font-medium">Use Puter.js Popups Fallback</span>
					<input type="checkbox" bind:checked={usePuterJs} class="rounded text-cyber-emerald focus:ring-cyber-emerald" />
				</div>
				<div class="space-y-1.5">
					<label for="offline-lim" class="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Max Offline Saved Articles ({maxOfflineArticles})</label>
					<input type="range" id="offline-lim" min="10" max="500" bind:value={maxOfflineArticles} class="w-full accent-cyber-orange" />
				</div>
			</div>
		</section>

		<!-- Save Button -->
		<button onclick={saveSettings} class="w-full py-3.5 rounded-lg bg-cyber-emerald text-black font-extrabold text-sm tracking-wide uppercase hover:bg-emerald-400 active:scale-98 transition-all">
			Save Settings
		</button>

		<!-- 5. Semantic Search Test Sandbox -->
		<section class="glass-card p-5 rounded-xl border-white/5 space-y-4">
			<h3 class="font-display font-extrabold text-sm tracking-wide text-cyber-orange uppercase">🔍 Semantic Search Sandbox</h3>
			<p class="text-[10px] text-neutral-500 leading-normal">
				Test real vector embeddings and cosine similarity against your locally cached database articles.
			</p>

			<div class="space-y-3">
				<div class="flex gap-2">
					<input type="text" bind:value={sandboxQuery} placeholder="Type a concept, e.g., 'WebGPU database' or 'privacy hacking'..." class="flex-grow px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-cyber-orange transition-all" />
					<button onclick={runSemanticSearch} disabled={sandboxSearching} class="px-4 py-2 bg-cyber-orange text-black text-xs font-bold rounded-lg hover:bg-orange-400 disabled:opacity-50 transition-all">
						{#if sandboxSearching}
							Searching...
						{:else}
							Search
						{/if}
					</button>
				</div>

				{#if sandboxError}
					<p class="text-[10px] text-red-500 font-bold">{sandboxError}</p>
				{/if}

				{#if sandboxResults.length > 0}
					<div class="space-y-2 pt-2 border-t border-white/5">
						<span class="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Top Semantic Matches</span>
						{#each sandboxResults as result}
							<div class="p-2.5 rounded bg-neutral-950 border border-white/5 space-y-1">
								<div class="flex justify-between items-center">
									<span class="text-[9px] font-bold text-cyber-emerald uppercase">{result.article.author || 'RSS Feed'}</span>
									<span class="text-[9px] font-display font-extrabold text-cyber-orange">Score: {Math.round(result.score * 100)}%</span>
								</div>
								<h5 class="text-xs font-bold text-white line-clamp-1">{result.article.title}</h5>
								<p class="text-[10px] text-neutral-400 line-clamp-1">{result.article.tldr || result.article.summary || ''}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
