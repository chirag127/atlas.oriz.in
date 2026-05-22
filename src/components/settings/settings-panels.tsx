"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AISettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">AI Providers</h2>
      <p className="text-sm text-atlas-text-secondary">
        Configure your AI providers. Puter.js works with zero configuration — no API key needed.
        Add your own keys for additional providers and higher rate limits.
      </p>

      <div className="space-y-3">
        {[
          { name: "Puter.js", status: "Active (zero-config)", color: "text-atlas-accent-emerald" },
          { name: "Google Gemini", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "Groq", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "OpenRouter", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "Cerebras", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "NVIDIA NIM", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "Mistral", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "Cohere", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "HuggingFace", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "GitHub Models", status: "Not configured", color: "text-atlas-text-muted" },
          { name: "Cloudflare AI", status: "Not configured", color: "text-atlas-text-muted" },
        ].map((provider) => (
          <Card key={provider.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-ui font-medium text-sm">{provider.name}</div>
                <div className={`text-xs ${provider.color}`}>{provider.status}</div>
              </div>
              <Button size="sm" variant="secondary">Configure</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-atlas-bg-tertiary rounded-lg">
        <h3 className="font-ui font-medium text-sm mb-2">Fallback Chain</h3>
        <p className="text-xs text-atlas-text-secondary">
          When the primary provider fails, Atlas automatically tries the next one.
          Default order: Puter.js → Gemini → Groq → Cerebras → OpenRouter
        </p>
      </div>
    </div>
  );
}

export function DiscoverySettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">Discovery</h2>
      <p className="text-sm text-atlas-text-secondary">
        Configure web discovery sources. DuckDuckGo works with no API key.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-atlas-bg-tertiary rounded-lg">
          <div>
            <div className="font-ui font-medium text-sm">DuckDuckGo</div>
            <div className="text-xs text-atlas-accent-emerald">Always free, no key needed</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-atlas-bg-elevated rounded-full peer peer-checked:bg-atlas-accent-emerald after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        {["Serper", "Tavily", "Brave Search", "Exa"].map((name) => (
          <div key={name} className="flex items-center justify-between p-4 bg-atlas-bg-tertiary rounded-lg">
            <div>
              <div className="font-ui font-medium text-sm">{name}</div>
              <div className="text-xs text-atlas-text-muted">Not configured</div>
            </div>
            <Button size="sm" variant="secondary">Add Key</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReadingSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">Reading Preferences</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-ui text-atlas-text-secondary mb-2">Font Size</label>
          <input type="range" min={12} max={24} defaultValue={18} className="w-full accent-atlas-accent-emerald" />
          <div className="flex justify-between text-xs text-atlas-text-muted mt-1">
            <span>12px</span><span>18px</span><span>24px</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-ui text-atlas-text-secondary mb-2">Font Family</label>
          <div className="grid grid-cols-2 gap-2">
            {["Newsreader", "Playfair Display", "Georgia", "System"].map((font) => (
              <button
                key={font}
                className="p-3 rounded-lg border border-atlas-border text-sm hover:border-atlas-accent-emerald transition-colors"
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-ui text-atlas-text-secondary mb-2">Line Height</label>
          <input type="range" min={1.4} max={2.0} step={0.1} defaultValue={1.7} className="w-full accent-atlas-accent-emerald" />
        </div>
      </div>
    </div>
  );
}

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">Appearance</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Dark", value: "dark", bg: "bg-[hsl(220,22%,4%)]" },
          { label: "Light", value: "light", bg: "bg-[hsl(40,20%,97%)]" },
          { label: "System", value: "system", bg: "bg-gradient-to-r from-[hsl(220,22%,4%)] to-[hsl(40,20%,97%)]" },
        ].map((theme) => (
          <button
            key={theme.value}
            className={`p-4 rounded-lg border border-atlas-border hover:border-atlas-accent-emerald transition-colors text-center`}
          >
            <div className={`w-full h-16 rounded-md mb-2 ${theme.bg}`} />
            <span className="text-sm font-ui">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AboutSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">About Atlas</h2>
      <div className="space-y-4">
        <div className="p-4 bg-atlas-bg-tertiary rounded-lg">
          <div className="font-display text-lg font-bold text-atlas-accent-emerald mb-1">Atlas</div>
          <div className="text-sm text-atlas-text-secondary">Version 0.1.0</div>
          <div className="text-sm text-atlas-text-secondary mt-1">Your personal intelligence feed</div>
        </div>

        <div className="space-y-2">
          <a href="https://github.com/chirag127/atlas.oriz.in" target="_blank" rel="noopener noreferrer" className="block p-3 bg-atlas-bg-tertiary rounded-lg hover:bg-atlas-bg-elevated transition-colors">
            <div className="font-ui text-sm">GitHub Repository</div>
          </a>
          <div className="p-3 bg-atlas-bg-tertiary rounded-lg">
            <div className="font-ui text-sm text-atlas-text-secondary">License: MIT</div>
          </div>
          <div className="p-3 bg-atlas-bg-tertiary rounded-lg">
            <div className="font-ui text-sm text-atlas-text-secondary">Built with Next.js, Supabase, and ❤️</div>
          </div>
        </div>
      </div>
    </div>
  );
}
