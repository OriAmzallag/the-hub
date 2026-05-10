/**
 * The Hub — Design Tokens (proposed reference, NOT the active source)
 *
 * This file is a REFERENCE for what the canonical token shape should be.
 * The ACTIVE tokens used by the app live at `constants/theme.ts`.
 *
 * The audit at `docs/features/design-system-audit/` compares this reference
 * against `constants/theme.ts` and the codebase to identify drifts.
 *
 * Discipline rules:
 *   1. Accent is used ONLY for primary actions, active states, status dots,
 *      selected items, and verified badges. Never decorative.
 *   2. NO RED — even for "destructive" actions. Decline tone replaces red.
 *   3. Mono is the system voice — anywhere a label or status would sit,
 *      mono uppercase signals "this is metadata, not content."
 */

// =================================================================
// COLORS
// =================================================================
export const colors = {
  // ─── SURFACES ────────────────────────────────────
  bg: '#1A1815',
  surface: '#2A2620',
  surfaceAlt: '#221F1A',
  border: 'rgba(244,240,232,0.08)',
  borderStrong: 'rgba(244,240,232,0.15)',

  // ─── INK (text) ──────────────────────────────────
  ink: '#F4F0E8',
  inkMuted: '#8A7E6C',
  inkSubtle: '#5C5448',

  // ─── ACCENT — sunset orange ──────────────────────
  accent: '#FF7A29',
  accentSoft: 'rgba(255,122,41,0.12)',
  accentBorder: 'rgba(255,122,41,0.40)',
  accentShadow: 'rgba(255,122,41,0.30)',

  // ─── DECLINE — warm muted, NEVER red ─────────────
  decline: '#C4886B',
  declineSoft: 'rgba(196,136,107,0.12)',
  declineBorder: 'rgba(196,136,107,0.40)',
  declineShadow: 'rgba(196,136,107,0.30)',
} as const;

// =================================================================
// TYPOGRAPHY
// =================================================================
export const type = {
  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900,
  },

  scale: {
    displayXL: { size: '52px', line: '0.92', tracking: '-0.045em' },
    displayL:  { size: '36px', line: '1.0',  tracking: '-0.04em'  },
    displayM:  { size: '24px', line: '1.05', tracking: '-0.035em' },
    heading:   { size: '17px', line: '1.2',  tracking: '-0.025em' },
    bodyL:     { size: '15px', line: '1.45', tracking: '-0.005em' },
    bodyM:     { size: '14px', line: '1.5',  tracking: 'normal'   },
    monoLabel: { size: '10px', line: '1',    tracking: '0.15em'   },
  },
} as const;

// =================================================================
// GEOMETRY
// =================================================================
export const geometry = {
  cardRadius:    '14px',           // 14–16px range — all surfaces
  pillRadius:    '100px',          // all buttons, all status pills
  avatarRadius:  '12px',           // ALL identity tiles — NEVER circle
  sheetRadius:   '22px',           // bottom sheets — top corners only

  ctaShadow:     '0 8px 24px rgba(255,122,41,0.30)',
  sheetShadow:   '0 -20px 60px rgba(0,0,0,0.5)',
  selectionRing: '0 0 0 4px rgba(255,122,41,0.12)',
} as const;

// =================================================================
// MOTION
// =================================================================
export const motion = {
  fast: '0.15s',
  base: '0.18s',
  slow: '0.42s',

  easeBase:   'ease',
  easeOut:    'ease-out',
  easeSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',  // carousel
  easeSheet:  'cubic-bezier(0.32, 0.72, 0, 1)',  // bottom sheet rise
} as const;
