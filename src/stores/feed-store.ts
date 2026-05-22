import { create } from "zustand";

export interface Article {
  id: string;
  feedId: string | null;
  url: string;
  title: string;
  author: string | null;
  content: string | null;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  wordCount: number;
  readingTime: number;
  tags: string[];
  aiSummary: string | null;
  aiTags: string[];
  qualityScore: number;
  sourceName?: string;
  sourceIcon?: string;
  isBookmarked?: boolean;
  isRead?: boolean;
}

interface FeedState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  activeCategory: string | null;
  searchQuery: string;
  setArticles: (articles: Article[]) => void;
  appendArticles: (articles: Article[]) => void;
  setSelectedArticle: (article: Article | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  toggleBookmark: (id: string) => void;
  markRead: (id: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  articles: [],
  selectedArticle: null,
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  activeCategory: null,
  searchQuery: "",
  setArticles: (articles) => set({ articles }),
  appendArticles: (articles) =>
    set((state) => ({ articles: [...state.articles, ...articles] })),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setActiveCategory: (category) => set({ activeCategory: category, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  updateArticle: (id, updates) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  toggleBookmark: (id) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a
      ),
    })),
  markRead: (id) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      ),
    })),
}));
