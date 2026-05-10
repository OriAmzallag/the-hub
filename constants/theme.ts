/**
 * Hub Vibe Design Tokens - Metal x Sunset Orange (Dark Theme)
 * These values are the source of truth for The Hub's visual identity.
 * They mirror the Tailwind config for use in JS/TS when needed.
 */

export const colors = {
  // Core backgrounds
  bg: '#1A1815',
  surface: '#2A2620',
  surfaceAlt: '#221F1A',

  // Borders
  border: 'rgba(244,240,232,0.08)',
  borderStrong: 'rgba(244,240,232,0.15)',

  // Text (ink)
  ink: '#F4F0E8',
  inkMuted: '#8A7E6C',
  inkSubtle: '#5C5448',

  // Accent (sunset orange)
  accent: '#FF7A29',
  accentSoft: 'rgba(255,122,41,0.12)',
  accentBorder: 'rgba(255,122,41,0.40)',
  accentShadow: 'rgba(255,122,41,0.30)',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const fonts = {
  display: 'InterTight',
  body: 'InterTight',
  mono: 'JetBrainsMono',
} as const;

export const typography = {
  // Display styles (Inter Tight)
  displayXl: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: -1.04, // -0.04em
    lineHeight: 26,
  },
  displayLg: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: -0.96, // -0.04em
    lineHeight: 24,
  },
  sectionTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.77, // -0.035em
    lineHeight: 22,
  },
  tileTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.51, // -0.03em
    lineHeight: 17,
  },
  rowPrimary: {
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: -0.48, // -0.03em
    lineHeight: 16,
  },
  rowTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: -0.375, // -0.025em
    lineHeight: 16.5, // 1.1
  },
  bannerTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700' as const,
    letterSpacing: -0.3625, // -0.025em
    lineHeight: 15.95, // 1.1
  },
  rowSecondary: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: -0.35, // -0.025em
    lineHeight: 14,
  },

  // Mono styles (JetBrains Mono)
  monoGreeting: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 2, // 0.2em
    lineHeight: 10,
    textTransform: 'uppercase' as const,
  },
  monoLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500' as const,
    letterSpacing: 1.575, // 0.15em
    lineHeight: 10.5,
    textTransform: 'uppercase' as const,
  },
  monoStatus: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500' as const,
    letterSpacing: 1.425, // 0.15em
    lineHeight: 9.5,
    textTransform: 'uppercase' as const,
  },
  monoStatLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500' as const,
    letterSpacing: 1.425, // 0.15em
    lineHeight: 12.35, // 1.3
    textTransform: 'uppercase' as const,
  },
  monoTab: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500' as const,
    letterSpacing: 1.08, // 0.12em
    lineHeight: 9,
    textTransform: 'uppercase' as const,
  },
  monoTabActive: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9,
    fontWeight: '600' as const,
    letterSpacing: 1.08, // 0.12em
    lineHeight: 9,
    textTransform: 'uppercase' as const,
  },
  monoBadge: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 8,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 8,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 14,
  '2xl': 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  accentGlow: {
    shadowColor: '#FF7A29',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  notificationDot: {
    shadowColor: '#FF7A29',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 0,
  },
} as const;

export const theme = {
  colors,
  fonts,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
