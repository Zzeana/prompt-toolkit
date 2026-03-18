import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Compact tool summaries for the prompt — keeps token usage low
const TOOL_SUMMARIES = [
  { id: 'otter-ai', name: 'Otter.ai', stages: ['research'], desc: 'Real-time interview transcription and speaker-identified notes.' },
  { id: 'dovetail', name: 'Dovetail', stages: ['research', 'synthesis'], desc: 'Research repository with AI tagging, thematic analysis, and insight reports for 10-50+ interviews.' },
  { id: 'maze', name: 'Maze', stages: ['research', 'testing'], desc: 'Async usability testing on Figma prototypes: task completion rates, click paths, preference tests.' },
  { id: 'usertesting', name: 'UserTesting', stages: ['research', 'testing'], desc: 'Enterprise moderated and unmoderated user research with a large screened participant panel.' },
  { id: 'typeform', name: 'Typeform', stages: ['research'], desc: 'Conversational surveys and forms with high completion rates and logic branching.' },
  { id: 'lookback', name: 'Lookback', stages: ['research', 'testing'], desc: 'Moderated remote user interview platform with observer room and session recording.' },
  { id: 'hotjar', name: 'Hotjar', stages: ['research', 'testing'], desc: 'Heatmaps, session recordings, and in-product surveys on live websites.' },
  { id: 'chatgpt', name: 'ChatGPT', stages: ['synthesis', 'ideation'], desc: 'General-purpose LLM for synthesizing transcripts, writing reports, generating concepts and HMW statements.' },
  { id: 'notion-ai', name: 'Notion AI', stages: ['synthesis'], desc: 'AI writing assistant inside Notion for summarizing docs, drafting reports, and structuring research notes.' },
  { id: 'miro-ai', name: 'Miro AI', stages: ['synthesis', 'ideation'], desc: 'Digital whiteboard with AI clustering, diagram generation, and workshop facilitation.' },
  { id: 'aurelius', name: 'Aurelius', stages: ['synthesis'], desc: 'Dedicated UX research repository for tagging insights and connecting evidence to design decisions.' },
  { id: 'midjourney', name: 'Midjourney', stages: ['ideation'], desc: 'Best-in-class AI image generation for mood boards, visual concepts, and lifestyle imagery.' },
  { id: 'figjam-ai', name: 'FigJam AI', stages: ['ideation', 'synthesis'], desc: 'AI whiteboarding inside Figma for workshop facilitation, journey maps, and team ideation.' },
  { id: 'whimsical-ai', name: 'Whimsical AI', stages: ['ideation'], desc: 'Generates flowcharts, user flows, and site maps from text descriptions.' },
  { id: 'ideogram', name: 'Ideogram', stages: ['ideation', 'prototyping'], desc: 'AI image generation that accurately renders text—great for UI concept mockups with readable copy.' },
  { id: 'adobe-firefly', name: 'Adobe Firefly', stages: ['ideation', 'prototyping'], desc: 'Brand-safe image and vector generation deeply integrated into Adobe Creative Cloud apps.' },
  { id: 'figma-ai', name: 'Figma AI', stages: ['prototyping'], desc: 'Industry-standard UI design tool with AI for generating components, filling content, and building prototypes.' },
  { id: 'v0', name: 'v0 by Vercel', stages: ['prototyping'], desc: 'Generates React + Tailwind UI code from text or screenshots; great for code prototypes.' },
  { id: 'framer', name: 'Framer', stages: ['prototyping'], desc: 'No-code interactive website and prototype builder with live publish URL.' },
  { id: 'uizard', name: 'Uizard', stages: ['prototyping'], desc: 'Converts sketches and screenshots into digital wireframes; great for non-designers or early-stage concepts.' },
  { id: 'galileo-ai', name: 'Galileo AI', stages: ['prototyping'], desc: 'Generates complete multi-screen Figma UI designs from a text brief.' },
  { id: 'relume', name: 'Relume', stages: ['prototyping'], desc: 'Generates full website sitemaps and wireframes from a brief; exports to Figma or Webflow.' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', stages: ['prototyping', 'ideation'], desc: 'Open-source image generation with LoRA and ControlNet for consistent styles; requires technical setup.' },
  { id: 'khroma', name: 'Khroma', stages: ['prototyping'], desc: 'AI color tool that learns your preferences and generates personalized brand palettes.' },
  { id: 'optimal-workshop', name: 'Optimal Workshop', stages: ['testing'], desc: 'IA testing platform: card sorting, tree testing, and first-click studies for navigation validation.' },
  { id: 'lyssna', name: 'Lyssna', stages: ['testing'], desc: 'Rapid preference tests and first-click studies with a built-in participant panel; results within hours.' },
  { id: 'fullstory', name: 'FullStory', stages: ['testing'], desc: 'Enterprise session recording and behavioral analytics on live products with advanced funnel analysis.' },
  { id: 'playbook-ux', name: 'PlaybookUX', stages: ['testing', 'research'], desc: 'Participant recruitment platform for moderated and unmoderated studies with a screened panel.' },
];

function parseJsonFromResponse(text: string): unknown {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  return JSON.parse(cleaned);
}

// POST /api/recommend
router.post('/', async (req: Request, res: Response) => {
  const { task } = req.body as { task?: string };

  if (!task || typeof task !== 'string' || task.trim().length === 0) {
    res.status(400).json({ error: 'task is required' });
    return;
  }
  if (task.length > 800) {
    res.status(400).json({ error: 'task must be 800 characters or fewer' });
    return;
  }

  const toolList = TOOL_SUMMARIES.map(
    (t) => `${t.id}: ${t.name} [${t.stages.join(', ')}] — ${t.desc}`
  ).join('\n');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are FlowSelect, an AI tool advisor for product designers. A designer needs help picking the right AI tool for their task.

Designer's task: "${task.trim()}"

Available tools:
${toolList}

Return exactly 3-5 tool recommendations ranked by fit. For the #1 pick, set isBestForMostPeople to true.

Respond with ONLY valid JSON — no markdown, no explanation:
{
  "results": [
    {
      "toolId": "<exact tool id from the list>",
      "rank": <1-5>,
      "matchScore": <integer 60-100>,
      "matchExplanation": "<1 sentence: why this tool fits this specific task>",
      "effort": "<Low|Medium|High>",
      "isBestForMostPeople": <true|false>
    }
  ]
}

Rules:
- Only recommend tools from the provided list
- Rank by task relevance first, then ease of use, then cost
- matchScore must reflect genuine fit (don't give everything 95+)
- effort should reflect the effort to get useful results from this tool for this specific task`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      res.status(500).json({ error: 'No text response from AI' });
      return;
    }

    const parsed = parseJsonFromResponse(textBlock.text);
    res.json(parsed);
  } catch (err) {
    console.error('recommend error:', err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
