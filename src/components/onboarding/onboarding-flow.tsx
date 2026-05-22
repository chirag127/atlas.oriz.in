"use client";

import { useState } from "react";
import { Sparkles, BookOpen, Brain, Rocket, ChevronRight } from "lucide-react";
import { InterestPicker } from "./interest-picker";

const STEPS = [
  {
    id: "welcome",
    icon: Sparkles,
    title: "Welcome to Atlas",
    description: "Your personal reading assistant. Discover, bookmark, and understand the articles that matter to you.",
  },
  {
    id: "interests",
    icon: BookOpen,
    title: "Pick Your Interests",
    description: "Select topics you care about. Atlas will find the best articles for you.",
  },
  {
    id: "features",
    icon: Brain,
    title: "AI-Powered Reading",
    description: "Get summaries, insights, and explanations powered by AI. Never miss the key points.",
  },
  {
    id: "done",
    icon: Rocket,
    title: "You're Ready!",
    description: "Start exploring your feed. Bookmark articles, take notes, and build your knowledge graph.",
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);

  const current = STEPS[step];
  const Icon = current.icon;

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingCompleted: true, interests }),
      }).catch(() => {});
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
            <p className="text-sm text-zinc-400">{current.description}</p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
            <p className="text-sm text-zinc-400">{current.description}</p>
          </div>
        )}

        {step === 1 && <InterestPicker selected={interests} onChange={setInterests} />}

        {step === 3 && (
          <div className="space-y-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                <s.icon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-300">{s.title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${i === step ? "bg-blue-400" : "bg-zinc-700"}`} />
            ))}
          </div>
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            {step === STEPS.length - 1 ? "Start Reading" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
