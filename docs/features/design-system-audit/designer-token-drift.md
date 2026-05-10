# Designer audit -- token-level drift between `constants/theme.ts` and the canonical reference

_Date: 2026-05-10 -- audit only, no code changes_

## Summary

The codebase has **significant drift** from the canonical design system reference. While surface colors, ink colors, and accent tokens are fully aligned, there are critical gaps:

1. **Decline tone is entirely missing** -- the four `decline*` tokens that replace red for negative actions do not exist in `theme.ts`. Instead, the codebase has `error: '#EF4444'` (red), which directly violates the "no red anywhere" discipline rule.
2. **Motion tokens are completely absent** -- no duration or easing tokens exist.
3. **Geometry tokens are fragmented** -- no `avatarRadius`, `pillRadius`, `cardRadius`, `sheetRadius`, or shadow recipe tokens like `ctaShadow`, `sheetShadow`, `selectionRing`.
4. **Typography scale naming diverges** -- `theme.ts` uses custom names (`displayLg`, `sectionTitle`, `tileTitle`, `rowPrimary`, etc.) that don't map 1:1 to the reference scale (`displayXL`, `displayL`, `displayM`, `heading`, `bodyL`, `bodyM`, `monoLabel`).
5. **Recipes don't exist** -- no `surfaceTile`, `accentTile`, `primaryButton`, `secondaryButton`, `avatar(size)`, or `monogramTile(size)` helpers.

Verdict: **Drift is significant.** The color foundation is solid, but motion, geometry, decline tone, and type scale structure need alignment.

---

## 1. Colors

### Missing in `theme.ts`

| Reference token | Reference value | Notes |
|---|---|---|
| `decline` | `#C4886B` | Primary decline/negative action color. CRITICAL -- all "Decline", "Cancel", "Delete" buttons need this. |
| `declineSoft` | `rgba(196,136,107,0.12)` | Tinted background for decline UI elements. |
| `declineBorder` | `rgba(196,136,107,0.40)` | Border for decline-soft elements. |
| `declineShadow` | `rgba(196,136,107,0.30)` | Glow for decline CTAs if needed. |

### Differing values

| Token | Reference | theme.ts | Severity |
|---|---|---|---|
| (none) | -- | -- | -- |

All shared color tokens (`bg`, `surface`, `surfaceAlt`, `border`, `borderStrong`, `ink`, `inkMuted`, `inkSubtle`, `accent`, `accentSoft`, `accentBorder`, `accentShadow`) match exactly.

### theme.ts-only tokens (not in reference)

| theme.ts token | Value | Recommendation |
|---|---|---|
| `success` | `#10B981` | **Remove or deprecate.** The reference uses `accent` for "live/available" states. Green is not part of the color system. |
| `warning` | `#F59E0B` | **Remove or deprecate.** No warning color in the reference. Consider `inkMuted` for cautionary states. |
| `error` | `#EF4444` | **Remove.** Violates "no red anywhere" rule. Replace all usages with `decline` (`#C4886B`). |

---

## 2. Typography

### Missing in `theme.ts`

| Reference token | Reference value | Notes |
|---|---|---|
| `displayXL` | `{ size: '52px', line: '0.92', tracking: '-0.045em' }` | Influencer name on storefront. `theme.ts` has `displayXl` at 26px -- vastly smaller. |
| `displayL` | `{ size: '36px', line: '1.0', tracking: '-0.04em' }` | Section heroes. `theme.ts` has `displayLg` at 24px -- different name and smaller. |
| `displayM` | `{ size: '24px', line: '1.05', tracking: '-0.035em' }` | Section titles. Closest match is `displayLg` (24px) but naming differs. |
| `heading` | `{ size: '17px', line: '1.2', tracking: '-0.025em' }` | Card titles. `tileTitle` (17px) is close but tracking is `-0.03em` vs `-0.025em`. |
| `bodyL` | `{ size: '15px', line: '1.45', tracking: '-0.005em' }` | Bio, review text. **No body style exists in `theme.ts`.** |
| `bodyM` | `{ size: '14px', line: '1.5', tracking: 'normal' }` | Default UI text. **No body style exists in `theme.ts`.** |

### Differing values

