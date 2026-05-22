import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://models.inference.ai.azure.com";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.GITHUB_TOKEN;
  if (!key) throw new Error("GITHUB_TOKEN not set");

  const model = req.model ?? "gpt-4o-mini";
  const start = Date.now();

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
        { role: "user", content: req.prompt },
      ],
      max_tokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub Models error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model,
    provider: "github",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "github", contextLength: 128000, supportsVision: true, supportsTools: true, isFree: true, isReasoning: false },
    { id: "gpt-4o", name: "GPT-4o", provider: "github", contextLength: 128000, supportsVision: true, supportsTools: true, isFree: true, isReasoning: false },
    { id: "Phi-3.5-mini-instruct", name: "Phi 3.5 Mini", provider: "github", contextLength: 131072, supportsVision: false, supportsTools: false, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "github",
  name: "GitHub Models",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.GITHUB_TOKEN,
};

export const githubProvider = { impl: { send, listModels }, config };
