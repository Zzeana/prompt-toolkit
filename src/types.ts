export type AITool =
  | 'chatgpt'
  | 'midjourney'
  | 'dalle'
  | 'figma_ai'
  | 'stable_diffusion';

export interface PromptComponents {
  task: string;
  context: string;
  constraints: string;
  style: string;
}

export interface QualityScore {
  overall: number;
  clarity: number;
  specificity: number;
  structure: number;
  feedback: string;
}

export interface MissingElement {
  type: string;
  description: string;
  suggestion: string;
}

export interface PromptAnalysis {
  structured_prompt: string;
  components: PromptComponents;
  quality_score: QualityScore;
  missing_elements: MissingElement[];
}

export interface ToolAdaptation {
  adapted_prompt: string;
  changes: string[];
}

export interface GenerateRequest {
  intent: string;
}

export interface AdaptRequest {
  prompt: string;
  tool: AITool;
}

export interface ScoreRequest {
  prompt: string;
}

export const AI_TOOLS: Record<AITool, { label: string; color: string; description: string }> = {
  chatgpt: {
    label: 'ChatGPT',
    color: '#10a37f',
    description: 'Conversational, clear instructions',
  },
  midjourney: {
    label: 'Midjourney',
    color: '#4C7AF1',
    description: 'Parameter-based image generation',
  },
  dalle: {
    label: 'DALL-E',
    color: '#FF6B35',
    description: 'Descriptive image prompts',
  },
  figma_ai: {
    label: 'Figma AI',
    color: '#9747FF',
    description: 'UI/UX design generation',
  },
  stable_diffusion: {
    label: 'Stable Diffusion',
    color: '#E05252',
    description: 'Weighted, technical prompts',
  },
};
