"use client";

const CATEGORIES = [
  { id: "tech", label: "Technology" },
  { id: "science", label: "Science" },
  { id: "design", label: "Design" },
  { id: "business", label: "Business" },
  { id: "culture", label: "Culture" },
  { id: "politics", label: "Politics" },
  { id: "health", label: "Health" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "programming", label: "Programming" },
  { id: "startups", label: "Startups" },
  { id: "philosophy", label: "Philosophy" },
  { id: "history", label: "History" },
];

interface InterestPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function InterestPicker({ selected, onChange }: InterestPickerProps) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-2 mb-8">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Choose topics you enjoy</p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected.includes(cat.id)
                ? "bg-blue-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-600 mt-2">{selected.length} selected</p>
    </div>
  );
}
