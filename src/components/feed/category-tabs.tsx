"use client";

interface CategoryTabsProps {
  categories: string[];
  active: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-ui whitespace-nowrap transition-colors ${
          active === null
            ? "bg-atlas-accent-emerald text-white"
            : "bg-atlas-bg-tertiary text-atlas-text-secondary hover:text-atlas-text-primary"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-sm font-ui whitespace-nowrap transition-colors ${
            active === cat
              ? "bg-atlas-accent-emerald text-white"
              : "bg-atlas-bg-tertiary text-atlas-text-secondary hover:text-atlas-text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
