import { useThemeStore } from '../stores/themeStore';
import { ColorTheme } from './colors';

export function useColors(): ColorTheme {
  return useThemeStore((s) => s.colors);
}
