"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface Settings {
  theme: "dark" | "system" | "light";
  fontSize: "small" | "medium" | "large";
  readingWidth: "narrow" | "medium" | "wide";
  dailyDigest: boolean;
  weeklyRecap: boolean;
  pushNotifications: boolean;
  interests: string[];
  [key: string]: unknown;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  fontSize: "medium",
  readingWidth: "medium",
  dailyDigest: false,
  weeklyRecap: false,
  pushNotifications: false,
  interests: [],
};

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) setSettings({ ...DEFAULT_SETTINGS, ...data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Section title="Appearance">
        <Select label="Theme" value={settings.theme} onChange={(v) => update("theme", v as Settings["theme"])} options={[
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
        ]} />
        <Select label="Font size" value={settings.fontSize} onChange={(v) => update("fontSize", v as Settings["fontSize"])} options={[
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ]} />
        <Select label="Reading width" value={settings.readingWidth} onChange={(v) => update("readingWidth", v as Settings["readingWidth"])} options={[
          { value: "narrow", label: "Narrow" },
          { value: "medium", label: "Medium" },
          { value: "wide", label: "Wide" },
        ]} />
      </Section>

      <Section title="Notifications">
        <Toggle label="Daily digest" description="Receive a daily summary of top articles" checked={settings.dailyDigest} onChange={(v) => update("dailyDigest", v)} />
        <Toggle label="Weekly recap" description="Weekly reading statistics" checked={settings.weeklyRecap} onChange={(v) => update("weeklyRecap", v)} />
        <Toggle label="Push notifications" description="Browser notifications for new articles" checked={settings.pushNotifications} onChange={(v) => update("pushNotifications", v)} />
      </Section>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 rounded-lg text-sm text-white transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : saved ? "Saved!" : "Save settings"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <div>
        <span className="text-sm text-zinc-300">{label}</span>
        {description && <p className="text-xs text-zinc-500">{description}</p>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}