| Token | Reference | theme.ts | Severity |
|---|---|---|---|
| `displayXl` / `displayXL` | 52px, line 0.92, tracking -0.045em | 26px, line 26, tracking -1.04px | HIGH -- 26px is half the reference size. Name casing also differs (`Xl` vs `XL`). |
| `displayLg` / `displayL` | 36px, line 1.0, tracking -0.04em | 24px, line 24, tracking -0.96px | HIGH -- 24px vs 36px. Name differs (`Lg` vs `L`). |
| `monoLabel` | 10px, line 1, tracking 0.15em | 10.5px, line 10.5, tracking 1.575px | LOW -- close but not exact. Tracking is in px (1.575) vs em (0.15em). |

### theme.ts-only tokens (not in reference)

| theme.ts token | Value | Recommendation |
|---|---|---|
| `sectionTitle` | 22px, weight 700, tracking -0.77px | **Rename to `displayM`** (22px is within 22-28px range for displayM). |
| `tileTitle` | 17px, weight 700, tracking -0.51px | **Rename to `heading`** and adjust tracking from -0.03em to -0.025em. |
| `rowPrimary` | 16px, weight 700, tracking -0.48px | **Keep as component-specific variant** or fold into `heading`. |
| `rowTitle` | 15px, weight 700, tracking -0.375px | **Consider mapping to `bodyL`** but weight differs (700 vs 400). |
| `bannerTitle` | 14.5px, weight 700, tracking -0.3625px | **Keep as component-specific variant.** |
| `rowSecondary` | 14px, weight 700, tracking -0.35px | **Keep or merge** -- similar to `bodyM` range but bolder. |
| `monoGreeting` | 10px, weight 500, tracking 2px (0.2em) | **Keep.** Variant of mono label with wider tracking. |
| `monoStatus` | 9.5px, weight 500, tracking 1.425px | **Keep.** Smaller mono variant for status text. |
| `monoStatLabel` | 9.5px, weight 500, tracking 1.425px, line 1.3 | **Keep.** Mono variant with taller line height. |
| `monoTab` | 9px, weight 500, tracking 1.08px (0.12em) | **Keep.** Tab-specific mono variant. |
| `monoTabActive` | 9px, weight 600, tracking 1.08px | **Keep.** Active state for mono tab. |
| `monoBadge` | 8px, weight 700, tracking 0 | **Keep.** Badge-specific style. |

**Structural note:** The reference uses a 7-style scale (`displayXL`, `displayL`, `displayM`, `heading`, `bodyL`, `bodyM`, `monoLabel`). The codebase has 14 styles with component-specific names. This is not inherently wrong but makes it harder to enforce consistency. Consider a two-tier approach: canonical scale + component aliases.

---

## 3. Geometry

### Missing in `theme.ts`

| Reference token | Reference value | Notes |
|---|---|---|
| `cardRadius` | `14px` | `theme.ts` has `borderRadius.xl: 14` -- same value, different structure. |
| `pillRadius` | `100px` | `theme.ts` has `borderRadius.full: 9999` -- functionally similar but not named `pillRadius`. |
| `avatarRadius` | `12px` | **MISSING.** `theme.ts` has `borderRadius.lg: 12` which could be used, but there's no semantic `avatarRadius` token. Components may default to `full` (circle), violating the "never circle" rule. |
| `sheetRadius` | `22px` | **MISSING.** No dedicated token. |
| `ctaShadow` | `0 8px 24px rgba(255,122,41,0.30)` | **MISSING.** `shadows.accentGlow` is close but uses different structure (RN shadow props vs CSS string). |
| `sheetShadow` | `0 -20px 60px rgba(0,0,0,0.5)` | **MISSING.** No equivalent. |
| `selectionRing` | `0 0 0 4px rgba(255,122,41,0.12)` | **MISSING.** No equivalent. |

### Differing values

| Token | Reference | theme.ts | Severity |
|---|---|---|---|
| (structural) | CSS string shadows | React Native shadow objects | MEDIUM -- different platform conventions. Need both or a transform layer. |

### theme.ts-only tokens (not in reference)

| theme.ts token | Value | Recommendation |
|---|---|---|
| `borderRadius.none` | 0 | **Keep.** Utility value. |
| `borderRadius.sm` | 4 | **Keep.** Useful for small UI elements. |
| `borderRadius.md` | 8 | **Keep.** Intermediate radius. |
| `borderRadius.lg` | 12 | **Rename/alias to `avatarRadius`** to enforce semantic usage. |
| `borderRadius.xl` | 14 | **Rename/alias to `cardRadius`** to enforce semantic usage. |
| `borderRadius['2xl']` | 16 | **Keep.** Upper range of card radius. |
| `borderRadius.full` | 9999 | **Rename/alias to `pillRadius`.** Warn: must not be used for avatars. |
| `shadows.sm` | RN shadow object | **Keep.** Utility shadow. |
| `shadows.md` | RN shadow object | **Keep.** Utility shadow. |
| `shadows.lg` | RN shadow object | **Keep.** Utility shadow. |
| `shadows.accentGlow` | RN shadow object (accent color) | **Rename to `ctaShadow`** and ensure values match reference. |
| `shadows.notificationDot` | RN shadow object | **Keep.** Notification-specific glow. |

