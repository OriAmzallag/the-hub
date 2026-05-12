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

  // Decline tone — warm muted, replaces red for negative actions per the
  // "no red anywhere" discipline rule. Use for Decline / Cancel / Remove
  // buttons, dispute states, and validation errors that need warmth.
  decline: '#C4886B',
  declineSoft: 'rgba(196,136,107,0.12)',
  declineBorder: 'rgba(196,136,107,0.40)',
  declineShadow: 'rgba(196,136,107,0.30)',

  // Semantic colors. NOTE: no `error` token — discipline rule is "no red
  // anywhere"; use `decline*` for negative-action UI instead.
  success: '#10B981',
  warning: '#F59E0B',

  // Scrims — black overlays used behind sheets and dismissable backdrops.
  // Two opacity tiers because the booking sheet wanted darker recession.
  bgScrim: 'rgba(0,0,0,0.55)',
  bgScrimDark: 'rgba(0,0,0,0.72)',

  // Bg overlays — `bg` (#1A1815) at common opacities. Used for blurred
  // tab bars, sticky CTAs, frosted top bars, and image scrim gradients
  // anywhere we want a tinted-translucent canvas instead of a solid one.
  bgOverlay94: 'rgba(26,24,21,0.94)',
  bgOverlay85: 'rgba(26,24,21,0.85)',
  bgOverlay70: 'rgba(26,24,21,0.7)',
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
  // Wide-tracked mono for action-required status captions (0.18em tracking)
  monoStatusWide: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    fontWeight: '600' as const,
    letterSpacing: 1.71, // 0.18em
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
  // Compact mono for timestamps (0.1em tracking)
  monoTimestamp: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500' as const,
    letterSpacing: 0.9, // 0.1em
    lineHeight: 9,
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

  // Body styles for message previews
  bodyPreview: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12.5,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16.25, // 1.3
  },
  bodyPreviewUnread: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 12.5,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 16.25, // 1.3
  },
} as const;

// Canonical 7-style scale per the design system reference. New surfaces
// should use these intent-named entries; the component-specific tokens
// above (displayXl, sectionTitle, monoStatus, etc.) are pre-existing
// pixel-perfect overrides for the screens that already exist and stay
// in place — no consumer needs to change.
//
// NOTE: our existing `typography.displayXl` (26px) is what the reference
// would call `displayM`. Names overlap; values differ. Read the comments,
// not the labels, when picking.
export const textScale = {
  // Influencer name on storefront — the showcase headline.
  displayXL: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 52,
    fontWeight: '800' as const,
    letterSpacing: -2.34, // -0.045em
    lineHeight: 47.84,    // 0.92
  },
  // Section heroes (success "On its way to {name}", empty-state hero).
  displayL: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: -1.44, // -0.04em
    lineHeight: 36,       // 1.0
  },
  // Section titles, big numerics.
  displayM: {
    fontFamily: 'InterTight-Bold',
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.84, // -0.035em
    lineHeight: 25.2,     // 1.05
  },
  // Card titles, service names.
  heading: {
    fontFamily: 'InterTight-Bold',
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.425, // -0.025em
    lineHeight: 20.4,      // 1.2
  },
  // Bio, review text — comfortable reading.
  bodyL: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.075, // -0.005em
    lineHeight: 21.75,     // 1.45
  },
  // Default UI text.
  bodyM: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 21,        // 1.5
  },
  // System labels, captions — mono uppercase.
  monoLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 1.5,    // 0.15em
    lineHeight: 10,        // 1.0
    textTransform: 'uppercase' as const,
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

// Semantic radius aliases — pair with their use-case so consumers can express
// intent ("avatarRadius") instead of the raw number ("borderRadius.lg = 12").
// Wraps `borderRadius.*` so values stay in lockstep.
export const radii = {
  card: borderRadius.xl,        // 14 — all surfaces
  pill: borderRadius.full,      // 9999 — buttons, status pills
  avatar: borderRadius.lg,      // 12 — identity tiles (rounded square, NEVER circle)
  avatarHero: 24,               // 96x96 hero avatars (proportional to avatar at 2x size)
  sheet: 22,                    // top corners of bottom sheets
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
  statusDotGlow: {
    shadowColor: '#FF7A29',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 0,
  },
  // Bottom-sheet drop shadow (lifted from FilterSheet / BookingRequestSheet).
  // Reference recipe: `0 -20px 60px rgba(0,0,0,0.5)`.
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
} as const;

// =================================================================
// MOTION
// =================================================================
// Durations (ms) and easing curves — pair with `withTiming` from
// react-native-reanimated, e.g.:
//   withTiming(0, { duration: motion.duration.slow, easing: Easing.bezier(...motion.easing.sheet) })
// Easings are bezier coordinate tuples so consumers can spread into
// Reanimated's `Easing.bezier(x1, y1, x2, y2)`.
export const motion = {
  duration: {
    fast: 150,    // micro-interactions
    base: 180,    // default transitions (hover, select)
    slow: 600,    // sheet rises, big moves
  },
  easing: {
    smooth: [0.4, 0, 0.2, 1] as const,        // carousel transitions
    sheet:  [0.25, 0.1, 0.25, 1] as const,    // bottom sheet rise (CSS-standard ease — more even than a heavy decelerate, so the sheet doesn't visually arrive in the first 30% of the duration)
    pop:    [0.34, 1.56, 0.64, 1] as const,   // success pop spring
  },
} as const;

// =================================================================
// RECIPES — common style combinations
// =================================================================
// Spread these into View / Pressable / Text style props to avoid
// rebuilding the same patterns in every component. Recipes are flat
// objects (not split between View and Text) — consumers pick the
// relevant keys for the element they're styling.
export const recipes = {
  // Plain raised card — surface bg + soft border + card radius.
  surfaceTile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
  },
  // Selected / attention-needed surface — accentSoft bg + accentBorder.
  accentTile: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.card,
  },
  // Decline-state surface — warm muted, replaces what would have been a red tint.
  declineTile: {
    backgroundColor: colors.declineSoft,
    borderWidth: 1,
    borderColor: colors.declineBorder,
    borderRadius: radii.card,
  },
  // Pill button base. Padding and Text styles handled by the consumer.
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    ...{
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.declineBorder,
    borderRadius: radii.pill,
  },
} as const;

export const theme = {
  colors,
  fonts,
  typography,
  textScale,
  spacing,
  borderRadius,
  radii,
  shadows,
  motion,
  recipes,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type TextScale = typeof textScale;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Radii = typeof radii;
export type Shadows = typeof shadows;
export type Motion = typeof motion;
export type Recipes = typeof recipes;
