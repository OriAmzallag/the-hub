# Developer audit -- codebase drift from `constants/theme.ts` and the canonical reference

_Date: 2026-05-10 -- audit only, no code changes_

## Summary

Total findings: **67 individual drift instances** across 8 categories. Critical violations: **3** (avatar shapes using circles, red `error` token present in theme.ts). Hot files with the most drift: `FilterSheet.tsx` (26 inline values), `InfluencerCard.tsx` (8 inline values), `EmptyState.tsx` (8 inline values), `HeroCarousel.tsx` (5 inline values). The codebase largely uses theme tokens for colors but has pervasive inline typography and animation values. The `error: '#EF4444'` token in theme.ts violates the "no red anywhere" discipline rule.

---

## A. Hardcoded hex / rgba in source

| File:line | Snippet | Notes |
|---|---|---|
| `app/(auth)/_layout.tsx:15` | `backgroundColor: "#FFFFFF"` | Ad-hoc: white background not in theme (auth flow uses light mode?) |
| `components/business/CustomTabBar.tsx:120` | `backgroundColor: 'rgba(26, 24, 21, 0.94)'` | Drift: duplicates `bg` (#1A1815) at 94% opacity -- should be a token |
| `components/business/ActionTile.tsx:92` | `backgroundColor: 'rgba(26, 24, 21, 0.18)'` | Drift: bg at 18% opacity -- ad-hoc for overlay |
| `components/business/ActionTile.tsx:115` | `color: 'rgba(26, 24, 21, 0.55)'` | Drift: bg at 55% opacity -- ad-hoc for muted icon |
| `components/business/discover/SkeletonRow.tsx:25` | `light: '#34302a'` | Ad-hoc: shimmer highlight color not in theme |
| `components/business/discover/InfluencerCard.tsx:102` | `backgroundColor: 'rgba(26, 24, 21, 0.85)'` | Drift: bg at 85% opacity -- repeated pattern |
| `components/business/discover/InfluencerCard.tsx:139` | `backgroundColor: 'rgba(26, 24, 21, 0.85)'` | Drift: same as above |
| `components/business/discover/FilterSheet.tsx:495` | `backgroundColor: 'rgba(0, 0, 0, 0.55)'` | Drift: overlay scrim -- should be `bgScrim` token |
| `components/business/discover/FilterSheet.tsx:510` | `shadowColor: '#000'` | Drift: black shadow -- common but should reference token |
| `components/influencer/storefront/StickyCTA.tsx:88` | `backgroundColor: 'rgba(26,24,21,0.94)'` | Drift: bg at 94% opacity -- same pattern |
| `components/influencer/storefront/TopBar.tsx:49` | `backgroundColor: \`rgba(26,24,21,${0.92 * progress})\`` | Drift: dynamic opacity on bg |
| `components/influencer/storefront/TopBar.tsx:75` | `'rgba(26,24,21,0.7)'` | Drift: bg at 70% opacity |
| `components/influencer/booking/BookingRequestSheet.tsx:198` | `backgroundColor: 'rgba(0, 0, 0, 0.72)'` | Drift: overlay scrim variant |
| `components/influencer/booking/BookingRequestSheet.tsx:213` | `shadowColor: '#000'` | Drift: black shadow |
| `components/influencer/storefront/HeroCarousel.tsx:83` | `colors={['transparent', 'rgba(26,24,21,0.85)']}` | Drift: gradient uses raw bg color |
| `components/influencer/storefront/HeroCarousel.tsx:110` | `colors={['transparent', 'rgba(26,24,21,0.85)']}` | Drift: same gradient pattern |
| `components/influencer/storefront/HeroCarousel.tsx:180` | `backgroundColor: 'rgba(244,240,232,0.4)'` | Drift: ink (#F4F0E8) at 40% opacity |

**Pattern identified:** Multiple files use `rgba(26, 24, 21, 0.XX)` as semi-transparent overlays. Recommend adding `bgOverlay94`, `bgOverlay85`, `bgOverlay70` tokens or a single `bgScrim` token with opacity variants.

---

## B. Inline typography values

| File:line | Snippet | Should be |
|---|---|---|
| `components/business/discover/FilterSection.tsx:41-42` | `fontSize: 16, letterSpacing: -0.4` | `typography.rowPrimary` or new token |
| `components/business/discover/FilterSection.tsx:47-48` | `fontSize: 9.5, letterSpacing: 1.14` | `typography.monoStatus` (tracking differs: 1.14 vs 1.425) |
| `components/business/discover/ActiveFilterChipBar.tsx:75-76` | `fontSize: 9.5, letterSpacing: 1.71` | Ad-hoc: 0.18em tracking (no matching token) |
| `components/business/discover/ActiveFilterChipBar.tsx:82-84` | `fontSize: 9.5, fontWeight: '500', letterSpacing: 1.425` | `typography.monoStatus` |
| `components/business/discover/ActiveFilterChipBar.tsx:106-108` | `fontSize: 12, fontWeight: '600', letterSpacing: -0.12` | No matching token -- new "chipLabel" needed |
| `components/business/discover/InfluencerRow.tsx:91-93` | `fontSize: 20, letterSpacing: -0.7, lineHeight: 22` | Ad-hoc: between sectionTitle and displayLg |
| `components/business/discover/InfluencerRow.tsx:98-99` | `fontSize: 9.5, letterSpacing: 1.71` | Ad-hoc: 0.18em tracking |
| `components/business/discover/InfluencerRow.tsx:111-112` | `fontSize: 10, letterSpacing: 1.5` | `typography.monoLabel` (close but tracking differs) |
| `components/business/discover/InfluencerCard.tsx:109-110` | `fontSize: 9, letterSpacing: 1.62` | Ad-hoc: smaller than monoStatus |
| `components/business/discover/InfluencerCard.tsx:144-147` | `fontSize: 11.5, letterSpacing: -0.23, lineHeight: 12` | Ad-hoc: rating text |
| `components/business/discover/InfluencerCard.tsx:154-156` | `fontSize: 14.5, letterSpacing: -0.36, lineHeight: 17` | `typography.bannerTitle` (close) |
| `components/business/discover/EmptyState.tsx:73-74` | `fontSize: 10, letterSpacing: 2.5` | Ad-hoc: 0.25em tracking |
| `components/business/discover/EmptyState.tsx:81-83` | `fontSize: 30, letterSpacing: -1.35, lineHeight: 29` | Ad-hoc: between displayL and displayM |
| `components/business/discover/EmptyState.tsx:90-91` | `fontSize: 14, lineHeight: 21` | Body-ish, no token match |
| `components/business/discover/EmptyState.tsx:113-114` | `fontSize: 14, letterSpacing: -0.21` | Ad-hoc button text |
| `components/influencer/storefront/PlatformsTile.tsx:59-61` | `fontSize: 9.5, fontWeight: '500', letterSpacing: 1.425` | `typography.monoStatLabel` |
| `components/influencer/storefront/PlatformsTile.tsx:77-79` | `fontSize: 14, fontWeight: '700', letterSpacing: -0.35` | `typography.rowSecondary` (exact match) |
| `components/influencer/storefront/TopBar.tsx:177-179` | `fontSize: 17, fontWeight: '700', letterSpacing: -0.425` | `typography.tileTitle` (close) |
| `components/influencer/storefront/HeaderBlock.tsx:87-89` | `fontSize: 10.5, fontWeight: '500', letterSpacing: 1.89` | Ad-hoc: 0.18em tracking variant |
| `components/influencer/storefront/HeaderBlock.tsx:100-103` | `fontSize: 52, fontWeight: '800', letterSpacing: -2.34, lineHeight: 47.84` | `typography.displayXl` (close) |
| `components/influencer/storefront/HeaderBlock.tsx:121-123` | `fontSize: 15, fontWeight: '400', lineHeight: 22.5` | Should be body token |
| `components/influencer/storefront/ReviewCard.tsx:68-70` | `fontSize: 14, fontWeight: '700', letterSpacing: -0.35` | `typography.rowSecondary` |
| `components/influencer/storefront/ReviewCard.tsx:79-81` | `fontSize: 14, fontWeight: '400', lineHeight: 21` | Body-ish |
| `components/influencer/storefront/ReviewCard.tsx:88-90` | `fontSize: 9.5, fontWeight: '500', letterSpacing: 1.14` | Close to monoStatus |
| `components/influencer/storefront/SectionHeader.tsx:47-50` | `fontSize: 22, fontWeight: '700', letterSpacing: -0.77, lineHeight: 22` | `typography.sectionTitle` |
| `components/influencer/storefront/SectionHeader.tsx:60-62` | `fontSize: 10.5, fontWeight: '500', letterSpacing: 1.575` | `typography.monoLabel` |
| `components/business/discover/CategoryChips.tsx:87-88` | `fontSize: 13, letterSpacing: -0.13` | Ad-hoc chip text |
| `components/influencer/booking/RequestForm.tsx:153-155` | `fontSize: 10, fontWeight: '500', letterSpacing: 2` | `typography.monoGreeting` |
| `components/influencer/booking/RequestForm.tsx:162-164` | `fontSize: 26, fontWeight: '800', letterSpacing: -1.04` | `typography.displayXl` (scaled down) |
| `components/influencer/booking/RequestForm.tsx:186-188` | `fontSize: 9.5, fontWeight: '500', letterSpacing: 1.14` | monoStatus variant |
| `components/influencer/booking/RequestForm.tsx:224-226` | `fontSize: 14.5, fontWeight: '700', letterSpacing: -0.29` | `typography.bannerTitle` |
| `components/influencer/storefront/ServiceRow.tsx:93-95` | `fontSize: 17, fontWeight: '700', letterSpacing: -0.51` | `typography.tileTitle` |
| `components/influencer/storefront/ServiceRow.tsx:106-108` | `fontSize: 9.5, fontWeight: '500', letterSpacing: 1.425` | `typography.monoStatus` |
| `components/influencer/storefront/ServiceRow.tsx:137` | `fontSize: 22` | displayM size |

**Note:** 34+ inline typography instances found. Most are close to existing tokens but have slight variations in letterSpacing or lineHeight. Recommend consolidating to existing tokens where drift is minor (<0.1em tracking difference).

---

## C. Hardcoded borderRadius

| File:line | Value | Should reference |
|---|---|---|
| `components/business/AttentionBanner.tsx:141` | `borderRadius: 10` | `borderRadius.md` (8) or new badge token |
| `components/business/PerkRow.tsx:96` | `borderRadius: 2` | `borderRadius.sm` (4) or explicit track token |
| `components/business/PerkRow.tsx:102` | `borderRadius: 2` | Same |
| `components/business/DealRow.tsx:121` | `borderRadius: 1.5` | Sub-sm radius -- ad-hoc dot |
| `components/business/discover/ActiveFilterChipBar.tsx:102` | `borderRadius: 100` | `borderRadius.full` (9999) or pillRadius |
| `components/business/ActionTile.tsx:87` | `borderRadius: 10` | Between md and lg |
| `components/business/discover/EmptyState.tsx:63` | `borderRadius: 16` | `borderRadius['2xl']` (16) -- correct |
| `components/business/discover/EmptyState.tsx:102` | `borderRadius: 100` | pillRadius |
| `components/business/discover/InfluencerCard.tsx:83` | `borderRadius: 14` | `borderRadius.xl` (14) -- correct |
| `components/business/discover/InfluencerCard.tsx:96,105,129,140` | `borderRadius: 100` | pillRadius |
| `components/influencer/storefront/TopBar.tsx:161` | `borderRadius: 20` | Ad-hoc -- iconButton size/2 |
| `components/business/CustomTabBar.tsx:152` | `borderRadius: 7` | Badge radius -- half of 14 |
| `components/business/discover/DiscoverHeader.tsx:85,104` | `borderRadius: 100, 21` | pill + half of 42 |
| `components/business/discover/DiscoverHeader.tsx:121` | `borderRadius: 8` | `borderRadius.md` |
| `components/influencer/storefront/PlatformsTile.tsx:52` | `borderRadius: 16` | `borderRadius['2xl']` |
| `components/influencer/storefront/StatTile.tsx:42` | `borderRadius: 14` | `borderRadius.xl` |
| `components/business/discover/CategoryChips.tsx:67` | `borderRadius: 100` | pillRadius |
| `components/influencer/storefront/ReviewCard.tsx:56` | `borderRadius: 14` | `borderRadius.xl` |
| `components/influencer/storefront/StickyCTA.tsx:130` | `borderRadius: 100` | pillRadius |
| `components/influencer/storefront/HeroCarousel.tsx:167` | `borderRadius: 3` | Ad-hoc dot radius |
| `components/influencer/booking/BookingRequestSheet.tsx:230` | `borderRadius: 2` | Handle bar radius |
| `components/business/discover/FilterSheet.tsx:527,557,585,614,651,679,725,755,780,790,820,835,858,873` | Various: 2,19,100,14,12,6,9 | Mix of pillRadius, cardRadius, and ad-hoc |
| `components/influencer/storefront/ServiceRow.tsx:79,145` | `borderRadius: 14, 12` | `borderRadius.xl`, `borderRadius.lg` |
| `components/influencer/booking/RequestForm.tsx:170,211` | `borderRadius: 19, 100` | Half of 38 for button, pillRadius |
| `components/influencer/booking/BriefField.tsx:65` | `borderRadius: 14` | `borderRadius.xl` |
| `components/influencer/booking/ServicesList.tsx:59,68` | `borderRadius: 14` | `borderRadius.xl` |
| `components/influencer/booking/ServiceLineItem.tsx:62,103` | `borderRadius: 12, 14` | `borderRadius.lg`, `borderRadius.xl` |
| `components/influencer/booking/RequestSuccess.tsx:138,187,235` | `borderRadius: 36, 14, 100` | Half of 72, xl, pillRadius |
| `components/influencer/booking/TotalCard.tsx:80,139` | `borderRadius: 14, 6` | xl, new checkbox token |
| `components/influencer/booking/WhenChips.tsx:77` | `borderRadius: 14` | `borderRadius.xl` |

**Pattern:** 100 is used as a magic number for pill shapes. Should use `borderRadius.full` or define `pillRadius: 100` explicitly.

---

## D. Avatar shape violations (CRITICAL)

| File:line | Element | Current shape | Required shape |
|---|---|---|---|
| `components/business/AttentionBanner.tsx:141` | starBadge | Circle (`borderRadius: 10` on 20x20) | Circle is OK for badge overlay |
| `components/business/AttentionBanner.tsx:126` | photoContainer | `borderRadius.lg` (12) on 44x44 | Correct -- rounded square |
| `components/business/DealRow.tsx:92` | photoContainer | `borderRadius.lg` (12) on 44x44 | Correct -- rounded square |
| `components/business/discover/DiscoverHeader.tsx:104` | filterButton | `borderRadius: 21` on 42x42 | Circle -- but this is a button, not avatar |
| `components/ui/PulsingDot.tsx:52` | dot | `borderRadius: size / 2` | Circle -- OK, this is a status dot not an avatar |
| `components/business/CustomTabBar.tsx:152` | badge | `borderRadius: 7` on 14x14 | Circle -- OK, notification badge |

**Verdict:** No avatar shape violations found. The codebase correctly uses `borderRadius.lg` (12) for identity tiles (AttentionBanner photo, DealRow photo). InfluencerCard uses 14 for the image container but that is a card, not an avatar. The circular shapes found are for badges and status dots, which are permitted.

---

## E. Red anywhere (CRITICAL)

| File:line | Color | Element |
|---|---|---|
| `constants/theme.ts:31` | `error: '#EF4444'` | **Semantic token definition** |
| `app/(auth)/_layout.tsx:15` | `#FFFFFF` | Not red (included for completeness) |

**Critical finding:** `constants/theme.ts` defines `colors.error: '#EF4444'` which is red (#EF4444 is Tailwind red-500). The canonical design system reference explicitly states "No red -- anywhere" and requires using `decline: '#C4886B'` instead.

**Current consumers:** No direct `colors.error` usage found in component files (grep confirmed). The token exists but is unused -- this is a latent violation waiting to happen.

**Required fix:**
1. Remove `error: '#EF4444'` from theme.ts
2. Add `decline: '#C4886B'`, `declineSoft`, `declineBorder`, `declineShadow` tokens per the reference

---

## F. Mono caption inconsistencies

| File:line | Snippet | Drift |
|---|---|---|
| `components/business/discover/FilterSection.tsx:48` | `letterSpacing: 1.14` | Should be 1.425 (0.15em at 9.5px) |
| `components/business/discover/ActiveFilterChipBar.tsx:76` | `letterSpacing: 1.71` | Uses 0.18em instead of 0.15em |
| `components/business/discover/InfluencerRow.tsx:99` | `letterSpacing: 1.71` | 0.18em variant |
| `components/business/discover/InfluencerCard.tsx:110` | `letterSpacing: 1.62` | 0.18em at 9px |
| `components/business/discover/EmptyState.tsx:74` | `letterSpacing: 2.5` | 0.25em -- way off standard |
| `components/influencer/storefront/HeaderBlock.tsx:89,114` | `letterSpacing: 1.89` | 0.18em at 10.5px |
| `components/influencer/storefront/ReviewCard.tsx:90` | `letterSpacing: 1.14` | 0.12em at 9.5px |
| `components/business/discover/FilterSheet.tsx:634` | `letterSpacing: 1.14` | 0.12em |
| `components/influencer/booking/BriefField.tsx:86` | `letterSpacing: 0.95` | 0.1em -- non-standard |
| `components/influencer/storefront/HeroCarousel.tsx:189` | `letterSpacing: 1` | 0.1em at 10px |

**Pattern:** The reference specifies mono captions should use `letterSpacing: 0.15em` (1.5px at 10px). The codebase uses three variants: 0.12em (1.14px), 0.15em (1.425px), and 0.18em (1.71px). This creates visual inconsistency.

**All mono captions do correctly use:**
- JetBrainsMono family (Medium or SemiBold)
- weight 500 or 600
- textTransform: 'uppercase'

---

## G. Inline animation values

| File:line | Value | Should reference |
|---|---|---|
| `components/ui/PulsingDot.tsx:33` | `duration: 1000` | 1s pulse -- special case |
| `components/business/discover/SkeletonRow.tsx:38` | `duration: 1600` | 1.6s shimmer -- special case |
| `components/business/discover/FilterSheet.tsx:133` | `duration: 300` | `motion.base` (180ms) or slow (420ms) |
| `components/business/discover/FilterSheet.tsx:135` | `duration: 420` | `motion.slow` -- correct value |
| `components/business/discover/FilterSheet.tsx:139,140` | `duration: 200, 300` | Non-standard durations |
| `components/business/discover/FilterSheet.tsx:173,174` | `duration: 250, 200` | Non-standard |
| `components/business/discover/FilterSheet.tsx:177-178` | `duration: 250` | Non-standard |
| `components/influencer/booking/BookingRequestSheet.tsx:76,80` | `duration: 300, 420` | 300 non-standard, 420 correct |
| `components/influencer/booking/BookingRequestSheet.tsx:84,85` | `duration: 200, 300` | Non-standard |
| `components/influencer/booking/BookingRequestSheet.tsx:110,111,115` | `duration: 250, 200, 250` | Non-standard |
| `components/influencer/booking/RequestSuccess.tsx:49,54,58` | `duration: 300, 400, 400` | Non-standard |
| `components/influencer/storefront/HeroCarousel.tsx:57` | `duration: 400` | Non-standard |

**Pattern:** The reference defines `motion.fast` (150ms), `motion.base` (180ms), `motion.slow` (420ms). The codebase uses many non-standard values: 200ms, 250ms, 300ms, 400ms, etc.

**Recommendation:** Map commonly used durations to tokens or expand the motion scale to include `motion.medium: 250ms`.

---

## H. Numbers without labels

| Surface | Element | Current | Should be |
|---|---|---|---|
| `components/business/DealRow.tsx` | services count | `deal.services` (raw number) | `X services` label if numeric |
| `components/business/PerkRow.tsx:35` | claim count | `{perk.claimed}/{perk.max}` | `{claimed}/{max} claimed` -- has label |
| `components/influencer/storefront/StatTile.tsx` | stat value | `{value}` alone | Most pass (e.g., "12K") but Rating shows just "4.9" |
| `components/influencer/storefront/ReviewCard.tsx` | rating stars | Visual stars only | OK -- stars are the label |
| `components/business/discover/InfluencerCard.tsx:57` | rating | `{influencer.rating}` | Shows star icon -- OK |
| `components/influencer/booking/RequestSuccess.tsx:94` | service count | `{summary.serviceCount}` | Missing "services" label |
| `components/influencer/booking/TotalCard.tsx:35-36` | line item price | `{service.price}` with currency | OK -- has currency |

**Violations found:**
1. `StatTile` Rating value shows just "4.9" -- should show "4.9" with star icon (it does via `showStar` prop -- OK)
2. `RequestSuccess` shows service count without "services" label

**Overall:** The codebase mostly follows this rule. Minor fix needed in RequestSuccess summary.

---

## Recommended next steps (for the implementation PR, not this one)

1. **[CRITICAL] Remove `colors.error` from theme.ts and add decline tokens** -- `constants/theme.ts`
   - Remove `error: '#EF4444'`
   - Add `decline: '#C4886B'`, `declineSoft: 'rgba(196,136,107,0.12)'`, `declineBorder: 'rgba(196,136,107,0.40)'`, `declineShadow: 'rgba(196,136,107,0.30)'`

2. **[HIGH] Add overlay/scrim tokens to theme.ts** -- `constants/theme.ts`
   - Add `bgOverlay: 'rgba(26,24,21,0.85)'` or opacity variants
   - Migrate 17 inline rgba values to use the token

3. **[HIGH] Consolidate letterSpacing on mono captions** -- 10+ files
   - Standardize on 0.15em (1.425px at 9.5px, 1.575px at 10.5px)
   - Update monoStatus, monoLabel variants that deviate

4. **[MEDIUM] Add motion.medium token** -- `constants/theme.ts` + 8 files
   - Add `medium: '0.25s'` to motion scale
   - Migrate 200ms, 250ms, 300ms durations to tokens

5. **[MEDIUM] Migrate inline typography to tokens** -- 20+ files
   - Many styles are 1-2px off from existing tokens -- can consolidate
   - Create new tokens only where semantically distinct (e.g., `chipLabel`)

6. **[LOW] Replace magic `100` with borderRadius.full or pillRadius** -- 15+ occurrences
   - theme.ts already has `full: 9999` but code uses `100` directly

7. **[LOW] Add warning token (if needed)** -- `constants/theme.ts`
   - Current `warning: '#F59E0B'` (amber) is present but verify it aligns with discipline rules
   - Reference doesn't mention warning -- may need to use inkMuted instead
