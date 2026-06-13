import { Request, Response } from 'express';
import prisma from '../prisma';

// GET /api/tasks — récupère les tâches de l'utilisateur connecté
export async function getTasks(req: Request, res: Response) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/tasks — crée une nouvelle tâche
export async function createTask(req: Request, res: Response) {
  try {
    const { title, priority, dueDate, projectId } = req.body;

    if (!title) {
      res.status(400).json({ error: 'title est requis' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        priority: priority ?? 4,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId ?? null,
        userId: req.userId!,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PATCH /api/tasks/:id — met à jour une tâche (ex: cocher comme terminée)
export async function updateTask(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const data = req.body;

    const task = await prisma.task.update({
      where: { id },
      data,
    });
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: 'Tâche introuvable' });
  }
}

// DELETE /api/tasks/:id — supprime une tâche
export async function deleteTask(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Tâche introuvable' });
  }
}
