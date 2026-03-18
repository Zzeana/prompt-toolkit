import type { AITool } from '../types';
import { AI_TOOLS } from '../types';

interface Props {
  selected: AITool | null;
  onSelect: (tool: AITool) => void;
  isAdapting: boolean;
}

export default function ToolSelector({ selected, onSelect, isAdapting }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
        </svg>
        <h3 className="text-sm font-semibold text-slate-300">Select AI Tool</h3>
        <span className="text-xs text-slate-500 ml-1">— auto-adapts syntax</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {(Object.entries(AI_TOOLS) as [AITool, typeof AI_TOOLS[AITool]][]).map(([key, meta]) => {
          const isSelected = selected === key;

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              disabled={isAdapting}
              className={`relative group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border
                          transition-all duration-200 focus:outline-none
                          ${isSelected
                            ? 'border-current bg-surface-elevated'
                            : 'border-surface-border bg-surface-elevated hover:border-slate-500'
                          }`}
              style={isSelected ? {
                borderColor: meta.color,
                boxShadow: `0 0 16px ${meta.color}25`,
              } : {}}
              title={meta.description}
            >
              {/* Tool color dot */}
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: meta.color + '25', border: `1.5px solid ${meta.color}50` }}
              >
                <span style={{ color: meta.color }}>{meta.label[0]}</span>
              </span>

              <span className={`text-[11px] font-medium leading-tight text-center transition-colors ${
                isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {meta.label}
              </span>

              {isSelected && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
              )}

              {isAdapting && isSelected && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-surface-card/70">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" style={{ color: meta.color }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
