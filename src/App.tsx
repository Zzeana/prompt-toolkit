import { useState, useCallback, useRef, useEffect } from 'react';
import type { AITool, PromptAnalysis, QualityScore, ToolAdaptation } from './types';
import { generatePrompt, adaptPrompt, scorePrompt } from './lib/api';
import Header from './components/Header';
import IntentInput from './components/IntentInput';
import QualityScoreCard from './components/QualityScoreCard';
import PromptBreakdown from './components/PromptBreakdown';
import MissingElements from './components/MissingElements';
import ToolSelector from './components/ToolSelector';
import PromptWorkspace from './components/PromptWorkspace';

type Tab = 'breakdown' | 'missing' | 'tools';

export default function App() {
  // ── Core state ────────────────────────────────────────────────────
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [liveScore, setLiveScore] = useState<QualityScore | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [adaptation, setAdaptation] = useState<ToolAdaptation | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('breakdown');

  // ── Loading states ────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);

  // ── Copy feedback ─────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const [copyTarget, setCopyTarget] = useState<'original' | 'adapted'>('original');

  // ── Error state ───────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null);

  // ── Debounce ref for live scoring ─────────────────────────────────
  const scoreDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Generate prompt ───────────────────────────────────────────────
  async function handleGenerate(intent: string) {
    setIsGenerating(true);
    setError(null);
    setAnalysis(null);
    setLiveScore(null);
    setAdaptation(null);
    setSelectedTool(null);

    try {
      const result = await generatePrompt(intent);
      setAnalysis(result);
      setEditedPrompt(result.structured_prompt);
      setLiveScore(result.quality_score);
      setActiveTab('breakdown');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prompt');
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Live score on edit (debounced 500ms) ──────────────────────────
  const handlePromptEdit = useCallback((val: string) => {
    setEditedPrompt(val);
    setAdaptation(null); // invalidate adaptation when prompt changes

    if (scoreDebounceRef.current) clearTimeout(scoreDebounceRef.current);
    if (!val.trim()) return;

    scoreDebounceRef.current = setTimeout(async () => {
      setIsScoring(true);
      try {
        const score = await scorePrompt(val);
        setLiveScore(score);
      } catch {
        // silently fail on scoring errors
      } finally {
        setIsScoring(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (scoreDebounceRef.current) clearTimeout(scoreDebounceRef.current);
    };
  }, []);

  // ── Adapt to tool ─────────────────────────────────────────────────
  async function handleToolSelect(tool: AITool) {
    setSelectedTool(tool);
    setAdaptation(null);
    setIsAdapting(true);
    setError(null);

    try {
      const result = await adaptPrompt(editedPrompt, tool);
      setAdaptation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adapt prompt');
    } finally {
      setIsAdapting(false);
    }
  }

  // ── Apply missing element suggestion ─────────────────────────────
  function handleApplySuggestion(suggestion: string) {
    const separator = editedPrompt.trim().endsWith('.') ? ' ' : '. ';
    const newPrompt = `${editedPrompt.trim()}${separator}${suggestion}`;
    handlePromptEdit(newPrompt);
  }

  // ── Copy to clipboard ─────────────────────────────────────────────
  async function handleCopy(text: string, target: 'original' | 'adapted' = 'original') {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setCopyTarget(target);
    setTimeout(() => setCopied(false), 2000);
  }

  const currentScore = liveScore ?? analysis?.quality_score ?? null;
  const hasResult = analysis !== null;

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero section */}
        {!hasResult && (
          <div className="text-center pt-16 pb-10">
            <div className="inline-flex items-center gap-2 badge bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Prompt Engineering
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Write better{' '}
              <span className="text-gradient">AI prompts</span>
              <br className="hidden sm:block" /> in seconds
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Describe what you want to create. PromptFlow generates a structured, high-quality prompt
              with real-time feedback — then adapts it for ChatGPT, Midjourney, Figma AI, and more.
            </p>
          </div>
        )}

        {/* Steps indicator when result is shown */}
        {hasResult && (
          <div className="flex items-center gap-2 pt-8 pb-6 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Step 1 ✓ Intent</span>
            <span className="text-surface-border">→</span>
            <span className="text-violet-400 font-medium">Step 2: Refine & Adapt</span>
            <span className="text-surface-border">→</span>
            <span>Step 3: Export</span>
          </div>
        )}

        {/* Intent Input */}
        <div className={hasResult ? 'mb-8' : 'max-w-3xl mx-auto'}>
          <IntentInput onGenerate={handleGenerate} isLoading={isGenerating} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-sm text-red-300">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-slate-500 hover:text-slate-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Main result layout */}
        {hasResult && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left column — workspace */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prompt workspace */}
              <div className="card p-5">
                <PromptWorkspace
                  prompt={editedPrompt}
                  onChange={handlePromptEdit}
                  selectedTool={selectedTool}
                  adaptation={adaptation}
                  isAdapting={isAdapting}
                  onCopy={(text) =>
                    handleCopy(
                      text,
                      text === editedPrompt ? 'original' : 'adapted'
                    )
                  }
                  copied={copied}
                  copyTarget={copyTarget}
                />
              </div>

              {/* Tool selector */}
              <div className="card p-5">
                <ToolSelector
                  selected={selectedTool}
                  onSelect={handleToolSelect}
                  isAdapting={isAdapting}
                />
              </div>

              {/* Analysis tabs */}
              <div className="card overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-surface-border">
                  {(
                    [
                      { id: 'breakdown', label: 'Breakdown', icon: '📋' },
                      {
                        id: 'missing',
                        label: `Missing (${analysis.missing_elements.length})`,
                        icon: '⚠️',
                      },
                    ] as { id: Tab; label: string; icon: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider
                                  border-b-2 transition-colors focus:outline-none -mb-px
                                  ${activeTab === tab.id
                                    ? 'border-violet-500 text-violet-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-300'
                                  }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {activeTab === 'breakdown' && (
                    <PromptBreakdown components={analysis.components} />
                  )}
                  {activeTab === 'missing' && (
                    <MissingElements
                      elements={analysis.missing_elements}
                      onApplySuggestion={handleApplySuggestion}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right column — score + tips */}
            <div className="space-y-4">
              {currentScore && (
                <QualityScoreCard score={currentScore} isUpdating={isScoring} />
              )}

              {/* How it works */}
              <div className="card p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  How to use
                </h3>
                <ol className="space-y-3">
                  {[
                    { n: '1', text: 'Edit the generated prompt to match your vision' },
                    { n: '2', text: 'Watch the quality score update as you type' },
                    { n: '3', text: 'Add suggested missing elements to improve it' },
                    { n: '4', text: 'Select a tool to auto-adapt the syntax' },
                    { n: '5', text: 'Copy the final prompt and use it!' },
                  ].map(({ n, text }) => (
                    <li key={n} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand/20 text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {n}
                      </span>
                      <span className="text-xs text-slate-400 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prompt stats */}
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Prompt Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Characters', value: editedPrompt.length },
                    { label: 'Words', value: editedPrompt.split(/\s+/).filter(Boolean).length },
                    { label: 'Components', value: Object.values(analysis.components).filter(v => v && v !== 'Not specified').length },
                    { label: 'Missing', value: analysis.missing_elements.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-elevated rounded-lg px-3 py-2">
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-[11px] text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state / feature highlights */}
        {!hasResult && !isGenerating && (
          <div className="max-w-3xl mx-auto mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: '⚡',
                  title: 'Instant Generation',
                  desc: 'Go from rough idea to structured prompt in under 2 seconds',
                },
                {
                  icon: '📊',
                  title: 'Real-time Scoring',
                  desc: 'Quality feedback updates as you edit — clarity, specificity, structure',
                },
                {
                  icon: '🔄',
                  title: 'Multi-Tool Adaptation',
                  desc: 'One click converts your prompt for ChatGPT, Midjourney, DALL-E, and more',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card p-5 hover:border-surface-elevated transition-colors">
                  <div className="text-2xl mb-3">{icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
