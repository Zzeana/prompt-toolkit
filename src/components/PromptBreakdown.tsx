import type { PromptComponents } from '../types';

interface Props {
  components: PromptComponents;
}

const COMPONENT_META = [
  {
    key: 'task' as const,
    label: 'Task',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    description: 'What the AI should create or do',
  },
  {
    key: 'context' as const,
    label: 'Context',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    description: 'Background information and use case',
  },
  {
    key: 'constraints' as const,
    label: 'Constraints',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    description: 'Technical requirements and limitations',
  },
  {
    key: 'style' as const,
    label: 'Style',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20',
    description: 'Aesthetic direction and mood',
  },
] as const;

export default function PromptBreakdown({ components }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <h3 className="text-sm font-semibold text-slate-300">Prompt Breakdown</h3>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Learn how your prompt is structured across four key dimensions.
      </p>

      <div className="space-y-2">
        {COMPONENT_META.map(({ key, label, icon, color, bg, description }) => {
          const value = components[key];
          const isEmpty = !value || value.trim() === '' || value === 'Not specified';

          return (
            <div
              key={key}
              className={`rounded-lg border p-3 transition-opacity ${isEmpty ? 'opacity-40' : 'opacity-100'} ${bg}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={color}>{icon}</span>
                <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>
                  {label}
                </span>
                <span className="text-slate-600 text-xs ml-auto">— {description}</span>
              </div>
              {isEmpty ? (
                <p className="text-xs text-slate-600 italic">Not identified in your prompt</p>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">{value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {COMPONENT_META.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />
            <span className="text-[11px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
