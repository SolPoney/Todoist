import { apiFetch } from './client';

export async function apiLogin(email: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as Promise<{ token: string; user: { id: string; email: string; name: string } }>;
}

export async function apiRegister(email: string, password: string, name: string) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}
