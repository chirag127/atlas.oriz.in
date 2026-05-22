"use client";

import { Flame } from "lucide-react";

interface StreakDisplayProps {
  current: number;
  longest: number;
}

export function StreakDisplay({ current, longest }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Flame className={`w-5 h-5 ${current > 0 ? "text-orange-400" : "text-zinc-600"}`} />
        <div>
          <p className="text-lg font-bold text-white">{current}</p>
          <p className="text-xs text-zinc-500">day streak</p>
        </div>
      </div>
      <div className="h-8 w-px bg-zinc-800" />
      <div>
        <p className="text-lg font-bold text-zinc-400">{longest}</p>
        <p className="text-xs text-zinc-500">longest</p>
      </div>
    </div>
  );
}
