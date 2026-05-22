"use client";

import { Target, Clock, CheckCircle } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  expiresAt?: string;
  completed: boolean;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progressPct = Math.min(100, (challenge.progress / challenge.target) * 100);
  const expires = challenge.expiresAt ? new Date(challenge.expiresAt) : null;
  const isExpired = expires && expires < new Date();

  return (
    <div className={`p-4 rounded-lg border ${challenge.completed ? "bg-emerald-900/10 border-emerald-800/30" : "bg-zinc-900 border-zinc-800"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${challenge.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
          {challenge.completed ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{challenge.title}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{challenge.description}</p>

          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{challenge.progress} / {challenge.target}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  challenge.completed ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {expires && !challenge.completed && (
            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-600">
              <Clock className="w-3 h-3" />
              {isExpired ? "Expired" : `Expires ${expires.toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
