import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import promptRouter from './routes/prompt.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// API routes
app.use('/api/prompt', promptRouter);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PromptFlow server running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY is not set');
  }
});
