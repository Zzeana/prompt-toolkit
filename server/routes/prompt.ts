import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOL_SYNTAX: Record<string, string> = {
  chatgpt: `ChatGPT excels with clear, structured instructions. Use markdown for formatting. Specify: persona/role, exact task, output format, tone. Add chain-of-thought reasoning for complex requests.`,
  midjourney: `Midjourney uses parameter syntax. Key params: --ar (aspect ratio e.g. 16:9), --v (version e.g. 6.1), --style (e.g. raw), --chaos (0-100 for variation), --q (quality 0-2), --stylize (0-1000). Format: [subject], [environment], [mood], [style], [medium] --param value. Separate concepts with commas.`,
  dalle: `DALL-E responds to rich noun-phrase descriptions. Include: art style/medium (oil painting, digital art), lighting (golden hour, studio), perspective, mood, color palette. Avoid negatives—describe what you want, not what you don't want.`,
  figma_ai: `Figma AI responds to UI/UX design descriptions. Specify: component type, design system/style guide, platform (mobile/web), interaction states, responsive behavior, color tokens, spacing conventions.`,
  stable_diffusion: `Stable Diffusion uses weighted tokens and negative prompts. Format positive: (key concept:1.5), comma-separated. Negative prompt in separate field. Include: artist references, render engine (octane render, unreal engine), lighting descriptors. Add LoRA with <lora:name:weight>.`,
};

function parseJsonFromResponse(text: string): unknown {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  return JSON.parse(cleaned);
}

// POST /api/prompt/generate
router.post('/generate', async (req: Request, res: Response) => {
  const { intent } = req.body as { intent?: string };

  if (!intent || typeof intent !== 'string' || intent.trim().length === 0) {
    res.status(400).json({ error: 'intent is required' });
    return;
  }

  if (intent.length > 600) {
    res.status(400).json({ error: 'intent must be 500 characters or fewer' });
    return;
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thinking: { type: 'adaptive' } as any,
      messages: [
        {
          role: 'user',
          content: `You are an expert prompt engineer. A user wants to use an AI tool but needs help writing a high-quality prompt.

User's creative intent: "${intent.trim()}"

Analyze the intent and produce a structured, actionable prompt. Respond with ONLY valid JSON—no markdown, no explanation:

{
  "structured_prompt": "<A complete, well-formed prompt string ready to use in an AI tool>",
  "components": {
    "task": "<What the AI should create or do>",
    "context": "<Background information, use case, audience>",
    "constraints": "<Technical requirements, format, dimensions, limitations>",
    "style": "<Aesthetic direction, mood, visual style, tone>"
  },
  "quality_score": {
    "overall": <integer 0-100>,
    "clarity": <integer 0-100>,
    "specificity": <integer 0-100>,
    "structure": <integer 0-100>,
    "feedback": "<1-2 sentences explaining the score and top improvement>"
  },
  "missing_elements": [
    {
      "type": "<one of: style, format, constraints, context, mood, dimensions, audience, platform>",
      "description": "<what is missing or vague>",
      "suggestion": "<specific text the user could add>"
    }
  ]
}

Scoring guide: 90+ = excellent (very specific, all components present), 70-89 = good (clear intent, minor gaps), 50-69 = fair (some vagueness), <50 = needs work. Return 0-3 missing elements only for genuine gaps.`,
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
    console.error('generate error:', err);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

// POST /api/prompt/adapt
router.post('/adapt', async (req: Request, res: Response) => {
  const { prompt, tool } = req.body as { prompt?: string; tool?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }
  if (!tool || !(tool in TOOL_SYNTAX)) {
    res.status(400).json({ error: 'valid tool is required' });
    return;
  }

  const syntaxGuide = TOOL_SYNTAX[tool];

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Adapt the following prompt specifically for ${tool}.

Tool syntax guide: ${syntaxGuide}

Original prompt:
"${prompt.trim()}"

Rewrite the prompt to follow ${tool}'s conventions and best practices. Respond with ONLY valid JSON:

{
  "adapted_prompt": "<the fully rewritten, tool-optimized prompt>",
  "changes": ["<change 1>", "<change 2>", "<change 3>"]
}

List 2-4 specific changes you made. Keep the semantic meaning intact.`,
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
    console.error('adapt error:', err);
    res.status(500).json({ error: 'Failed to adapt prompt' });
  }
});

// POST /api/prompt/score
router.post('/score', async (req: Request, res: Response) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Score this AI prompt for quality. Be fast and accurate.

Prompt: "${prompt.trim()}"

Respond with ONLY valid JSON:
{
  "overall": <integer 0-100>,
  "clarity": <integer 0-100>,
  "specificity": <integer 0-100>,
  "structure": <integer 0-100>,
  "feedback": "<1 sentence with the top actionable improvement>"
}`,
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
    console.error('score error:', err);
    res.status(500).json({ error: 'Failed to score prompt' });
  }
});

export default router;
