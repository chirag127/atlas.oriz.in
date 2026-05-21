import { pipeline } from '@huggingface/transformers';
import type { AISettings } from './router';

let localExtractor: any = null;

/**
 * Generates local text embedding using Transformers.js in the browser
 */
export async function getLocalEmbedding(text: string): Promise<number[]> {
	if (typeof window === 'undefined') {
		throw new Error("Transformers.js embeddings must run in the browser.");
	}
	if (!localExtractor) {
		localExtractor = await pipeline(
			'feature-extraction',
			'Xenova/all-MiniLM-L6-v2',
			{ dtype: 'fp32' }
		);
	}
	const output = await localExtractor(text, {
		pooling: 'mean',
		normalize: true
	});
	return Array.from(output.data) as number[];
}

/**
 * Generates remote embeddings via API providers
 */
export async function getRemoteEmbedding(
	text: string,
	settings: AISettings,
	type: 'cloudflare' | 'hf' | 'cohere' | 'nvidia'
): Promise<number[]> {
	// 1. Cloudflare Workers AI
	if (type === 'cloudflare') {
		if (!settings.cloudflareAccountId || !settings.cloudflareToken) {
			throw new Error("Cloudflare Account ID and Token must be configured.");
		}
		const url = `https://api.cloudflare.com/client/v4/accounts/${settings.cloudflareAccountId}/ai/run/@cf/baai/bge-large-en-v1.5`;
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.cloudflareToken}`
			},
			body: JSON.stringify({ text: [text] })
		});
		if (!res.ok) {
			throw new Error(`CF Workers AI Embeddings returned status ${res.status}`);
		}
		const data = (await res.json()) as any;
		return data.result.data[0] as number[];
	}

	// 2. HuggingFace Inference API
	if (type === 'hf') {
		if (!settings.hfToken) {
			throw new Error("HuggingFace Token must be configured.");
		}
		const url = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.hfToken}`
			},
			body: JSON.stringify({ inputs: text })
		});
		if (!res.ok) {
			throw new Error(`HuggingFace Embeddings returned status ${res.status}`);
		}
		const data = (await res.json()) as any;
		// Handle returns which might be 1D array or nested
		if (Array.isArray(data)) {
			if (typeof data[0] === 'number') {
				return data as number[];
			}
			if (Array.isArray(data[0]) && typeof data[0][0] === 'number') {
				return data[0] as number[];
			}
		}
		throw new Error("Unexpected response format from HuggingFace embeddings.");
	}

	// 3. Cohere Embed API
	if (type === 'cohere') {
		if (!settings.cohereKey) {
			throw new Error("Cohere Key must be configured.");
		}
		const res = await fetch('https://api.cohere.com/v1/embed', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.cohereKey}`
			},
			body: JSON.stringify({
				texts: [text],
				model: 'embed-english-v3.0',
				input_type: 'search_document'
			})
		});
		if (!res.ok) {
			throw new Error(`Cohere Embed API returned status ${res.status}`);
		}
		const data = (await res.json()) as any;
		if (data.embeddings) {
			if (Array.isArray(data.embeddings)) {
				return data.embeddings[0] as number[];
			}
			if (data.embeddings.float && Array.isArray(data.embeddings.float)) {
				return data.embeddings.float[0] as number[];
			}
		}
		throw new Error("Unexpected response format from Cohere embeddings.");
	}

	// 4. NVIDIA NIM Embeddings
	if (type === 'nvidia') {
		if (!settings.nvidiaKey) {
			throw new Error("NVIDIA NIM Key must be configured.");
		}
		const baseUrl = settings.nvidiaUrl || 'https://integrate.api.nvidia.com/v1';
		const res = await fetch(`${baseUrl}/embeddings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${settings.nvidiaKey}`
			},
			body: JSON.stringify({
				input: text,
				model: 'nvidia/embed-qa-4'
			})
		});
		if (!res.ok) {
			throw new Error(`NVIDIA NIM Embeddings returned status ${res.status}`);
		}
		const data = (await res.json()) as any;
		return data.data[0].embedding as number[];
	}

	throw new Error(`Unsupported embedding provider: ${type}`);
}

/**
 * Unified helper to calculate embeddings using configured settings
 */
export async function getEmbedding(
	text: string,
	settings: AISettings,
	engine: 'local' | 'cloudflare' | 'hf' | 'cohere' | 'nvidia'
): Promise<number[]> {
	if (engine === 'local') {
		return getLocalEmbedding(text);
	}
	return getRemoteEmbedding(text, settings, engine);
}

/**
 * Calculates Cosine Similarity between two vector embeddings
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) return 0;
	let dotProduct = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < v1.length; i++) {
		dotProduct += v1[i] * v2[i];
		normA += v1[i] * v1[i];
		normB += v2[i] * v2[i];
	}
	if (normA === 0 || normB === 0) return 0;
	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
