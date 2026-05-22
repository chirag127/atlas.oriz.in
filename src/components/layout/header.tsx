"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

export function Header() {
  const pathname = usePathname();
  const { setSearchOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-40 glass border-b border-atlas-border-subtle">
      <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-atlas-accent-emerald">
            Atlas
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/feed", label: "Feed" },
            { href: "/explore", label: "Explore" },
            { href: "/library", label: "Library" },
            { href: "/knowledge-graph", label: "Graph" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-ui transition-colors ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-atlas-bg-tertiary text-atlas-text-primary"
                  : "text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            className="p-2 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <Link
            href="/settings"
            className="p-2 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
