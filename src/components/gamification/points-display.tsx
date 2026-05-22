"use client";

import { Award, TrendingUp } from "lucide-react";

interface PointsDisplayProps {
  total: number;
  level: number;
  nextLevelAt: number;
}

export function PointsDisplay({ total, level, nextLevelAt }: PointsDisplayProps) {
  const progress = Math.min(100, (total / nextLevelAt) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-white">Level {level}</p>
            <p className="text-xs text-zinc-500">{total.toLocaleString()} total points</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{total.toLocaleString()} / {nextLevelAt.toLocaleString()}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
