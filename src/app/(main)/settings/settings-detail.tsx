"use client";

import { SettingsSection } from "./page";
import {
  AISettings,
  DiscoverySettings,
  ReadingSettings,
  AppearanceSettings,
  AboutSettings,
} from "@/components/settings/settings-panels";

export function SettingsDetail({ section }: { section: SettingsSection }) {
  switch (section) {
    case "ai":
      return <AISettings />;
    case "discovery":
      return <DiscoverySettings />;
    case "reading":
      return <ReadingSettings />;
    case "appearance":
      return <AppearanceSettings />;
    case "about":
      return <AboutSettings />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-atlas-text-secondary font-ui">Settings panel coming soon.</p>
        </div>
      );
  }
}
