import type { AITool } from '../types';
import { STAGE_MAP } from '../data/workflowStages';

interface Props {
  tool: AITool;
  inComparison: boolean;
  onViewDetail: () => void;
  onToggleComparison: () => void;
  rank?: number;
  matchExplanation?: string;
  isBestForMostPeople?: boolean;
}

const EFFORT_COLOR: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-red-400',
};

const PRICING_COLOR: Record<string, string> = {
  free: 'text-emerald-400',
  freemium: 'text-blue-400',
  paid: 'text-amber-400',
  enterprise: 'text-slate-400',
};

export default function ToolCard({
  tool,
  inComparison,
  onViewDetail,
  onToggleComparison,
  rank,
  matchExplanation,
  isBestForMostPeople,
}: Props) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-surface-card p-5 transition-all hover:border-white/20 ${
        inComparison ? 'border-violet-500/50' : 'border-white/8'
      }`}
    >
      {/* Rank badge */}
      {rank !== undefined && (
        <div className="absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-lg">
          {rank}
        </div>
      )}

      {/* Best badge */}
      {isBestForMostPeople && (
        <div className="absolute -top-2.5 right-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          Best for most people
        </div>
      )}

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.logoColor} text-xs font-bold text-white shadow-md`}
          >
            {tool.logoLetter}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{tool.name}</h3>
            <div className="mt-0.5 flex flex-wrap gap-1">
              {tool.workflowStages.slice(0, 2).map((s) => {
                const stage = STAGE_MAP[s];
                return (
                  <span
                    key={s}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${stage?.bgColor ?? ''} ${stage?.textColor ?? ''}`}
                  >
                    {stage?.name ?? s}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Match explanation or description */}
      <p className="mb-3 text-sm leading-relaxed text-slate-400 line-clamp-3">
        {matchExplanation ?? tool.description}
      </p>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <span>
          <span className="text-slate-500">Effort </span>
          <span className={EFFORT_COLOR[tool.effort] ?? 'text-slate-300'}>
            {tool.effort}
          </span>
        </span>
        <span>
          <span className="text-slate-500">Price </span>
          <span className={PRICING_COLOR[tool.pricingTier] ?? 'text-slate-300'}>
            {tool.pricingTier === 'free'
              ? 'Free'
              : tool.pricingTier === 'freemium'
              ? 'Free tier'
              : tool.pricingTier === 'enterprise'
              ? 'Enterprise'
              : 'Paid'}
          </span>
        </span>
        <span>
          <span className="text-slate-500">Curve </span>
          <span className="text-slate-300">{tool.learningCurve}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <button
          onClick={onViewDetail}
          className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          View details
        </button>
        <button
          onClick={onToggleComparison}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            inComparison
              ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {inComparison ? '✓ Added' : '+ Compare'}
        </button>
      </div>
    </div>
  );
}
