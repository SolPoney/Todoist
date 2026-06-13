import client from './client';

export type ApiTask = {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: number;
  dueDate: string | null;
  isRecurring: boolean;
  createdAt: string;
  projectId: string | null;
  project: { id: string; name: string } | null;
};

export async function apiGetTasks(): Promise<ApiTask[]> {
  const res = await client.get('/api/tasks');
  return res.data;
}

export async function apiCreateTask(title: string, priority = 4): Promise<ApiTask> {
  const res = await client.post('/api/tasks', { title, priority });
  return res.data;
}

export async function apiCompleteTask(id: string): Promise<ApiTask> {
  const res = await client.patch(`/api/tasks/${id}`, { isCompleted: true });
  return res.data;
}

export async function apiDeleteTask(id: string): Promise<void> {
  await client.delete(`/api/tasks/${id}`);
}
