import type { WorkflowStage } from '../types';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'research',
    name: 'Research',
    description: 'Understand your users, gather qualitative and quantitative data, and uncover real needs.',
    icon: '🔍',
    accentColor: 'blue',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    subCategories: ['Interview Analysis', 'Survey Creation', 'Behavioral Analytics', 'Diary Studies', 'Usability Testing'],
  },
  {
    id: 'synthesis',
    name: 'Synthesis',
    description: 'Analyze collected data, find patterns, and distill insights into actionable findings.',
    icon: '🧠',
    accentColor: 'violet',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    subCategories: ['Affinity Mapping', 'Thematic Analysis', 'Persona Building', 'Journey Mapping', 'Report Writing'],
  },
  {
    id: 'ideation',
    name: 'Ideation',
    description: 'Generate concepts, explore directions, and visualize possibilities before committing to a path.',
    icon: '💡',
    accentColor: 'amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    subCategories: ['Concept Generation', 'Visual Brainstorming', 'Workshop Facilitation', 'Competitor Inspiration', 'Storyboarding'],
  },
  {
    id: 'prototyping',
    name: 'Prototyping',
    description: 'Create mockups, wireframes, and interactive prototypes to bring ideas to life quickly.',
    icon: '⚡',
    accentColor: 'emerald',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    subCategories: ['Wireframing', 'UI Design', 'Interactive Prototypes', 'Asset Generation', 'Code Prototypes'],
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Validate designs with real users, measure usability, and gather data to inform iterations.',
    icon: '✅',
    accentColor: 'rose',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    subCategories: ['Usability Testing', 'Preference Testing', 'Card Sorting', 'Session Recording', 'Accessibility Testing'],
  },
];

export const STAGE_MAP: Record<string, WorkflowStage> = Object.fromEntries(
  WORKFLOW_STAGES.map((s) => [s.id, s])
);
