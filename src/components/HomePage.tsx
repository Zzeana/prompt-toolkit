import { useState, useRef } from 'react';
import type { ViewState, WorkflowStageId } from '../types';
import { WORKFLOW_STAGES } from '../data/workflowStages';
import { getRecommendations } from '../lib/api';
import type { RecommendationResult } from '../types';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const EXAMPLE_TASKS = [
  'Synthesize 30 user interview transcripts into themes',
  'Generate UI wireframes for a mobile onboarding flow',
  'Run a quick A/B preference test between two homepage designs',
  'Facilitate a remote ideation workshop with my distributed team',
];

export default function HomePage({ onNavigate }: Props) {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const { results } = await getRecommendations(task.trim());
      onNavigate({ type: 'recommendations', query: task.trim(), results });
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Find your AI tool in under 1 minute
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          The right AI tool for{' '}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            your design task
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-slate-400">
          Describe what you're working on and get 3–5 ranked recommendations. Or browse
          by workflow stage to explore what's available.
        </p>
      </div>

      {/* Task Input */}
      <div className="mx-auto mb-14 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-card shadow-xl shadow-black/30 focus-within:border-violet-500/50 focus-within:shadow-violet-500/5 transition-all">
            <textarea
              ref={textareaRef}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What design task are you working on?"
              rows={3}
              maxLength={800}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-base text-slate-100 placeholder-slate-500 outline-none"
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-xs text-slate-500">{task.length}/800</span>
              <button
                type="submit"
                disabled={!task.trim() || loading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Finding tools…
                  </>
                ) : (
                  <>
                    Get recommendations
                    <kbd className="hidden rounded border border-white/20 px-1 text-[10px] sm:inline">
                      ⌘↵
                    </kbd>
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-400">{error}</p>
          )}
        </form>

        {/* Example prompts */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TASKS.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setTask(example);
                  textareaRef.current?.focus();
                }}
                className="rounded-lg border border-white/8 bg-surface-elevated px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Stages Grid */}
      <div className="mb-4">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-slate-500">
          Or browse by workflow stage
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {WORKFLOW_STAGES.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            onClick={() =>
              onNavigate({ type: 'stage', stageId: stage.id as WorkflowStageId })
            }
          />
        ))}
      </div>
    </main>
  );
}

function StageCard({
  stage,
  onClick,
}: {
  stage: (typeof WORKFLOW_STAGES)[number];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.99] ${stage.bgColor} ${stage.borderColor} hover:shadow-lg`}
    >
      <span className="mb-3 text-3xl">{stage.icon}</span>
      <h3 className={`mb-1.5 text-base font-semibold ${stage.textColor}`}>
        {stage.name}
      </h3>
      <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">
        {stage.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {stage.subCategories.slice(0, 2).map((sub) => (
          <span
            key={sub}
            className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400"
          >
            {sub}
          </span>
        ))}
        {stage.subCategories.length > 2 && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-500">
            +{stage.subCategories.length - 2}
          </span>
        )}
      </div>
    </button>
  );
}
