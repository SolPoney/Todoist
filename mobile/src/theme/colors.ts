export type ColorTheme = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  tabBar: string;
};

export const darkColors: ColorTheme = {
  background: '#1A1A1A',
  surface: '#2A2A2A',
  border: '#3A3A3A',
  text: '#FFFFFF',
  textSecondary: '#A8A8A8',
  textMuted: '#9A9A9A',
  accent: '#E8534A',
  tabBar: '#1A1A1A',
};

export const lightColors: ColorTheme = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  accent: '#E8534A',
  tabBar: '#FFFFFF',
};

// Export par défaut pour la compatibilité avec les fichiers non migrés
export const colors = darkColors;
