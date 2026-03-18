export type WorkflowStageId = 'research' | 'synthesis' | 'ideation' | 'prototyping' | 'testing';

export type PricingTier = 'free' | 'freemium' | 'paid' | 'enterprise';
export type EffortLevel = 'Low' | 'Medium' | 'High';
export type LearningCurve = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AITool {
  id: string;
  name: string;
  description: string;
  workflowStages: WorkflowStageId[];
  subCategories: string[];
  strengths: [string, string, string];
  weaknesses: string[];
  useCases: string[];
  antiUseCases: string[];
  pricing: string;
  pricingTier: PricingTier;
  url: string;
  lastVerified: string;
  learningCurve: LearningCurve;
  effort: EffortLevel;
  logoColor: string;
  logoLetter: string;
}

export interface WorkflowStage {
  id: WorkflowStageId;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  subCategories: string[];
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  toolId: string;
  handoff?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStageId[];
  steps: WorkflowStep[];
  totalTime: string;
  difficulty: LearningCurve;
}

export interface RecommendationResult {
  toolId: string;
  rank: number;
  matchScore: number;
  matchExplanation: string;
  effort: EffortLevel;
  isBestForMostPeople: boolean;
}

export type ViewState =
  | { type: 'home' }
  | { type: 'stage'; stageId: WorkflowStageId; subCategory?: string }
  | { type: 'recommendations'; query: string; results: RecommendationResult[] }
  | { type: 'comparison'; toolIds: string[] }
  | { type: 'tool'; toolId: string }
  | { type: 'workflows' };
