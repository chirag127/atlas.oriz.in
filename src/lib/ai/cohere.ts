import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://api.cohere.com/v2";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.COHERE_API_KEY;
  if (!key) throw new Error("COHERE_API_KEY not set");

  const model = req.model ?? "command-r";
  const start = Date.now();

  const res = await fetch(`${BASE_URL}/chat`, {
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
    throw new Error(`Cohere error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.message?.content?.map((c: { text?: string }) => c.text).join("") ?? "";

  return {
    content,
    model,
    provider: "cohere",
    tokensUsed: {
      input: data.usage?.tokens?.input_tokens ?? 0,
      output: data.usage?.tokens?.output_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "command-r", name: "Command R", provider: "cohere", contextLength: 128000, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
    { id: "command-r-plus", name: "Command R+", provider: "cohere", contextLength: 128000, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "cohere",
  name: "Cohere",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.COHERE_API_KEY,
};

export const cohereProvider = { impl: { send, listModels }, config };
