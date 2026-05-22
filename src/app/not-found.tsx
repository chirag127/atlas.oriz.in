export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-atlas-bg-primary">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-atlas-accent-emerald mb-4">404</h1>
        <p className="text-atlas-text-secondary mb-6">Page not found</p>
        <a
          href="/feed"
          className="px-4 py-2 bg-atlas-accent-emerald text-white rounded-lg hover:bg-atlas-accent-emerald-dim transition-colors"
        >
          Go to Feed
        </a>
      </div>
    </div>
  );
}
