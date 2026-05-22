import type { AIProvider, AIRequest, AIResponse } from "./types";

// Puter.js — client-side, zero-config, user-pays
// No API key needed. Works via user's Puter account in browser.
// This is a stub for server-side; actual usage happens client-side.

async function send(_req: AIRequest): Promise<AIResponse> {
  throw new Error("Puter.js is client-side only — use window.puter.ai.chat()");
}

async function listModels() {
  return [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "puter", contextLength: 128000, supportsVision: true, supportsTools: true, isFree: true, isReasoning: false },
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "puter", contextLength: 200000, supportsVision: true, supportsTools: true, isFree: true, isReasoning: false },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "puter", contextLength: 1000000, supportsVision: true, supportsTools: true, isFree: true, isReasoning: false },
    { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "puter", contextLength: 1000000, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
    { id: "llama-3.3-70b", name: "Llama 3.3 70B", provider: "puter", contextLength: 131072, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "puter",
  name: "Puter.js (Client-Side)",
  requiresKey: false,
  isClientSide: true,
  models: [],
  isConfigured: true,
};

export const puterProvider = { impl: { send, listModels }, config };
