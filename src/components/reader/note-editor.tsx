"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Loader2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface NoteEditorProps {
  articleId: string;
}

export function NoteEditor({ articleId }: NoteEditorProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/notes/${articleId}`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  const addNote = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${articleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setContent("");
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <MessageSquare className="w-3.5 h-3.5" />
        Notes ({notes.length})
      </div>

      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
          rows={2}
          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
        />
        <button
          onClick={addNote}
          disabled={saving || !content.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 rounded-lg text-sm text-white transition-colors self-end"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 rounded-lg bg-zinc-900 animate-pulse" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-xs text-zinc-600 text-center py-4">No notes yet</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="group p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
