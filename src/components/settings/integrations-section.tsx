"use client";

import { useState } from "react";
import { Link2, ExternalLink, Loader2 } from "lucide-react";

const INTEGRATIONS = [
  { id: "obsidian", label: "Obsidian", description: "Export notes to your Obsidian vault" },
  { id: "notion", label: "Notion", description: "Save articles to Notion (coming soon)" },
  { id: "readwise", label: "Readwise", description: "Sync highlights to Readwise (coming soon)" },
  { id: "pocket", label: "Pocket", description: "Import your Pocket bookmarks" },
];

export function IntegrationsSection() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = async (id: string) => {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1000));
    setConnecting(null);
  };

  return (
    <div className="space-y-2">
      {INTEGRATIONS.map((int) => (
        <div key={int.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{int.label}</p>
              <p className="text-xs text-zinc-500">{int.description}</p>
            </div>
          </div>
          <button
            onClick={() => connect(int.id)}
            disabled={connecting === int.id || int.id === "pocket"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 transition-colors"
          >
            {connecting === int.id ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <ExternalLink className="w-3 h-3" />
            )}
            {int.id === "pocket" ? "Import" : "Connect"}
          </button>
        </div>
      ))}
    </div>
  );
}
