export default function Header() {
  return (
    <header className="border-b border-surface-border bg-surface-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight">
            Prompt<span className="text-gradient">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="hidden sm:inline">Powered by</span>
          <span className="badge bg-surface-elevated text-slate-300 border border-surface-border">
            Claude Opus 4.6
          </span>
        </div>
      </div>
    </header>
  );
}
