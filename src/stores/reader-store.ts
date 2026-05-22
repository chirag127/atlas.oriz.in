import { create } from "zustand";

export interface Article {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  url: string;
  sourceName?: string;
  author?: string | null;
  publishedAt: string;
  feedId?: string | null;
  readingTime?: number;
  tags: string[];
  isBookmarked: boolean;
}

interface ReaderState {
  currentArticle: Article | null;
  isOpen: boolean;
  aiPanelOpen: boolean;
  fontSize: "small" | "medium" | "large";
  readingWidth: "narrow" | "medium" | "wide";
  openReader: (article: Article) => void;
  closeReader: () => void;
  toggleAIPanel: () => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
  setReadingWidth: (width: "narrow" | "medium" | "wide") => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentArticle: null,
  isOpen: false,
  aiPanelOpen: false,
  fontSize: "medium",
  readingWidth: "medium",
  openReader: (article) =>
    set({ currentArticle: article, isOpen: true, aiPanelOpen: false }),
  closeReader: () =>
    set({ currentArticle: null, isOpen: false, aiPanelOpen: false }),
  toggleAIPanel: () =>
    set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setFontSize: (fontSize) => set({ fontSize }),
  setReadingWidth: (readingWidth) => set({ readingWidth }),
}));
