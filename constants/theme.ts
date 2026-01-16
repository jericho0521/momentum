
import { Platform } from 'react-native';

export const palette = {
  // Base
  offWhite: '#F9FAFB',
  white: '#FFFFFF',

  // Ink (Text)
  ink900: '#111827', // Primary
  ink700: '#374151', // Secondary
  ink400: '#9CA3AF', // Muted / Placeholders

  // Accents (Deep Charcoal)
  accent: '#1F2937',
  accentSubtle: '#E5E7EB',

  // Status
  error: '#EF4444',
  success: '#10B981',
} as const;

export const theme = {
  colors: {
    background: palette.offWhite,
    surface: palette.white,
    text: palette.ink900,
    textSecondary: palette.ink700,
    textMuted: palette.ink400,
    border: palette.accentSubtle,
    primary: palette.accent,
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
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
  },
  shadows: {
    // Soft, diffuse shadow for elevation
    soft: {
      ...Platform.select({
        ios: {
          shadowColor: palette.ink900,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: '0 4px 12px rgba(17, 24, 39, 0.04)',
        },
      }),
    },
    // Stronger shadow for floating elements
    floating: {
      ...Platform.select({
        ios: {
          shadowColor: palette.ink900,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: '0 8px 16px rgba(17, 24, 39, 0.08)',
        },
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
} as const;

// Types
export type Theme = typeof theme;
