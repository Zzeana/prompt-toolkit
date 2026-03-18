import type { ViewState } from '../types';
import { WORKFLOW_TEMPLATES } from '../data/workflowTemplates';
import { TOOL_MAP } from '../data/tools';
import { STAGE_MAP } from '../data/workflowStages';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const DIFF_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10',
  Intermediate: 'text-amber-400 bg-amber-500/10',
  Advanced: 'text-red-400 bg-red-500/10',
};

export default function WorkflowsView({ onNavigate }: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Multi-Tool Workflows</h1>
        <p className="mt-1 text-sm text-slate-400">
          Pre-built tool chains for common design tasks — with handoffs between each step.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {WORKFLOW_TEMPLATES.map((template) => (
          <WorkflowCard key={template.id} template={template} onNavigate={onNavigate} />
        ))}
      </div>
    </main>
  );
}

function WorkflowCard({
  template,
  onNavigate,
}: {
  template: (typeof WORKFLOW_TEMPLATES)[number];
  onNavigate: (view: ViewState) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/8 bg-surface-card p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{template.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{template.description}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
          ⏱ {template.totalTime}
        </span>
        <span
          className={`rounded-lg px-2.5 py-1 text-xs ${DIFF_COLOR[template.difficulty] ?? ''}`}
        >
          {template.difficulty}
        </span>
        {template.stages.map((s) => {
          const stage = STAGE_MAP[s];
          return (
            <span
              key={s}
              className={`rounded-lg px-2.5 py-1 text-xs ${stage?.bgColor ?? ''} ${stage?.textColor ?? ''}`}
            >
              {stage?.icon} {stage?.name}
            </span>
          );
        })}
      </div>

      {/* Steps */}
      <div className="flex-1 space-y-0">
        {template.steps.map((step, idx) => {
          const tool = TOOL_MAP[step.toolId];
          const isLast = idx === template.steps.length - 1;
          return (
            <div key={step.stepNumber}>
              <div className="flex gap-3">
                {/* Step connector */}
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30 text-xs font-semibold text-violet-400">
                    {step.stepNumber}
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-white/8 mb-1" />}
                </div>

                <div className={`pb-4 ${isLast ? '' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white">{step.title}</p>
                    {tool && (
                      <button
                        onClick={() => onNavigate({ type: 'tool', toolId: tool.id })}
                        className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${tool.logoColor} text-white opacity-80 hover:opacity-100 transition-opacity`}
                      >
                        {tool.logoLetter} {tool.name}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{step.description}</p>
                  {step.handoff && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-white/3 px-3 py-2">
                      <span className="mt-0.5 shrink-0 text-xs text-slate-500">→</span>
                      <p className="text-xs text-slate-500">{step.handoff}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
