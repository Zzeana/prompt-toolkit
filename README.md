# PromptFlow

AI-powered prompt generation and refinement tool for designers and creative professionals. Built with React, Express, and Claude Opus 4.6.

## Features

- **Intent-to-Prompt Generation** — Describe what you want; get a structured, ready-to-use prompt
- **Real-time Quality Scoring** — Live clarity/specificity/structure scores update as you edit (debounced 500ms)
- **Prompt Breakdown** — Visual annotation of Task, Context, Constraints, and Style components
- **Missing Elements Detection** — AI identifies gaps and suggests specific additions with one-click apply
- **Multi-Tool Adaptation** — One-click conversion for ChatGPT, Midjourney, DALL-E, Figma AI, Stable Diffusion
- **Voice Input** — Browser speech-to-text API support
- **Example Prompts** — Quick-start examples for common design tasks

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + TypeScript
- **AI:** Anthropic Claude Opus 4.6 with adaptive thinking
- **Dev:** concurrently + tsx for hot-reloading

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run in development mode
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/prompt/generate` | Generate structured prompt from user intent |
| POST | `/api/prompt/adapt` | Adapt prompt for a specific AI tool |
| POST | `/api/prompt/score` | Score an edited prompt in real-time |

## Project Structure

```
promptflow/
├── src/                    # React frontend
│   ├── App.tsx             # Main application state & layout
│   ├── types.ts            # Shared TypeScript types
│   ├── lib/api.ts          # Frontend API client
│   └── components/
│       ├── Header.tsx
│       ├── IntentInput.tsx       # Text + voice input with examples
│       ├── QualityScoreCard.tsx  # Animated score rings + dimension bars
│       ├── PromptBreakdown.tsx   # Task/Context/Constraints/Style view
│       ├── MissingElements.tsx   # Gap detection + one-click suggestions
│       ├── ToolSelector.tsx      # AI tool picker (5 tools)
│       └── PromptWorkspace.tsx   # Editable prompt + adapted version
├── server/
│   ├── index.ts            # Express server entry
│   └── routes/prompt.ts    # Claude API integration
└── ...config files
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) |
| `PORT` | Server port (default: 3001) |
