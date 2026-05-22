import { describe, it, expect } from "vitest";
import { generateJsonExport } from "@/lib/export/json";
import type { SpacedRepetitionCard } from "@/lib/recommendation/spaced-repetition";

describe("generateJsonExport", () => {
  it("returns valid JSON string with atlas metadata", () => {
    const now = "2026-05-22T00:00:00.000Z";
    const result = generateJsonExport({
      version: 1,
      exportedAt: now,
      bookmarks: [],
      highlights: [],
      notes: [],
      collections: [],
      settings: [],
      fsrsCards: [],
    });

    const parsed = JSON.parse(result);
    expect(parsed.atlas).toBe(true);
    expect(parsed.version).toBe(1);
    expect(parsed.exportedAt).toBe(now);
  });

  it("includes fsrsCards in output", () => {
    const card: SpacedRepetitionCard = {
      id: "card-1",
      difficulty: 5,
      stability: 10,
      due: new Date(),
      elapsedDays: 0,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: "new",
      lastReview: null,
    };

    const result = generateJsonExport({
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks: [],
      highlights: [],
      notes: [],
      collections: [],
      settings: [],
      fsrsCards: [card],
    });

    const parsed = JSON.parse(result);
    expect(parsed.fsrsCards).toHaveLength(1);
    expect(parsed.fsrsCards[0].id).toBe("card-1");
  });
});
