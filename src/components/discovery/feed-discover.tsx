"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, Check, AlertCircle } from "lucide-react";

export function FeedDiscover() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported?: number; total?: number; error?: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/feeds/import", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Import failed" });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center cursor-pointer hover:border-zinc-600 transition-colors"
      >
        {importing ? (
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-2" />
        ) : (
          <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
        )}
        <p className="text-sm text-zinc-400">
          {importing ? "Importing..." : "Upload an OPML file to import feeds"}
        </p>
        <p className="text-xs text-zinc-600 mt-1">Export your feeds from any RSS reader</p>
        <input ref={fileRef} type="file" accept=".opml,.xml" onChange={handleImport} className="hidden" />
      </div>

      {result && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${result.error ? "bg-red-900/20 text-red-400" : "bg-emerald-900/20 text-emerald-400"}`}>
          {result.error ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {result.error ?? `Imported ${result.imported} of ${result.total} feeds`}
        </div>
      )}
    </div>
  );
}
