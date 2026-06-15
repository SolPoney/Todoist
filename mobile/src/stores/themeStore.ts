import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ColorTheme } from '../theme/colors';

type ThemeStore = {
  isDark: boolean;
  colors: ColorTheme;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: true,
  colors: darkColors,

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem('theme');
    const isDark = saved !== 'light';
    set({ isDark, colors: isDark ? darkColors : lightColors });
  },

  toggleTheme: async () => {
    const isDark = !get().isDark;
    await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    set({ isDark, colors: isDark ? darkColors : lightColors });
  },
}));
