export interface AIProvider {
  id: string;
  name: string;
  requiresKey: boolean;
  isClientSide: boolean;
  models: AIModel[];
  isConfigured: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  supportsVision: boolean;
  supportsTools: boolean;
  isFree: boolean;
  isReasoning: boolean;
}

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  provider?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  image?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed: { input: number; output: number };
  duration: number;
}

export type AITask =
  | "summarize"
  | "chat"
  | "tags"
  | "digest"
  | "eli5"
  | "insights"
  | "quality"
  | "embed";
