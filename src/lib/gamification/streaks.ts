export function calculateStreak(
  lastActiveDate: Date | null,
  currentStreak: number
): { newStreak: number; isNewDay: boolean } {
  if (!lastActiveDate) {
    return { newStreak: 1, isNewDay: true };
  }

  const now = new Date();
  const last = new Date(lastActiveDate);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { newStreak: currentStreak, isNewDay: false };
  } else if (diffDays === 1) {
    return { newStreak: currentStreak + 1, isNewDay: true };
  } else {
    return { newStreak: 1, isNewDay: true };
  }
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your reading streak today!";
  if (streak === 1) return "You read today. Keep it going!";
  if (streak < 7) return `${streak} day streak! Building momentum.`;
  if (streak < 30) return `${streak} day streak! You're on fire!`;
  return `${streak} day streak! Legendary reader!`;
}
