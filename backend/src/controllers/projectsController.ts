import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getProjects(req: Request, res: Response) {
  const projects = await prisma.project.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'asc' } });
  res.json(projects);
}

export async function createProject(req: Request, res: Response) {
  const { name, color } = req.body;
  if (!name) { res.status(400).json({ error: 'name requis' }); return; }
  const project = await prisma.project.create({ data: { name, color: color ?? '#6366F1', userId: req.userId! } });
  res.status(201).json(project);
}

export async function deleteProject(req: Request, res: Response) {
  await prisma.project.delete({ where: { id: req.params.id as string } });
  res.status(204).send();
}
