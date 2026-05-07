/**
 * Hub Vibe Design Tokens
 * These values are the source of truth for The Hub's visual identity.
 * They mirror the Tailwind config for use in JS/TS when needed.
 */

export const colors = {
  primary: {
    DEFAULT: "#6366F1",
    light: "#A5B4FC",
    dark: "#4338CA",
  },
  secondary: {
    DEFAULT: "#F97316",
  },
  background: {
    DEFAULT: "#FFFFFF",
    alt: "#F9FAFB",
  },
  surface: "#FFFFFF",
  text: {
    DEFAULT: "#111827",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
} as const;

export const typography = {
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  headlineLarge: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  headlineMedium: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  titleLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
} as const;

export const theme = {
  colors,
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
