"use client";

import { useState, useEffect } from "react";

interface GamificationData {
  points: number;
  level: number;
  streak: number;
  longestStreak: number;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt?: string;
  }>;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
  }>;
}

export function useGamification() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gamification")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return {
    points: data?.points ?? 0,
    level: data?.level ?? 1,
    streak: data?.streak ?? 0,
    longestStreak: data?.longestStreak ?? 0,
    badges: data?.badges ?? [],
    challenges: data?.challenges ?? [],
    loading,
  };
}
