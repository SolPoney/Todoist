import { apiFetch } from './client';

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

export function apiGetTasks(): Promise<ApiTask[]> {
  return apiFetch('/api/tasks');
}

export function apiCreateTask(title: string, priority = 4, dueDate?: string): Promise<ApiTask> {
  return apiFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, priority, ...(dueDate ? { dueDate } : {}) }),
  });
}

export function apiCompleteTask(id: string): Promise<ApiTask> {
  return apiFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isCompleted: true }),
  });
}

export function apiDeleteTask(id: string): Promise<null> {
  return apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function apiUpdateTask(id: string, data: { title?: string; dueDate?: string | null }): Promise<ApiTask> {
  return apiFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
