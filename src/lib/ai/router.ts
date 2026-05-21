// Multi-provider AI LLM API Router with BYOK configuration

export interface AISettings {
	provider: string;
	openrouterKey?: string;
	openrouterModel?: string;
	geminiKey?: string;
	geminiModel?: string;
	nvidiaKey?: string;
	nvidiaUrl?: string;
	nvidiaModel?: string;
	mistralKey?: string;
	mistralModel?: string;
	hfToken?: string;
	hfModel?: string;
	vercelGatewayUrl?: string;
	vercelGatewayKey?: string;
	vercelGatewayModel?: string;
	opencodeZenKey?: string;
	opencodeZenModel?: string;
	cerebrasKey?: string;
	cerebrasModel?: string;
	groqKey?: string;
	groqModel?: string;
	cohereKey?: string;
	cohereModel?: string;
	githubToken?: string;
	githubModel?: string;
	cloudflareAccountId?: string;
	cloudflareToken?: string;
	cloudflareModel?: string;
	usePuterJs?: boolean;
}

export interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export interface AIResponse {
	text: string;
	providerUsed: string;
	modelUsed: string;
}

// Main LLM router
export async function getLLMCompletion(
	messages: ChatMessage[],
	settings: AISettings,
	systemPrompt?: string
): Promise<AIResponse> {
	const activeProvider = settings.provider || 'puter';
	
	// Prepend system prompt if provided
	let fullMessages = [...messages];
	if (systemPrompt) {
		fullMessages = [
			{ role: 'system', content: systemPrompt },
			...messages
		];
	}

	// 1. Puter.js (Client-side browser AI SDK)
	if (activeProvider === 'puter') {
		if (typeof window !== 'undefined' && (window as any).puter) {
			const puter = (window as any).puter;
			try {
				const models = await puter.ai.listModels();
				// Find biggest free model ending with :free
				const freeModels = models.filter((m: any) =>
					m.id.endsWith(':free') || m.id.includes('free')
				);
				const modelId = freeModels.length > 0 
					? freeModels[0].id 
					: 'essentialai/rnj-1-instruct';
				
				const response = await puter.ai.chat(fullMessages, {
					model: modelId
				});
				return {
					text: response.message.content || response,
					providerUsed: 'puter.js',
					modelUsed: modelId
				};
			} catch (e: any) {
				console.error("Puter.js error: ", e);
				throw new Error(`Puter.js failed: ${e.message || e}`);
			}
		} else {
			throw new Error("Puter.js is only available in the browser runtime.");
		}
	}

	// 2. Groq
	if (activeProvider === 'groq' && settings.groqKey) {
		const model = settings.groqModel || 'llama-3.3-70b-versatile';
		const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.groqKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Groq API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'groq',
			modelUsed: model
		};
	}

	// 3. Gemini / Google AI Studio
	if (activeProvider === 'gemini' && settings.geminiKey) {
		const model = settings.geminiModel || 'gemini-1.5-flash';
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiKey}`;
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: fullMessages.map(m => ({
					role: m.role === 'assistant' ? 'model' : 'user',
					parts: [{ text: m.content }]
				}))
			})
		});
		if (!res.ok) throw new Error(`Gemini API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.candidates[0].content.parts[0].text,
			providerUsed: 'gemini',
			modelUsed: model
		};
	}

	// 4. OpenRouter
	if (activeProvider === 'openrouter' && settings.openrouterKey) {
		const model = settings.openrouterModel || 'openrouter/free';
		const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.openrouterKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`OpenRouter API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'openrouter',
			modelUsed: model
		};
	}

	// 5. Cerebras
	if (activeProvider === 'cerebras' && settings.cerebrasKey) {
		const model = settings.cerebrasModel || 'llama3.1-8b';
		const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.cerebrasKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Cerebras API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'cerebras',
			modelUsed: model
		};
	}

	// 6. NVIDIA NIM
	if (activeProvider === 'nvidia' && settings.nvidiaKey) {
		const baseUrl = settings.nvidiaUrl || 'https://integrate.api.nvidia.com/v1';
		const model = settings.nvidiaModel || 'meta/llama-3.1-70b-instruct';
		const res = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.nvidiaKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`NVIDIA NIM returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'nvidia',
			modelUsed: model
		};
	}

	// 7. Mistral AI Platform / Codestral
	if (activeProvider === 'mistral' && settings.mistralKey) {
		const model = settings.mistralModel || 'mistral-large-latest';
		const url = model.includes('codestral') 
			? 'https://codestral.mistral.ai/v1/chat/completions' 
			: 'https://api.mistral.ai/v1/chat/completions';
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.mistralKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Mistral API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'mistral',
			modelUsed: model
		};
	}

	// 8. HuggingFace Inference API
	if (activeProvider === 'hf' && settings.hfToken) {
		const model = settings.hfModel || 'meta-llama/Llama-3-8b-instruct';
		const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.hfToken}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`HuggingFace API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'huggingface',
			modelUsed: model
		};
	}

	// 9. Vercel AI Gateway
	if (activeProvider === 'vercel' && settings.vercelGatewayUrl) {
		const model = settings.vercelGatewayModel || 'gpt-4o-mini';
		const res = await fetch(settings.vercelGatewayUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(settings.vercelGatewayKey && {
					'Authorization': `Bearer ${settings.vercelGatewayKey}`
				})
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Vercel Gateway returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'vercel-gateway',
			modelUsed: model
		};
	}

	// 10. OpenCode Zen
	if (activeProvider === 'opencodezen' && settings.opencodeZenKey) {
		const model = settings.opencodeZenModel || 'opencode/gpt-5.5';
		const res = await fetch('https://opencode.ai/zen/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.opencodeZenKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`OpenCode Zen returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'opencodezen',
			modelUsed: model
		};
	}

	// 11. Cohere Chat v2
	if (activeProvider === 'cohere' && settings.cohereKey) {
		const model = settings.cohereModel || 'command-r-plus';
		const res = await fetch('https://api.cohere.com/v2/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.cohereKey}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Cohere API returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.message.content[0].text,
			providerUsed: 'cohere',
			modelUsed: model
		};
	}

	// 12. GitHub Models
	if (activeProvider === 'github' && settings.githubToken) {
		const model = settings.githubModel || 'gpt-4o-mini';
		const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.githubToken}`
			},
			body: JSON.stringify({
				model,
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`GitHub Models returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.choices[0].message.content,
			providerUsed: 'github-models',
			modelUsed: model
		};
	}

	// 13. Cloudflare Workers AI
	if (
		activeProvider === 'cloudflare' &&
		settings.cloudflareAccountId &&
		settings.cloudflareToken
	) {
		const model = settings.cloudflareModel || '@cf/meta/llama-3.1-8b-instruct';
		const url = `https://api.cloudflare.com/client/v4/accounts/${settings.cloudflareAccountId}/ai/run/${model}`;
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.cloudflareToken}`
			},
			body: JSON.stringify({
				messages: fullMessages
			})
		});
		if (!res.ok) throw new Error(`Cloudflare Workers AI returned status ${res.status}`);
		const data = (await res.json()) as any;
		return {
			text: data.result.response || data.result.text || JSON.stringify(data.result),
			providerUsed: 'cloudflare-workers-ai',
			modelUsed: model
		};
	}

	// Fallback to error
	throw new Error(
		`AI Provider "${activeProvider}" is not properly configured with an API Key in Settings.`
	);
}

