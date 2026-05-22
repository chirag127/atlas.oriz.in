"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const INTERESTS = [
  "AI & Machine Learning", "Web Development", "Mobile Development", "Cybersecurity",
  "Finance & Investing", "Productivity", "Open Source", "Privacy",
  "Startups", "Cloud Computing", "DevOps", "Data Science",
  "Blockchain", "Gaming", "Science", "Design",
  "Marketing", "Leadership", "Health Tech", "Climate Tech",
  "Robotics", "Quantum Computing", "Edge Computing", "AR/VR",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const complete = () => {
    // Save interests and redirect
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-atlas-bg-primary">
      <div className="w-full max-w-lg">
        {step === 0 && (
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-2">Welcome to Atlas</h1>
            <p className="text-atlas-text-secondary mb-8">
              Your personal intelligence feed. Let&apos;s set up your interests.
            </p>
            <Button onClick={() => setStep(1)}>Get Started</Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-2">What interests you?</h2>
            <p className="text-sm text-atlas-text-secondary mb-6">
              Select at least 5 topics to personalize your feed.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-ui transition-colors ${
                    selectedInterests.includes(interest)
                      ? "bg-atlas-accent-emerald text-white"
                      : "bg-atlas-bg-tertiary text-atlas-text-secondary hover:text-atlas-text-primary"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-atlas-text-muted">
                {selectedInterests.length} selected
              </span>
              <Button
                onClick={() => setStep(2)}
                disabled={selectedInterests.length < 5}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="font-display text-xl font-bold mb-2">You&apos;re all set!</h2>
            <p className="text-atlas-text-secondary mb-6">
              Atlas will now build your personalized feed. You can always adjust your interests in settings.
            </p>
            <Button onClick={complete}>Start Reading</Button>
          </div>
        )}
      </div>
    </div>
  );
}
