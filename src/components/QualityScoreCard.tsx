import type { QualityScore } from '../types';

interface Props {
  score: QualityScore;
  isUpdating?: boolean;
}

function scoreColor(val: number): string {
  if (val >= 90) return '#10b981'; // emerald
  if (val >= 70) return '#22d3ee'; // cyan
  if (val >= 50) return '#f59e0b'; // amber
  return '#f87171'; // red
}

function ScoreRing({ value, size = 96 }: { value: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = scoreColor(value);

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={6}
        className="score-ring-track"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={6}
        stroke={color}
        className="score-ring-fill"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
    </svg>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-medium" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  );
}

export default function QualityScoreCard({ score, isUpdating = false }: Props) {
  const color = scoreColor(score.overall);

  return (
    <div className={`card p-5 transition-opacity duration-300 ${isUpdating ? 'opacity-60' : 'opacity-100'}`}>
      <div className="flex items-center gap-1.5 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h3 className="text-sm font-semibold text-slate-300">Quality Score</h3>
        {isUpdating && (
          <svg className="animate-spin w-3 h-3 text-slate-500 ml-auto" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      <div className="flex items-center gap-5 mb-4">
        <div className="relative flex-shrink-0">
          <ScoreRing value={score.overall} size={88} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white leading-none" style={{ color }}>
              {score.overall}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">score</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <MiniBar label="Clarity" value={score.clarity} />
          <MiniBar label="Specificity" value={score.specificity} />
          <MiniBar label="Structure" value={score.structure} />
        </div>
      </div>

      {score.feedback && (
        <p className="text-xs text-slate-400 leading-relaxed border-t border-surface-border pt-3">
          {score.feedback}
        </p>
      )}
    </div>
  );
}
