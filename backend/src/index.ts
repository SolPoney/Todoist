import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares globaux
app.use(cors());                  // Autorise les requêtes depuis le mobile
app.use(express.json());          // Parse le body JSON des requêtes

// Routes
app.use('/api/tasks', tasksRouter);

// Route de santé — pour vérifier que l'API tourne
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API Todoist opérationnelle' });
});

async function main() {
  await app.listen(PORT);
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
}

main();
