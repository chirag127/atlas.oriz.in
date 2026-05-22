"use client";

import { useState } from "react";
import { Bookmark, FileText, FolderOpen, Tag, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

type LibraryTab = "bookmarks" | "notes" | "collections" | "tags";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("bookmarks");

  const tabs = [
    { id: "bookmarks" as const, label: "Bookmarks", icon: Bookmark, count: 0 },
    { id: "notes" as const, label: "Notes", icon: FileText, count: 0 },
    { id: "collections" as const, label: "Collections", icon: FolderOpen, count: 0 },
    { id: "tags" as const, label: "Tags", icon: Tag, count: 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Library</h1>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-ui whitespace-nowrap transition-colors ${
              activeTab === id
                ? "bg-atlas-accent-emerald/10 text-atlas-accent-emerald border border-atlas-accent-emerald/30"
                : "text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary"
            }`}
          >
            <Icon size={16} />
            {label}
            {count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-atlas-bg-tertiary rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "bookmarks" && <BookmarksList />}
      {activeTab === "notes" && <NotesList />}
      {activeTab === "collections" && <CollectionsList />}
      {activeTab === "tags" && <TagsList />}
    </div>
  );
}

function BookmarksList() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-atlas-text-secondary font-ui">
        Your saved articles for later reading. Bookmarked articles are also queued for spaced repetition review.
      </p>
      <EmptyState
        icon={Bookmark}
        title="No bookmarks yet"
        description="Tap the bookmark icon on any article to save it here."
      />
    </div>
  );
}

function NotesList() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-atlas-text-secondary font-ui">
        Your notes and annotations. Create standalone notes or attach them to articles.
      </p>
      <EmptyState
        icon={FileText}
        title="No notes yet"
        description="Highlight text in articles and add notes, or create standalone notes."
      />
    </div>
  );
}

function CollectionsList() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-atlas-text-secondary font-ui">
        Organize articles into collections. Create smart folders with AI-powered queries.
      </p>
      <EmptyState
        icon={FolderOpen}
        title="No collections yet"
        description="Create a collection to organize your saved articles."
      />
    </div>
  );
}

function TagsList() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-atlas-text-secondary font-ui">
        Tags from your articles. AI-generated tags are marked with a sparkle.
      </p>
      <EmptyState
        icon={Tag}
        title="No tags yet"
        description="Tags will appear here as you read and interact with articles."
      />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-atlas-bg-tertiary flex items-center justify-center mb-4">
        <Icon size={28} />
      </div>
      <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
    </div>
  );
}
