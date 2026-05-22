"use client";

import { Highlighter } from "lucide-react";

const COLORS = [
  { id: "yellow", label: "Yellow", class: "bg-yellow-400" },
  { id: "green", label: "Green", class: "bg-emerald-400" },
  { id: "blue", label: "Blue", class: "bg-blue-400" },
  { id: "pink", label: "Pink", class: "bg-pink-400" },
  { id: "orange", label: "Orange", class: "bg-orange-400" },
];

interface HighlightToolbarProps {
  onHighlight: (color: string) => void;
  onRemove: () => void;
  isHighlighted: boolean;
}

export function HighlightToolbar({ onHighlight, onRemove, isHighlighted }: HighlightToolbarProps) {
  return (
    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg">
      <Highlighter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
      {COLORS.map((c) => (
        <button
          key={c.id}
          onClick={() => onHighlight(c.id)}
          className={`w-5 h-5 rounded-full ${c.class} opacity-70 hover:opacity-100 transition-opacity`}
          title={c.label}
        />
      ))}
      {isHighlighted && (
        <button
          onClick={onRemove}
          className="ml-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  );
}
