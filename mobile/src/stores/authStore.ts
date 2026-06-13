import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin } from '../api/auth';

type User = { id: string; email: string; name: string };

type AuthStore = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  // Appelé au démarrage de l'app — recharge le token stocké
  loadToken: async () => {
    const token = await AsyncStorage.getItem('token');
    const userJson = await AsyncStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    set({ token, user, isLoading: false });
  },

  login: async (email, password) => {
    const data = await apiLogin(email, password);
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
