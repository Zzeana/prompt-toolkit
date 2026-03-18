import { useState } from 'react';
import type { WorkflowStageId, ViewState } from '../types';
import { WORKFLOW_STAGES, STAGE_MAP } from '../data/workflowStages';
import { getToolsByStage } from '../data/tools';
import ToolCard from './ToolCard';

interface Props {
  stageId: WorkflowStageId;
  subCategory?: string;
  onNavigate: (view: ViewState) => void;
  comparisonQueue: string[];
  onToggleComparison: (toolId: string) => void;
}

export default function StageView({
  stageId,
  subCategory,
  onNavigate,
  comparisonQueue,
  onToggleComparison,
}: Props) {
  const [activeStage, setActiveStage] = useState<WorkflowStageId>(stageId);
  const [activeSub, setActiveSub] = useState<string | undefined>(subCategory);

  const stage = STAGE_MAP[activeStage];
  const tools = getToolsByStage(activeStage).filter(
    (t) => !activeSub || t.subCategories.includes(activeSub)
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Stage tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {WORKFLOW_STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveStage(s.id as WorkflowStageId);
              setActiveSub(undefined);
              onNavigate({ type: 'stage', stageId: s.id as WorkflowStageId });
            }}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              activeStage === s.id
                ? `${s.bgColor} ${s.borderColor} ${s.textColor}`
                : 'border-white/8 bg-surface-card text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${stage.textColor}`}>
            {stage.icon} {stage.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{stage.description}</p>
        </div>
        <p className="text-sm text-slate-500">
          {tools.length} tool{tools.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sub-category filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={!activeSub}
          color={stage.textColor}
          onClick={() => setActiveSub(undefined)}
        />
        {stage.subCategories.map((sub) => (
          <FilterChip
            key={sub}
            label={sub}
            active={activeSub === sub}
            color={stage.textColor}
            onClick={() => setActiveSub(activeSub === sub ? undefined : sub)}
          />
        ))}
      </div>

      {/* Tool grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              inComparison={comparisonQueue.includes(tool.id)}
              onViewDetail={() => onNavigate({ type: 'tool', toolId: tool.id })}
              onToggleComparison={() => onToggleComparison(tool.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-500">
          No tools found for this filter.
        </div>
      )}
    </main>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? `bg-white/10 ${color}`
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}
