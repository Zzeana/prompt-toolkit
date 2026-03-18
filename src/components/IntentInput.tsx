import { useState, useEffect, useRef } from 'react';

interface IntentInputProps {
  onGenerate: (intent: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 500;

const EXAMPLES = [
  "A minimalist logo for a sustainable coffee shop called 'Root & Bloom'",
  "UI design for a meditation app with calming nature-inspired visuals",
  "Portrait of a futuristic city at sunset with flying cars and neon signs",
  "A character illustration of a female scientist in a lab coat, mid-30s",
];

export default function IntentInput({ onGenerate, isLoading }: IntentInputProps) {
  const [intent, setIntent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const charCount = intent.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = charCount > 0 && !isOverLimit && !isLoading;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [intent]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) onGenerate(intent.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      onGenerate(intent.trim());
    }
  }

  function useExample(example: string) {
    setIntent(example);
    textareaRef.current?.focus();
  }

  function toggleVoice() {
    type SpeechRecognitionCtor = new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start: () => void;
      stop: () => void;
      onresult: ((e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const results = event.results as unknown as SpeechRecognitionResultList;
      const transcript = Array.from(results)
        .map((r) => r[0].transcript)
        .join('');
      setIntent(transcript.slice(0, MAX_CHARS));
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }

  const hasSpeech =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="card p-1 focus-within:border-brand/50 focus-within:glow-purple transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={intent}
            onChange={(e) => setIntent(e.target.value.slice(0, MAX_CHARS + 20))}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create with AI... e.g. 'A modern logo for a sustainable coffee brand called Root & Bloom'"
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-base leading-relaxed
                       px-4 pt-4 pb-2 resize-none min-h-[100px] max-h-[240px] focus:outline-none font-sans"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Voice input button */}
              {hasSpeech && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-1.5 rounded-md transition-colors ${
                    isListening
                      ? 'text-red-400 bg-red-400/10 animate-pulse-soft'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-surface-border'
                  }`}
                  title={isListening ? 'Stop recording' : 'Voice input'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </button>
              )}

              <span className="text-xs text-slate-500 hidden sm:inline">
                ⌘↵ to generate
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs tabular-nums ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
                {charCount}/{MAX_CHARS}
              </span>
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Example prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => useExample(ex)}
            disabled={isLoading}
            className="text-xs text-slate-400 hover:text-white bg-surface-elevated hover:bg-surface-border
                       border border-surface-border px-3 py-1.5 rounded-full transition-colors truncate max-w-[260px]"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
