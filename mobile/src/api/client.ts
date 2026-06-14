import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.34:3000';

// Wrapper autour de fetch natif avec JWT automatique
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(error.error ?? 'Erreur serveur');
  }

  if (res.status === 204) return null;
  return res.json();
}
