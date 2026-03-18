import type { ViewState } from '../types';

interface Props {
  view: ViewState;
  onNavigate: (view: ViewState) => void;
  comparisonQueue: string[];
}

export default function Header({ view, onNavigate, comparisonQueue }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
            F
          </div>
          <span className="text-base font-semibold text-white tracking-tight">
            Flow<span className="text-violet-400">Select</span>
          </span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <NavButton
            label="Browse Stages"
            active={view.type === 'stage'}
            onClick={() => onNavigate({ type: 'stage', stageId: 'research' })}
          />
          <NavButton
            label="Workflows"
            active={view.type === 'workflows'}
            onClick={() => onNavigate({ type: 'workflows' })}
          />
          {comparisonQueue.length >= 2 && (
            <button
              onClick={() => onNavigate({ type: 'comparison', toolIds: comparisonQueue })}
              className="relative ml-1 flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-violet-300 hover:bg-violet-500/30 transition-colors"
            >
              Compare
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {comparisonQueue.length}
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}
