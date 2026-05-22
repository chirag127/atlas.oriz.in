import type { SpacedRepetitionCard } from "../recommendation/spaced-repetition";

export interface ExportData {
  version: number;
  exportedAt: string;
  bookmarks: unknown[];
  highlights: unknown[];
  notes: unknown[];
  collections: unknown[];
  settings: unknown[];
  fsrsCards: SpacedRepetitionCard[];
}

export function generateJsonExport(data: ExportData): string {
  return JSON.stringify(
    {
      atlas: true,
      version: data.version,
      exportedAt: data.exportedAt,
      bookmarks: data.bookmarks,
      highlights: data.highlights,
      notes: data.notes,
      collections: data.collections,
      settings: data.settings,
      fsrsCards: data.fsrsCards,
    },
    null,
    2
  );
}
