import type { ViewState } from '../types';
import { TOOL_MAP } from '../data/tools';
import { STAGE_MAP } from '../data/workflowStages';

interface Props {
  toolIds: string[];
  onNavigate: (view: ViewState) => void;
  onToggleComparison: (toolId: string) => void;
}

const DIMENSIONS = [
  { key: 'strengths', label: 'Strengths' },
  { key: 'weaknesses', label: 'Weaknesses' },
  { key: 'useCases', label: 'Best use cases' },
  { key: 'antiUseCases', label: 'When NOT to use' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'learningCurve', label: 'Learning curve' },
];

export default function ComparisonView({ toolIds, onNavigate, onToggleComparison }: Props) {
  const tools = toolIds.map((id) => TOOL_MAP[id]).filter(Boolean);

  if (tools.length < 2) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
        <p className="text-slate-400 mb-4">Select at least 2 tools to compare.</p>
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Browse tools
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => onNavigate({ type: 'home' })}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-2xl font-bold text-white">Side-by-side comparison</h1>
      <p className="mb-8 text-sm text-slate-400">
        Comparing {tools.length} tools · Click "Remove" to swap a tool
      </p>

      {/* Mobile: stacked accordion */}
      <div className="block sm:hidden space-y-4">
        {tools.map((tool) => (
          <MobileToolCard
            key={tool.id}
            tool={tool}
            onRemove={() => onToggleComparison(tool.id)}
            onViewDetail={() => onNavigate({ type: 'tool', toolId: tool.id })}
          />
        ))}
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-36" />
            {tools.map((t) => (
              <col key={t.id} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="pb-4" />
              {tools.map((tool) => (
                <th key={tool.id} className="pb-4 px-3 text-left align-top">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.logoColor} text-xs font-bold text-white`}
                    >
                      {tool.logoLetter}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tool.name}</p>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {tool.workflowStages.slice(0, 1).map((s) => {
                          const stage = STAGE_MAP[s];
                          return (
                            <span
                              key={s}
                              className={`rounded px-1.5 py-0.5 text-[10px] ${stage?.bgColor ?? ''} ${stage?.textColor ?? ''}`}
                            >
                              {stage?.name ?? s}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        <button
                          onClick={() => onNavigate({ type: 'tool', toolId: tool.id })}
                          className="text-xs text-slate-500 hover:text-violet-400 transition-colors"
                        >
                          Details ↗
                        </button>
                        <span className="text-slate-600">·</span>
                        <button
                          onClick={() => onToggleComparison(tool.id)}
                          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((dim) => (
              <tr key={dim.key} className="border-t border-white/5">
                <td className="py-4 pr-4 align-top">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {dim.label}
                  </span>
                </td>
                {tools.map((tool) => (
                  <td key={tool.id} className="py-4 px-3 align-top">
                    <CellContent tool={tool} dimKey={dim.key} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function CellContent({
  tool,
  dimKey,
}: {
  tool: NonNullable<ReturnType<typeof TOOL_MAP[string]>>;
  dimKey: string;
}) {
  if (dimKey === 'pricing') {
    return <p className="text-sm text-slate-300">{tool.pricing}</p>;
  }
  if (dimKey === 'learningCurve') {
    const colors: Record<string, string> = {
      Beginner: 'text-emerald-400',
      Intermediate: 'text-amber-400',
      Advanced: 'text-red-400',
    };
    return (
      <p className={`text-sm font-medium ${colors[tool.learningCurve] ?? 'text-slate-300'}`}>
        {tool.learningCurve}
      </p>
    );
  }
  const values = tool[dimKey as keyof typeof tool] as string[];
  if (!Array.isArray(values)) return null;

  const dotColor: Record<string, string> = {
    strengths: 'text-emerald-400',
    weaknesses: 'text-amber-400',
    useCases: 'text-blue-400',
    antiUseCases: 'text-rose-400',
  };

  return (
    <ul className="space-y-1.5">
      {values.slice(0, dimKey === 'useCases' ? 2 : 3).map((v: string, i: number) => (
        <li key={i} className="flex gap-1.5 text-sm text-slate-300">
          <span className={`mt-0.5 shrink-0 ${dotColor[dimKey] ?? 'text-slate-500'}`}>•</span>
          {v}
        </li>
      ))}
    </ul>
  );
}

function MobileToolCard({
  tool,
  onRemove,
  onViewDetail,
}: {
  tool: NonNullable<ReturnType<typeof TOOL_MAP[string]>>;
  onRemove: () => void;
  onViewDetail: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tool.logoColor} text-xs font-bold text-white`}
        >
          {tool.logoLetter}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{tool.name}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewDetail}
            className="text-xs text-slate-500 hover:text-violet-400 transition-colors"
          >
            Details
          </button>
          <button
            onClick={onRemove}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {DIMENSIONS.map((dim) => (
        <div key={dim.key} className="mb-3 border-t border-white/5 pt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {dim.label}
          </p>
          <CellContent tool={tool} dimKey={dim.key} />
        </div>
      ))}
    </div>
  );
}
