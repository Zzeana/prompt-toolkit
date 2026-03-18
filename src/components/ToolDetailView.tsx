import type { ViewState } from '../types';
import { TOOL_MAP } from '../data/tools';
import { STAGE_MAP } from '../data/workflowStages';

interface Props {
  toolId: string;
  onNavigate: (view: ViewState) => void;
  comparisonQueue: string[];
  onToggleComparison: (toolId: string) => void;
}

const EFFORT_COLOR: Record<string, string> = {
  Low: 'text-emerald-400 bg-emerald-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  High: 'text-red-400 bg-red-500/10',
};

const CURVE_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10',
  Intermediate: 'text-amber-400 bg-amber-500/10',
  Advanced: 'text-red-400 bg-red-500/10',
};

export default function ToolDetailView({
  toolId,
  onNavigate,
  comparisonQueue,
  onToggleComparison,
}: Props) {
  const tool = TOOL_MAP[toolId];

  if (!tool) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 text-center text-slate-400">
        Tool not found.{' '}
        <button onClick={() => onNavigate({ type: 'home' })} className="text-violet-400 underline">
          Go home
        </button>
      </main>
    );
  }

  const inComparison = comparisonQueue.includes(tool.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back */}
      <button
        onClick={() => onNavigate({ type: 'home' })}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        ← Back
      </button>

      {/* Hero */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tool.logoColor} text-lg font-bold text-white shadow-lg`}
          >
            {tool.logoLetter}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tool.workflowStages.map((s) => {
                const stage = STAGE_MAP[s];
                return (
                  <button
                    key={s}
                    onClick={() => onNavigate({ type: 'stage', stageId: s })}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${stage?.bgColor ?? ''} ${stage?.textColor ?? ''} border ${stage?.borderColor ?? ''} hover:opacity-80 transition-opacity`}
                  >
                    {stage?.icon} {stage?.name ?? s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleComparison(tool.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              inComparison
                ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {inComparison ? '✓ In comparison' : '+ Add to compare'}
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Visit tool ↗
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="mb-8 text-base leading-relaxed text-slate-300">{tool.description}</p>

      {/* Meta pills */}
      <div className="mb-8 flex flex-wrap gap-3">
        <MetaPill label="Pricing" value={tool.pricing} />
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${EFFORT_COLOR[tool.effort] ?? ''}`}>
          Effort: {tool.effort}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${CURVE_COLOR[tool.learningCurve] ?? ''}`}>
          {tool.learningCurve}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-500">
          Last verified {tool.lastVerified}
        </span>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Strengths */}
        <Section title="Strengths" icon="✅" color="emerald">
          <ul className="space-y-2">
            {tool.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-0.5 shrink-0 text-emerald-400">•</span>
                {s}
              </li>
            ))}
          </ul>
        </Section>

        {/* Weaknesses */}
        <Section title="Weaknesses" icon="⚠️" color="amber">
          <ul className="space-y-2">
            {tool.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-0.5 shrink-0 text-amber-400">•</span>
                {w}
              </li>
            ))}
          </ul>
        </Section>

        {/* Best use cases */}
        <Section title="Best use cases" icon="🎯" color="blue">
          <ul className="space-y-2">
            {tool.useCases.map((u, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-0.5 shrink-0 text-blue-400">→</span>
                {u}
              </li>
            ))}
          </ul>
        </Section>

        {/* When NOT to use */}
        <Section title="When NOT to use" icon="🚫" color="rose">
          <ul className="space-y-2">
            {tool.antiUseCases.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-0.5 shrink-0 text-rose-400">✕</span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </main>
  );
}

const SECTION_STYLES: Record<string, string> = {
  emerald: 'border-emerald-500/20 bg-emerald-500/5',
  amber: 'border-amber-500/20 bg-amber-500/5',
  blue: 'border-blue-500/20 bg-blue-500/5',
  rose: 'border-rose-500/20 bg-rose-500/5',
};

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-5 ${SECTION_STYLES[color] ?? 'border-white/10 bg-white/5'}`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300">
      <span className="text-slate-500">{label}:</span>
      {value}
    </span>
  );
}
