"use client";

import { Check, Lock, Medal } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const icons: Record<string, React.ReactNode> = {
  medal: <Medal className="w-5 h-5" />,
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const unlocked = !!achievement.unlockedAt;
  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        unlocked ? "bg-zinc-900 border-zinc-700" : "bg-zinc-950 border-zinc-800 opacity-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            unlocked ? "bg-amber-500/10 text-amber-400" : "bg-zinc-900 text-zinc-600"
          }`}
        >
          {icons[achievement.icon] ?? <Medal className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium truncate ${unlocked ? "text-white" : "text-zinc-500"}`}>
              {achievement.title}
            </p>
            {unlocked ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
            )}
          </div>
          <p className="text-xs text-zinc-500 truncate">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
