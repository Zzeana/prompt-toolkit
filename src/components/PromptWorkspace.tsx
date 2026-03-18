import { useRef, useEffect } from 'react';
import type { AITool, ToolAdaptation } from '../types';
import { AI_TOOLS } from '../types';

interface Props {
  prompt: string;
  onChange: (val: string) => void;
  selectedTool: AITool | null;
  adaptation: ToolAdaptation | null;
  isAdapting: boolean;
  onCopy: (text: string) => void;
  copied: boolean;
  copyTarget: 'original' | 'adapted';
}

export default function PromptWorkspace({
  prompt,
  onChange,
  selectedTool,
  adaptation,
  isAdapting,
  onCopy,
  copied,
  copyTarget,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(ta.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  const toolMeta = selectedTool ? AI_TOOLS[selectedTool] : null;

  return (
    <div className="space-y-3">
      {/* Original prompt editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generated Prompt</span>
            <span className="text-xs text-slate-600">— edit freely, score updates live</span>
          </div>
          <button
            onClick={() => onCopy(prompt)}
            className="flex items-center gap-1.5 text-xs btn-secondary py-1 px-2.5"
          >
            {copied && copyTarget === 'original' ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        <div className="card p-0.5 focus-within:border-violet-500/40 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-slate-200 text-sm leading-relaxed font-mono
                       px-4 py-3 resize-none min-h-[120px] focus:outline-none"
            placeholder="Your generated prompt will appear here..."
          />
        </div>
      </div>

      {/* Adapted prompt (shown when tool selected) */}
      {selectedTool && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: toolMeta?.color }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: toolMeta?.color }}>
                {toolMeta?.label} Version
              </span>
            </div>
            {adaptation && (
              <button
                onClick={() => onCopy(adaptation.adapted_prompt)}
                className="flex items-center gap-1.5 text-xs btn-secondary py-1 px-2.5"
              >
                {copied && copyTarget === 'adapted' ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div
            className="card p-4 min-h-[80px]"
            style={{ borderColor: toolMeta ? toolMeta.color + '30' : undefined }}
          >
            {isAdapting ? (
              <div className="flex items-center gap-3 text-slate-400 py-2">
                <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <span className="text-sm">Adapting for {toolMeta?.label}…</span>
              </div>
            ) : adaptation ? (
              <>
                <p className="text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                  {adaptation.adapted_prompt}
                </p>
                {adaptation.changes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-surface-border">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                      Changes made
                    </p>
                    <ul className="space-y-1">
                      {adaptation.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span style={{ color: toolMeta?.color }}>→</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 italic">Adaptation will appear here…</p>
            )}
          </div>
        </div>
      )}

      {/* Quick copy CTA when no tool selected */}
      {!selectedTool && prompt && (
        <p className="text-xs text-slate-500 text-center">
          Select a tool above to auto-adapt this prompt, or copy it directly.
        </p>
      )}
    </div>
  );
}
