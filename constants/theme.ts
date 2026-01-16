/**
 * Theme System with Dark Mode Support
 */

import { Platform } from 'react-native';

// ============ Palette Type ============

interface Palette {
  offWhite: string;
  white: string;
  ink900: string;
  ink700: string;
  ink400: string;
  accent: string;
  accentSubtle: string;
  error: string;
  success: string;
}

// ============ Palettes ============

export const lightPalette: Palette = {
  offWhite: '#F9FAFB',
  white: '#FFFFFF',
  ink900: '#111827',
  ink700: '#374151',
  ink400: '#9CA3AF',
  accent: '#1F2937',
  accentSubtle: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
};

export const darkPalette: Palette = {
  offWhite: '#111827',
  white: '#1F2937',
  ink900: '#F9FAFB',
  ink700: '#E5E7EB',
  ink400: '#9CA3AF',
  accent: '#F9FAFB',
  accentSubtle: '#374151',
  error: '#F87171',
  success: '#34D399',
};

// ============ Create Theme from Palette ============

const createTheme = (palette: typeof lightPalette) => ({
  colors: {
    background: palette.offWhite,
    surface: palette.white,
    text: palette.ink900,
    textSecondary: palette.ink700,
    textMuted: palette.ink400,
    border: palette.accentSubtle,
    primary: palette.accent,
    error: palette.error,
    success: palette.success,
  },
  typography: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    sizes: {
      h1: 32,
      h2: 24,
      h3: 20,
      body: 16,
      caption: 14,
      small: 12,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
  },
  shadows: {
    soft: {
      ...Platform.select({
        ios: {
          shadowColor: palette.ink900,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        },
        android: { elevation: 3 },
        web: { boxShadow: '0 4px 12px rgba(17, 24, 39, 0.04)' },
      }),
    },
    floating: {
      ...Platform.select({
        ios: {
          shadowColor: palette.ink900,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
        web: { boxShadow: '0 8px 16px rgba(17, 24, 39, 0.08)' },
      }),
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    full: 9999,
  },
});

// ============ Export Themes ============

export const lightTheme = createTheme(lightPalette);
export const darkTheme = createTheme(darkPalette);

// Default theme (light) for backward compatibility
export const theme = lightTheme;
export const palette = lightPalette;

// Types
export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark' | 'system';
