import { create } from "zustand";

interface SettingsState {
  theme: "dark" | "light" | "system";
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  maxContentWidth: number;
  primaryAiProvider: string;
  aiProviderPriority: string[];
  autoSummarize: boolean;
  gamificationEnabled: boolean;
  pushEnabled: boolean;
  ttsVoice: string | null;
  ttsSpeed: number;
  offlineArticleCount: number;
  indiaBoostEnabled: boolean;
  antiClickbaitStrength: "off" | "light" | "medium" | "heavy";
  onboardingComplete: boolean;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: number) => void;
  setMaxContentWidth: (width: number) => void;
  setPrimaryAiProvider: (provider: string) => void;
  setAiProviderPriority: (priority: string[]) => void;
  setAutoSummarize: (auto: boolean) => void;
  setGamificationEnabled: (enabled: boolean) => void;
  setPushEnabled: (enabled: boolean) => void;
  setTtsVoice: (voice: string | null) => void;
  setTtsSpeed: (speed: number) => void;
  setOfflineArticleCount: (count: number) => void;
  setIndiaBoostEnabled: (enabled: boolean) => void;
  setAntiClickbaitStrength: (strength: "off" | "light" | "medium" | "heavy") => void;
  setOnboardingComplete: (complete: boolean) => void;
  loadFromServer: (data: Record<string, unknown>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "dark",
  fontSize: 18,
  fontFamily: "Newsreader",
  lineHeight: 1.7,
  maxContentWidth: 680,
  primaryAiProvider: "puter",
  aiProviderPriority: ["puter", "gemini", "groq", "openrouter"],
  autoSummarize: true,
  gamificationEnabled: true,
  pushEnabled: false,
  ttsVoice: null,
  ttsSpeed: 1.0,
  offlineArticleCount: 50,
  indiaBoostEnabled: true,
  antiClickbaitStrength: "medium",
  onboardingComplete: false,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setMaxContentWidth: (maxContentWidth) => set({ maxContentWidth }),
  setPrimaryAiProvider: (provider) => set({ primaryAiProvider: provider }),
  setAiProviderPriority: (priority) => set({ aiProviderPriority: priority }),
  setAutoSummarize: (auto) => set({ autoSummarize: auto }),
  setGamificationEnabled: (enabled) => set({ gamificationEnabled: enabled }),
  setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
  setTtsVoice: (voice) => set({ ttsVoice: voice }),
  setTtsSpeed: (speed) => set({ ttsSpeed: speed }),
  setOfflineArticleCount: (count) => set({ offlineArticleCount: count }),
  setIndiaBoostEnabled: (enabled) => set({ indiaBoostEnabled: enabled }),
  setAntiClickbaitStrength: (strength) => set({ antiClickbaitStrength: strength }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  loadFromServer: (data) =>
    set({
      theme: (data.theme as "dark" | "light" | "system") ?? "dark",
      fontSize: (data.fontSize as number) ?? 18,
      fontFamily: (data.fontFamily as string) ?? "Newsreader",
      lineHeight: (data.lineHeight as number) ?? 1.7,
      maxContentWidth: (data.maxContentWidth as number) ?? 680,
      primaryAiProvider: (data.primaryAiProvider as string) ?? "puter",
      aiProviderPriority: (data.aiProviderPriority as string[]) ?? ["puter", "gemini", "groq", "openrouter"],
      autoSummarize: (data.autoSummarize as boolean) ?? true,
      gamificationEnabled: (data.gamificationEnabled as boolean) ?? true,
      pushEnabled: (data.pushEnabled as boolean) ?? false,
      ttsVoice: (data.ttsVoice as string) ?? null,
      ttsSpeed: (data.ttsSpeed as number) ?? 1.0,
      offlineArticleCount: (data.offlineArticleCount as number) ?? 50,
      indiaBoostEnabled: (data.indiaBoostEnabled as boolean) ?? true,
      antiClickbaitStrength: (data.antiClickbaitStrength as "off" | "light" | "medium" | "heavy") ?? "medium",
      onboardingComplete: (data.onboardingComplete as boolean) ?? false,
    }),
}));
