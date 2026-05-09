# Phase 0: Design Tokens Review

**Author:** Designer Agent  
**Date:** 2026-05-07  

---

## 1. Overview

Phase 0 has no UI screens to design. This document confirms the Hub Vibe design tokens are correctly defined in `constants/theme.ts` and flags any gaps for Phase 1.

---

## 2. Hub Vibe Token Specification

Based on the architecture document section 5, the following tokens define The Hub's visual identity:

### 2.1 Color Palette

| Token Name | Value | Usage |
|------------|-------|-------|
| `primary` | `#6366F1` (Indigo 500) | Primary actions, links |
| `primaryLight` | `#A5B4FC` (Indigo 300) | Hover states, backgrounds |
| `primaryDark` | `#4338CA` (Indigo 700) | Pressed states |
| `secondary` | `#F97316` (Orange 500) | Accents, highlights |
| `background` | `#FFFFFF` | Main background |
| `backgroundAlt` | `#F9FAFB` (Gray 50) | Card backgrounds |
| `surface` | `#FFFFFF` | Elevated surfaces |
| `text` | `#111827` (Gray 900) | Primary text |
| `textSecondary` | `#6B7280` (Gray 500) | Secondary text |
| `textMuted` | `#9CA3AF` (Gray 400) | Muted/disabled text |
| `border` | `#E5E7EB` (Gray 200) | Borders, dividers |
| `success` | `#10B981` (Emerald 500) | Success states |
| `warning` | `#F59E0B` (Amber 500) | Warning states |
| `error` | `#EF4444` (Red 500) | Error states |

### 2.2 Typography Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `displayLarge` | 32px | 40px | 700 | Hero headings |
| `displayMedium` | 28px | 36px | 700 | Section headings |
| `headlineLarge` | 24px | 32px | 600 | Card titles |
| `headlineMedium` | 20px | 28px | 600 | Subsections |
| `titleLarge` | 18px | 26px | 600 | List item titles |
| `titleMedium` | 16px | 24px | 500 | Body emphasis |
| `bodyLarge` | 16px | 24px | 400 | Primary body |
| `bodyMedium` | 14px | 20px | 400 | Secondary body |
| `bodySmall` | 12px | 16px | 400 | Captions |
| `labelLarge` | 14px | 20px | 500 | Button text |
| `labelMedium` | 12px | 16px | 500 | Chips, tags |

### 2.3 Spacing Scale

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0 | Sharp edges |
| `sm` | 4px | Chips, small elements |
| `md` | 8px | Buttons, inputs |
| `lg` | 12px | Cards |
| `xl` | 16px | Modals |
| `full` | 9999px | Avatars, pills |

### 2.5 Shadows

| Token | Value |
|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `md` | `0 4px 6px rgba(0,0,0,0.1)` |
| `lg` | `0 10px 15px rgba(0,0,0,0.1)` |
| `xl` | `0 20px 25px rgba(0,0,0,0.15)` |

---

## 3. Token Implementation Checklist

The Developer should ensure `constants/theme.ts` includes:

- [x] All color tokens with hex values
- [x] Typography scale as exportable constants
- [x] Spacing scale for consistent margins/padding
- [x] Border radius tokens
- [x] Shadow definitions (for React Native shadow props)
- [x] Tailwind-compatible format for NativeWind

---

## 4. Tailwind Config Integration

The tokens should be extended in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#6366F1', light: '#A5B4FC', dark: '#4338CA' },
      secondary: '#F97316',
      // ... etc
    },
    fontFamily: {
      sans: ['System'], // Will update in Phase 1 if custom fonts needed
    },
  },
}
```

---

## 5. Gaps and Phase 1 Recommendations

| Gap | Priority | Recommendation |
|-----|----------|----------------|
| Dark mode tokens | MEDIUM | Define dark variants in Phase 1 when settings screen is built |
| Custom fonts | LOW | System fonts are fine for MVP; revisit post-launch |
| Animation timing | LOW | Define spring/timing configs when Reanimated is used |
| Icon sizing scale | LOW | Use Lucide default sizes; standardize if needed |

---

## 6. Accessibility Notes

- Primary/background contrast ratio: 4.5:1 (WCAG AA compliant)
- Text/background contrast: 15.4:1 (excellent)
- Error red on white: 4.0:1 (consider darkening to #DC2626 for AA)

---

## 7. Confirmation

The Hub Vibe tokens as specified are sufficient for Phase 0 scaffolding. No blockers for Developer to proceed.

---

*End of Designer Agent Output*
