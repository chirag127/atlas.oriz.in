import type { AIProvider, AIRequest, AIResponse } from "./types";

async function send(req: AIRequest): Promise<AIResponse> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) throw new Error("Cloudflare AI not configured");

  const model = req.model ?? "@cf/meta/llama-3.3-70b-instruct";
  const start = Date.now();

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: [
          ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
          { role: "user", content: req.prompt },
        ],
        max_tokens: req.maxTokens ?? 2048,
        temperature: req.temperature ?? 0.7,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudflare AI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.result?.response ?? "",
    model,
    provider: "cloudflare",
    tokensUsed: { input: 0, output: 0 },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "@cf/meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", provider: "cloudflare", contextLength: 131072, supportsVision: false, supportsTools: false, isFree: true, isReasoning: false },
    { id: "@cf/qwen/qwen2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B", provider: "cloudflare", contextLength: 32768, supportsVision: false, supportsTools: false, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "cloudflare",
  name: "Cloudflare Workers AI",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
};

export const cloudflareProvider = { impl: { send, listModels }, config };
