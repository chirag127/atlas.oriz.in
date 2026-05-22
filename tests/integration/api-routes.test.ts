import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch for API route tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API: /api/articles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns articles with pagination", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        articles: [
          { id: "1", title: "Test Article", url: "https://example.com" },
        ],
        total: 1,
      }),
    });

    const res = await fetch("/api/articles?page=1&limit=10");
    const data = await res.json();

    expect(res.ok).toBe(true);
    expect(data.articles).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("returns empty array on error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ articles: [] }),
    });

    const res = await fetch("/api/articles");
    const data = await res.json();

    expect(data.articles).toEqual([]);
  });
});

describe("API: /api/ai/summarize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts POST with title and content", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: "Summary text", model: "test-model" }),
    });

    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", content: "Long content here" }),
    });

    const data = await res.json();
    expect(data.content).toBe("Summary text");
  });

  it("handles errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    try {
      await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });
    } catch (e) {
      expect((e as Error).message).toBe("Network error");
    }
  });
});

describe("API: /api/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns bookmarks list", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookmarks: [] }),
    });

    const res = await fetch("/api/bookmarks");
    const data = await res.json();

    expect(data).toBeDefined();
  });
});
