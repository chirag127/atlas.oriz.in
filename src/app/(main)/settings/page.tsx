"use client";

import { useState } from "react";
import {
  Cpu, Globe, BookOpen, Bell, Palette, Volume2,
  Wifi, Trophy, Database, User, Info, ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SettingsDetail } from "./settings-detail";

export type SettingsSection =
  | "ai" | "discovery" | "reading" | "notifications" | "appearance"
  | "tts" | "offline" | "gamification" | "data" | "account" | "about";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);

  const sections = [
    { id: "ai" as const, label: "AI Providers", icon: Cpu, description: "Configure AI models and API keys" },
    { id: "discovery" as const, label: "Discovery", icon: Globe, description: "Web search and content discovery" },
    { id: "reading" as const, label: "Reading", icon: BookOpen, description: "Font, size, reader mode" },
    { id: "notifications" as const, label: "Notifications", icon: Bell, description: "Push, email, digest" },
    { id: "appearance" as const, label: "Appearance", icon: Palette, description: "Theme and layout" },
    { id: "tts" as const, label: "Text-to-Speech", icon: Volume2, description: "Voice and speed" },
    { id: "offline" as const, label: "Offline", icon: Wifi, description: "Cache and storage" },
    { id: "gamification" as const, label: "Gamification", icon: Trophy, description: "Streaks and scores" },
    { id: "data" as const, label: "Data & Export", icon: Database, description: "Backup and export" },
    { id: "account" as const, label: "Account", icon: User, description: "Profile and auth" },
    { id: "about" as const, label: "About", icon: Info, description: "Version and legal" },
  ];

  if (activeSection) {
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          className="text-sm text-atlas-text-muted hover:text-atlas-text-primary font-ui mb-4 flex items-center gap-1"
        >
          ← Back to Settings
        </button>
        <SettingsDetail section={activeSection} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-2">
        {sections.map(({ id, label, icon: Icon, description }) => (
          <Card
            key={id}
            hover
            onClick={() => setActiveSection(id)}
            className="p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-atlas-bg-tertiary flex items-center justify-center">
                <Icon size={20} className="text-atlas-accent-emerald" />
              </div>
              <div className="flex-1">
                <div className="font-ui font-medium text-sm">{label}</div>
                <div className="text-xs text-atlas-text-muted">{description}</div>
              </div>
              <ChevronRight size={16} className="text-atlas-text-muted" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
