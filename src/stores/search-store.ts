import { create } from "zustand";

interface SearchState {
  query: string;
  results: Array<{
    id: string;
    title: string;
    summary?: string | null;
    url: string;
    publishedAt: string;
  }>;
  isSearching: boolean;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setResults: (results: SearchState["results"]) => void;
  setIsSearching: (v: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  isSearching: false,
  isOpen: false,
  recentSearches: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsSearching: (isSearching) => set({ isSearching }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: "", results: [] }),
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter((q) => q !== query),
      ].slice(0, 10),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
