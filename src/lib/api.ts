import type { AITool, PromptAnalysis, QualityScore, ToolAdaptation } from '../types';

const BASE = '/api/prompt';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error?: string }).error ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

export function generatePrompt(intent: string): Promise<PromptAnalysis> {
  return post<PromptAnalysis>('/generate', { intent });
}

export function adaptPrompt(prompt: string, tool: AITool): Promise<ToolAdaptation> {
  return post<ToolAdaptation>('/adapt', { prompt, tool });
}

export function scorePrompt(prompt: string): Promise<QualityScore> {
  return post<QualityScore>('/score', { prompt });
}
