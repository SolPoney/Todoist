import client from './client';

export async function apiRegister(email: string, password: string, name: string) {
  const res = await client.post('/auth/register', { email, password, name });
  return res.data;
}

export async function apiLogin(email: string, password: string) {
  const res = await client.post('/auth/login', { email, password });
  return res.data as { token: string; user: { id: string; email: string; name: string } };
}
