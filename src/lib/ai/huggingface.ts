import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://api-inference.huggingface.co/models";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.HUGGINGFACE_TOKEN;
  if (!key) throw new Error("HUGGINGFACE_TOKEN not set");

  const model = req.model ?? "meta-llama/Llama-3.3-70B-Instruct";
  const start = Date.now();

  const res = await fetch(`${BASE_URL}/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      inputs: req.prompt,
      parameters: {
        max_new_tokens: req.maxTokens ?? 2048,
        temperature: req.temperature ?? 0.7,
        return_full_text: false,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HuggingFace error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = Array.isArray(data)
    ? data[0]?.generated_text ?? ""
    : data.generated_text ?? "";

  return {
    content,
    model,
    provider: "huggingface",
    tokensUsed: { input: 0, output: 0 },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B", provider: "huggingface", contextLength: 131072, supportsVision: false, supportsTools: false, isFree: true, isReasoning: false },
    { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B", provider: "huggingface", contextLength: 32768, supportsVision: false, supportsTools: false, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "huggingface",
  name: "HuggingFace",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.HUGGINGFACE_TOKEN,
};

export const huggingfaceProvider = { impl: { send, listModels }, config };
