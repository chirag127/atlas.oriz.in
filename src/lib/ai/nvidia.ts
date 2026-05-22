import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://integrate.api.nvidia.com/v1";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY not set");

  const model = req.model ?? "nvidia/llama-3.1-nemotron-70b-instruct";
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
    throw new Error(`NVIDIA error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model,
    provider: "nvidia",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Nemotron 70B", provider: "nvidia", contextLength: 131072, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
    { id: "nvidia/nemotron-3-super-120b-a12b", name: "Nemotron 3 Super 120B", provider: "nvidia", contextLength: 1000000, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "nvidia",
  name: "NVIDIA NIM",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.NVIDIA_API_KEY,
};

export const nvidiaProvider = { impl: { send, listModels }, config };
