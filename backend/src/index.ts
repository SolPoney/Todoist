import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';
import { requireAuth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes publiques (pas besoin de token)
app.use('/auth', authRouter);

// Routes protégées (token JWT obligatoire)
app.use('/api/tasks', requireAuth, tasksRouter);

// Route de santé
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API Todoist opérationnelle' });
});

async function main() {
  await app.listen(PORT);
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
}

main();
