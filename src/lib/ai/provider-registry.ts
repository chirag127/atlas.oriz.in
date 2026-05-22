import type { AIProvider, AIRequest, AIResponse, AITask } from "./types";
import { puterProvider } from "./puter";
import { geminiProvider } from "./gemini";
import { groqProvider } from "./groq";
import { cerebrasProvider } from "./cerebras";
import { openrouterProvider } from "./openrouter";
import { nvidiaProvider } from "./nvidia";
import { mistralProvider } from "./mistral";
import { cohereProvider } from "./cohere";
import { huggingfaceProvider } from "./huggingface";
import { githubProvider } from "./github";
import { cloudflareProvider } from "./cloudflare";
import { vercelGatewayProvider } from "./vercel-gateway";
import { opencodeZenProvider } from "./opencode-zen";

type ProviderImpl = {
  send: (req: AIRequest) => Promise<AIResponse>;
  listModels: () => Promise<AIProvider["models"]>;
};

const providers = new Map<string, ProviderImpl>();
const providerConfigs = new Map<string, AIProvider>();

export function registerProvider(id: string, impl: ProviderImpl, config: AIProvider) {
  providers.set(id, impl);
  providerConfigs.set(id, config);
}

export function getProvider(id: string): ProviderImpl | undefined {
  return providers.get(id);
}

export function getProviderConfig(id: string): AIProvider | undefined {
  return providerConfigs.get(id);
}

export function getAllProviders(): AIProvider[] {
  return Array.from(providerConfigs.values());
}

export function getConfiguredProviders(): AIProvider[] {
  return getAllProviders().filter((p) => p.isConfigured || !p.requiresKey);
}

export async function sendWithFallback(req: AIRequest, priority?: string[]): Promise<AIResponse> {
  const order = priority ?? ["puter", "gemini", "groq", "cerebras", "openrouter"];
  const errors: string[] = [];

  for (const providerId of order) {
    const impl = providers.get(providerId);
    const config = providerConfigs.get(providerId);
    if (!impl || !config) continue;
    if (config.requiresKey && !config.isConfigured) continue;

    try {
      return await impl.send(req);
    } catch (e) {
      errors.push(`${providerId}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  throw new Error(`All providers failed:\n${errors.join("\n")}`);
}

export function getTaskModel(task: AITask, settings?: Record<string, string>): string | undefined {
  return settings?.[`${task}Model`];
}

let initialized = false;

export async function initializeProviders() {
  if (initialized) return;
  initialized = true;

  registerProvider("puter", puterProvider.impl, puterProvider.config);
  registerProvider("gemini", geminiProvider.impl, geminiProvider.config);
  registerProvider("groq", groqProvider.impl, groqProvider.config);
  registerProvider("cerebras", cerebrasProvider.impl, cerebrasProvider.config);
  registerProvider("openrouter", openrouterProvider.impl, openrouterProvider.config);
  registerProvider("nvidia", nvidiaProvider.impl, nvidiaProvider.config);
  registerProvider("mistral", mistralProvider.impl, mistralProvider.config);
  registerProvider("cohere", cohereProvider.impl, cohereProvider.config);
  registerProvider("huggingface", huggingfaceProvider.impl, huggingfaceProvider.config);
  registerProvider("github", githubProvider.impl, githubProvider.config);
  registerProvider("cloudflare", cloudflareProvider.impl, cloudflareProvider.config);
  registerProvider("vercel-gateway", vercelGatewayProvider.impl, vercelGatewayProvider.config);
  registerProvider("opencode-zen", opencodeZenProvider.impl, opencodeZenProvider.config);
}
