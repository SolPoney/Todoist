import { apiFetch } from './client';

export type ApiProject = { id: string; name: string; color: string; };

export function apiGetProjects(): Promise<ApiProject[]> {
  return apiFetch('/api/projects');
}
export function apiCreateProject(name: string, color: string): Promise<ApiProject> {
  return apiFetch('/api/projects', { method: 'POST', body: JSON.stringify({ name, color }) });
}
export function apiDeleteProject(id: string): Promise<null> {
  return apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
}
