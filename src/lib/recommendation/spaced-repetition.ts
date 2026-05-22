export interface SpacedRepetitionCard {
  id: string;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: string;
  lastReview: string | null;
}

export function createCard(): Partial<SpacedRepetitionCard> {
  return {
    due: new Date(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: "new",
    lastReview: null,
  };
}

export function scheduleReview(
  card: SpacedRepetitionCard,
  rating: number
): { card: SpacedRepetitionCard; log: unknown } {
  const now = new Date();
  const days: Record<number, number> = { 1: 1, 2: 3, 3: 7, 4: 14 };

  const newCard: SpacedRepetitionCard = {
    ...card,
    reps: card.reps + 1,
    lastReview: now.toISOString(),
    difficulty: Math.max(0, Math.min(10, card.difficulty + (rating < 3 ? 1 : -1))),
    stability: Math.max(1, card.stability + (rating < 3 ? -1 : days[rating] ?? 7)),
    elapsedDays: card.elapsedDays + (card.scheduledDays || 1),
    scheduledDays: days[rating] ?? 7,
    state: rating >= 3 ? "review" : "learning",
    due: new Date(now.getTime() + (days[rating] ?? 7) * 86400000),
  };

  return { card: newCard, log: { rating, timestamp: now } };
}

export function getDueCards(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
  const now = new Date();
  return cards.filter((c) => c.due <= now && c.state !== "new");
}
