"use client";

import { useState } from "react";
import { FolderOpen, Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Collection {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  color: string;
  isSmart: boolean;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Collections</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-atlas-bg-tertiary flex items-center justify-center mb-4">
            <FolderOpen size={28} />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">No collections yet</h3>
          <p className="text-sm text-atlas-text-secondary max-w-sm mb-4">
            Create collections to organize your saved articles. Smart collections use AI to auto-categorize.
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {collections.map((col) => (
            <Card key={col.id} hover className="p-4">
              <div className="flex items-start justify-between mb-2">
                <FolderOpen size={20} className="text-atlas-accent-emerald" />
                {col.isSmart && <Sparkles size={14} className="text-atlas-accent-amber" />}
              </div>
              <h3 className="font-ui font-medium text-sm mb-1">{col.name}</h3>
              <p className="text-xs text-atlas-text-muted">
                {col.articleCount} article{col.articleCount !== 1 ? "s" : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
