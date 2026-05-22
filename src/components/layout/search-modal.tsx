"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-atlas-bg-secondary border border-atlas-border rounded-xl shadow-modal overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3">
          <Search size={18} className="text-atlas-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, notes, tags..."
            className="flex-1 bg-transparent text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none font-ui"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-atlas-text-muted hover:text-atlas-text-primary"
          >
            <X size={16} />
          </button>
        </form>
        {query && (
          <div className="border-t border-atlas-border px-4 py-2">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                onClose();
              }}
              className="flex items-center gap-2 text-sm text-atlas-text-secondary hover:text-atlas-accent-emerald font-ui w-full"
            >
              <ArrowRight size={14} />
              Search for &quot;{query}&quot;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
