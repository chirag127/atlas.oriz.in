"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Preferences {
  interests: string[];
  excludedSources: string[];
  readingSpeed: number;
  autoTag: boolean;
}

export function PreferencesSection() {
  const [prefs, setPrefs] = useState<Preferences>({
    interests: [],
    excludedSources: [],
    readingSpeed: 200,
    autoTag: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) setPrefs((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />;
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-between py-2 cursor-pointer">
        <div>
          <span className="text-sm text-zinc-300">Auto-tag articles</span>
          <p className="text-xs text-zinc-500">Automatically generate tags using AI</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.autoTag}
          onChange={(e) => setPrefs((p) => ({ ...p, autoTag: e.target.checked }))}
          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600"
        />
      </label>

      <div className="py-2">
        <span className="text-sm text-zinc-300 block mb-2">Reading speed</span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={100}
            max={400}
            step={10}
            value={prefs.readingSpeed}
            onChange={(e) => setPrefs((p) => ({ ...p, readingSpeed: parseInt(e.target.value, 10) }))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-sm text-zinc-400 w-12 text-right">{prefs.readingSpeed} wpm</span>
        </div>
      </div>
    </div>
  );
}
