"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">You&apos;re Offline</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your connection dropped. Don&apos;t worry — your saved articles
          and notes are still available.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors"
          >
            Try reconnecting
          </button>
          <p className="text-xs text-zinc-600">
            Cached articles will be shown when available.
          </p>
        </div>
      </div>
    </div>
  );
}
