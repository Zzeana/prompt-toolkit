import { useState } from 'react';
import type { ViewState } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import StageView from './components/StageView';
import RecommendationsView from './components/RecommendationsView';
import ComparisonView from './components/ComparisonView';
import ToolDetailView from './components/ToolDetailView';
import WorkflowsView from './components/WorkflowsView';

const MAX_COMPARISON = 4;

export default function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [comparisonQueue, setComparisonQueue] = useState<string[]>([]);

  function navigate(next: ViewState) {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleComparison(toolId: string) {
    setComparisonQueue((prev) => {
      if (prev.includes(toolId)) return prev.filter((id) => id !== toolId);
      if (prev.length >= MAX_COMPARISON) return prev; // cap at 4
      return [...prev, toolId];
    });
  }

  const commonProps = {
    onNavigate: navigate,
    comparisonQueue,
    onToggleComparison: toggleComparison,
  };

  return (
    <div className="min-h-screen bg-surface-0 text-slate-100">
      <Header view={view} onNavigate={navigate} comparisonQueue={comparisonQueue} />

      {/* Comparison bar */}
      {comparisonQueue.length > 0 && view.type !== 'comparison' && (
        <div className="sticky top-14 z-40 border-b border-violet-500/20 bg-violet-900/30 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
            <p className="text-sm text-violet-300">
              {comparisonQueue.length} tool{comparisonQueue.length !== 1 ? 's' : ''} selected for comparison
              {comparisonQueue.length < 2 && (
                <span className="ml-1.5 text-violet-400/60">
                  (add {2 - comparisonQueue.length} more to compare)
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setComparisonQueue([])}
                className="text-xs text-violet-400/60 hover:text-violet-300 transition-colors"
              >
                Clear
              </button>
              {comparisonQueue.length >= 2 && (
                <button
                  onClick={() => navigate({ type: 'comparison', toolIds: comparisonQueue })}
                  className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                >
                  Compare now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {view.type === 'home' && <HomePage onNavigate={navigate} />}

      {view.type === 'stage' && (
        <StageView
          stageId={view.stageId}
          subCategory={view.subCategory}
          {...commonProps}
        />
      )}

      {view.type === 'recommendations' && (
        <RecommendationsView
          query={view.query}
          results={view.results}
          {...commonProps}
        />
      )}

      {view.type === 'comparison' && (
        <ComparisonView
          toolIds={view.toolIds}
          onNavigate={navigate}
          onToggleComparison={toggleComparison}
        />
      )}

      {view.type === 'tool' && (
        <ToolDetailView
          toolId={view.toolId}
          {...commonProps}
        />
      )}

      {view.type === 'workflows' && <WorkflowsView onNavigate={navigate} />}
    </div>
  );
}
