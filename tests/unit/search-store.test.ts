import { describe, it, expect } from "vitest";
import { useSearchStore } from "@/stores/search-store";

describe("search-store", () => {
  it("starts with default values", () => {
    const state = useSearchStore.getState();
    expect(state.query).toBe("");
    expect(state.results).toEqual([]);
    expect(state.isSearching).toBe(false);
    expect(state.isOpen).toBe(false);
    expect(state.recentSearches).toEqual([]);
  });

  it("setQuery updates the query", () => {
    useSearchStore.getState().setQuery("AI technology");
    expect(useSearchStore.getState().query).toBe("AI technology");
  });

  it("addRecentSearch adds to front and deduplicates", () => {
    useSearchStore.getState().addRecentSearch("machine learning");
    useSearchStore.getState().addRecentSearch("AI");
    useSearchStore.getState().addRecentSearch("machine learning");

    const searches = useSearchStore.getState().recentSearches;
    expect(searches).toHaveLength(2);
    expect(searches[0]).toBe("machine learning");
  });

  it("clearRecentSearches empties the list", () => {
    useSearchStore.getState().addRecentSearch("test");
    useSearchStore.getState().clearRecentSearches();
    expect(useSearchStore.getState().recentSearches).toEqual([]);
  });

  it("openSearch and closeSearch toggle state", () => {
    useSearchStore.getState().openSearch();
    expect(useSearchStore.getState().isOpen).toBe(true);

    useSearchStore.getState().setQuery("something");
    useSearchStore.getState().closeSearch();
    expect(useSearchStore.getState().isOpen).toBe(false);
    expect(useSearchStore.getState().query).toBe("");
    expect(useSearchStore.getState().results).toEqual([]);
  });
});
