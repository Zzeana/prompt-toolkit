import type { RecommendationResult, ViewState } from '../types';
import { TOOL_MAP } from '../data/tools';
import ToolCard from './ToolCard';

interface Props {
  query: string;
  results: RecommendationResult[];
  onNavigate: (view: ViewState) => void;
  comparisonQueue: string[];
  onToggleComparison: (toolId: string) => void;
}

export default function RecommendationsView({
  query,
  results,
  onNavigate,
  comparisonQueue,
  onToggleComparison,
}: Props) {
  const validResults = results.filter((r) => TOOL_MAP[r.toolId]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Back + query */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back to search
        </button>
        <div className="rounded-xl border border-white/8 bg-surface-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Recommendations for
          </p>
          <p className="text-sm text-slate-200">"{query}"</p>
        </div>
      </div>

      {validResults.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400">No recommendations found. Try rephrasing your task.</p>
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {validResults.length} tool{validResults.length !== 1 ? 's' : ''} recommended
            </h2>
            {comparisonQueue.length >= 2 && (
              <button
                onClick={() => onNavigate({ type: 'comparison', toolIds: comparisonQueue })}
                className="rounded-lg bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-violet-300 hover:bg-violet-500/30 transition-colors"
              >
                Compare {comparisonQueue.length} selected →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {validResults
              .sort((a, b) => a.rank - b.rank)
              .map((result) => {
                const tool = TOOL_MAP[result.toolId];
                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    inComparison={comparisonQueue.includes(tool.id)}
                    onViewDetail={() => onNavigate({ type: 'tool', toolId: tool.id })}
                    onToggleComparison={() => onToggleComparison(tool.id)}
                    rank={result.rank}
                    matchExplanation={result.matchExplanation}
                    isBestForMostPeople={result.isBestForMostPeople}
                  />
                );
              })}
          </div>

          {/* Quick pick */}
          {validResults.length > 0 && (
            <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-2xl">⚡</div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400 mb-1">Quick pick</p>
                  <p className="text-sm text-slate-300">
                    Start with{' '}
                    <button
                      onClick={() =>
                        onNavigate({
                          type: 'tool',
                          toolId: validResults.sort((a, b) => a.rank - b.rank)[0].toolId,
                        })
                      }
                      className="font-semibold text-white underline decoration-white/30 hover:decoration-white/60 transition-all"
                    >
                      {TOOL_MAP[validResults.sort((a, b) => a.rank - b.rank)[0].toolId]?.name}
                    </button>
                    {' '}—{' '}
                    {validResults.sort((a, b) => a.rank - b.rank)[0].matchExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
