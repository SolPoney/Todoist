import { PixelRatio } from 'react-native';

// Respecte les préférences de taille de texte système Android/iOS
// PixelRatio.getFontScale() retourne le multiplicateur système (1.0 = normal, 1.3 = grand, etc.)
const scale = PixelRatio.getFontScale();

// Tailles de base — seront multipliées par le scale système
export const fontSize = {
  xs: Math.max(12, 12 * scale),   // minimum 12px même à petite taille
  sm: Math.max(13, 13 * scale),
  md: Math.max(15, 15 * scale),
  lg: Math.max(17, 17 * scale),
  xl: Math.max(20, 20 * scale),
  xxl: Math.max(24, 24 * scale),
};

// Hauteurs de ligne adaptées (1.5x la taille pour bonne lisibilité — critère WCAG)
export const lineHeight = {
  xs: fontSize.xs * 1.5,
  sm: fontSize.sm * 1.5,
  md: fontSize.md * 1.5,
  lg: fontSize.lg * 1.5,
  xl: fontSize.xl * 1.4,
  xxl: fontSize.xxl * 1.3,
};

// Espacement lettres pour dyslexiques (légèrement plus espacé que le défaut)
export const letterSpacing = {
  normal: 0.3,
  wide: 0.5,
};
