import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getTasks(req: Request, res: Response) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, priority, dueDate, projectId, recurrenceRule } = req.body;
    if (!title) { res.status(400).json({ error: 'title est requis' }); return; }
    const task = await prisma.task.create({
      data: {
        title,
        priority: priority ?? 4,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId ?? null,
        recurrenceRule: recurrenceRule ?? 'none',
        userId: req.userId!,
      },
      include: { project: true },
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

function nextDueDate(current: Date | null, rule: string): Date | null {
  if (!current) return null;
  const d = new Date(current);
  if (rule === 'daily') d.setDate(d.getDate() + 1);
  else if (rule === 'weekly') d.setDate(d.getDate() + 7);
  else if (rule === 'monthly') d.setMonth(d.getMonth() + 1);
  return d;
}

export async function updateTask(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const task = await prisma.task.update({
      where: { id },
      data: req.body,
      include: { project: true },
    });

    // Auto-recreate recurring task when completed
    if (task.isCompleted && task.recurrenceRule && task.recurrenceRule !== 'none') {
      const next = nextDueDate(task.dueDate, task.recurrenceRule);
      await prisma.task.create({
        data: {
          title: task.title,
          priority: task.priority,
          projectId: task.projectId,
          recurrenceRule: task.recurrenceRule,
          isRecurring: true,
          dueDate: next,
          userId: task.userId,
        },
      });
    }
    res.json(task);
  } catch {
    res.status(404).json({ error: 'Tâche introuvable' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    await prisma.task.delete({ where: { id: req.params.id as string } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Tâche introuvable' });
  }
}
