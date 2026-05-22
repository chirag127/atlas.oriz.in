import type { AIModel } from "./types";
import { getAllProviders } from "./provider-registry";

export async function discoverModels(providerId?: string): Promise<AIModel[]> {
  const providers = getAllProviders().filter(
    (p) => !providerId || p.id === providerId
  );
  const results: AIModel[] = [];

  for (const provider of providers) {
    try {
      const mod = await import(`./providers/${provider.id}`);
      const key = `${provider.id}Provider`;
      if (mod[key]?.impl?.listModels) {
        const models = await mod[key].impl.listModels();
        results.push(...models);
      }
    } catch {
      // Provider not available
    }
  }

  return results;
}

export async function refreshAllModels(): Promise<Record<string, AIModel[]>> {
  const providers = getAllProviders();
  const result: Record<string, AIModel[]> = {};

  await Promise.all(
    providers.map(async (p) => {
      try {
        const mod = await import(`./providers/${p.id}`);
        const key = `${p.id}Provider`;
        if (mod[key]?.impl?.listModels) {
          result[p.id] = await mod[key].impl.listModels();
        }
      } catch {
        result[p.id] = [];
      }
    })
  );

  return result;
}