---

## 4. Motion

### Missing in `theme.ts`

| Reference token | Reference value | Notes |
|---|---|---|
| `fast` | `0.15s` | **MISSING.** No motion section at all. |
| `base` | `0.18s` | **MISSING.** |
| `slow` | `0.42s` | **MISSING.** |
| `easeBase` | `ease` | **MISSING.** |
| `easeOut` | `ease-out` | **MISSING.** |
| `easeSmooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | **MISSING.** |
| `easeSheet` | `cubic-bezier(0.32, 0.72, 0, 1)` | **MISSING.** |

### Differing values

(Not applicable -- no motion tokens exist in `theme.ts`.)

### theme.ts-only tokens (not in reference)

(None -- the entire motion section is absent.)

**Impact:** Every animation in the codebase is using inline duration/easing values. This makes motion feel inconsistent and makes changes difficult.

---

## 5. Recipes / component-level helpers

### Reference defines these recipes:

| Recipe | Description | Present in theme.ts? |
|---|---|---|
| `surfaceTile` | Card with `surface` bg, `cardRadius`, standard padding | NO |
| `accentTile` | Card with `accentSoft` bg, `accentBorder` | NO |
| `primaryButton` | Accent bg, ink text, `pillRadius`, `ctaShadow` | NO |
| `secondaryButton` | Transparent, `borderStrong`, ink text, `pillRadius` | NO |
| `avatar(size)` | `avatarRadius: 12px`, `borderStrong` edge | NO |
| `monogramTile(size)` | `surfaceAlt` bg, `avatarRadius`, display 800 initials | NO |

**Gap:** No recipe helpers exist in `theme.ts`. Every component that needs a primary button, avatar, or surface tile is rebuilding the pattern inline. This leads to inconsistency and makes updates painful.

---

## 6. Discipline rule risks

### Violations found in `theme.ts`:

| Rule | Violation | Severity |
|---|---|---|
| "No red anywhere" | `colors.error: '#EF4444'` is red. | **CRITICAL.** Any component using `colors.error` violates the brand. |
| "No red anywhere" | `colors.success: '#10B981'` and `colors.warning: '#F59E0B'` are not red, but they introduce colors outside the system. | MEDIUM. May cause visual noise. |
| "Avatars are rounded squares (12px), never circles" | No `avatarRadius` token exists. `borderRadius.full: 9999` exists and may be misused for avatars. | HIGH. Components may default to circle avatars. |

### Structural risks:

1. **No `decline` tokens** -- developers have no way to style "negative" actions correctly without ad-hoc colors or misusing `inkMuted`.
2. **No motion tokens** -- inline values will drift.
3. **Typography scale divergence** -- component-specific names make it hard to know if a style adheres to the system.

---

## 7. Recommended next steps (for the implementation PR, not this one)

1. Add `decline`, `declineSoft`, `declineBorder`, `declineShadow` to `colors` in `theme.ts`.
2. Remove `success`, `warning`, `error` from `colors` or gate them behind a `_deprecated` prefix.
3. Add a `motion` export with `fast`, `base`, `slow` durations and `easeBase`, `easeOut`, `easeSmooth`, `easeSheet` easings.
4. Add semantic geometry tokens: `avatarRadius: 12`, `cardRadius: 14`, `pillRadius: 9999`, `sheetRadius: 22`.
5. Add shadow recipes: `ctaShadow`, `sheetShadow`, `selectionRing` (may need RN-compatible format).
6. Align typography scale names to reference (`displayXL`, `displayL`, `displayM`, `heading`, `bodyL`, `bodyM`) and expose current component-specific styles as aliases or keep as separate layer.
7. Audit codebase for usages of `borderRadius.full` on avatars and replace with `avatarRadius` (12).
8. Audit codebase for usages of `colors.error` and replace with `colors.decline`.
9. Consider adding recipe helpers (`surfaceTile`, `primaryButton`, `avatar`, etc.) as StyleSheet presets or utility functions.
10. Document the "no red" and "avatars are rounded squares" rules in a comment at the top of `theme.ts`.
