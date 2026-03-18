import type { MissingElement } from '../types';

interface Props {
  elements: MissingElement[];
  onApplySuggestion: (suggestion: string) => void;
}

const TYPE_META: Record<string, { icon: string; color: string }> = {
  style: { icon: '🎨', color: 'text-violet-400' },
  format: { icon: '📐', color: 'text-blue-400' },
  constraints: { icon: '🔒', color: 'text-amber-400' },
  context: { icon: '📋', color: 'text-emerald-400' },
  mood: { icon: '✨', color: 'text-pink-400' },
  dimensions: { icon: '📏', color: 'text-cyan-400' },
  audience: { icon: '👥', color: 'text-orange-400' },
  platform: { icon: '💻', color: 'text-indigo-400' },
};

export default function MissingElements({ elements, onApplySuggestion }: Props) {
  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-emerald-400">No missing elements</p>
        <p className="text-xs text-slate-500 mt-1">Your prompt looks comprehensive!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 className="text-sm font-semibold text-slate-300">Missing Elements</h3>
        <span className="ml-1 badge bg-amber-400/10 text-amber-400 border border-amber-400/20">
          {elements.length}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Add these elements to improve your prompt quality and AI output consistency.
      </p>

      <div className="space-y-3">
        {elements.map((el, i) => {
          const meta = TYPE_META[el.type] ?? { icon: '💡', color: 'text-slate-400' };

          return (
            <div
              key={i}
              className="card p-3.5 hover:border-surface-elevated transition-colors animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5" role="img">{meta.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                      {el.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">{el.description}</p>

                  <div className="bg-surface-elevated rounded-md px-3 py-2 border border-surface-border">
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">"{el.suggestion}"</p>
                  </div>
                </div>

                <button
                  onClick={() => onApplySuggestion(el.suggestion)}
                  className="flex-shrink-0 btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Add this to your prompt"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
