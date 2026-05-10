# Technical Plan Addendum: Strict Canonical Captions

**Feature**: dashboard-attention-header
**Addendum**: strict-captions
**Date**: 2026-05-10

## Summary

Enforce the rule that all user-facing status captions come from `getDealCaption()`. This iteration removes ad-hoc strings from `AttentionItem` and updates `AttentionBanner` to use the canonical resolver.

## Type Migration

### AttentionItem (types/business.ts)

**Dropped fields:**
| Field | Reason |
|-------|--------|
| `kind` | Parallel state machine. Now redundant with `state: DealState`. All icon/badge logic branches on `state` instead. |
| `subtitle` | Ad-hoc string. Replaced by `getDealCaption().text`. |
| `cta` | Not consumed anywhere meaningful. The chevron is the affordance. |

**Added fields:**
| Field | Type | Purpose |
|-------|------|---------|
| `state` | `DealState` | Drives caption via resolver |
| `hoursLeft?` | `number` | For PENDING countdown |
| `businessRated?` | `boolean` | For COMPLETED caption resolution |
| `influencerRated?` | `boolean` | For COMPLETED caption resolution |

### AttentionBanner (components/business/AttentionBanner.tsx)

**Changes:**
1. Import `getDealCaption` from `@/lib/dealLifecycle`
2. Inside the map loop, call resolver with item's state and opts
3. Apply `colors[caption.tier]` to subtitle text
4. Replace `item.kind === 'rating-due'` with `item.state === 'COMPLETED' && !item.businessRated`
5. Add Package icon for DELIVERED state

**Icon mapping:**
| State | businessRated | Icon |
|-------|--------------|------|
| COMPLETED | false | Star |
| DELIVERED | n/a | Package |
| Other | n/a | None (no badge) |

### Mock Data (constants/mockBusinessDashboard.ts)

**Before**: Hand-written `attentionItems` array with ad-hoc `subtitle` and `cta`.

**After**: `deriveAttentionItems(deals)` function filters deals where business action is required:
- `COMPLETED` with `businessRated === false`
- `DELIVERED`

This removes duplication and ensures attention items stay in sync with deals fixture.

## Why CTA Was Dropped

The `cta` field ("Rate now", etc.) was never rendered in the UI. The chevron icon is the sole affordance. The title ("Rate Daniel Levi") communicates the action; no separate CTA string is needed.

If a future design requires explicit button text (e.g., full-width action button), we can add it back as a computed value from the resolver, not an ad-hoc string.

## Resolver Verification

All `getDealCaption()` return values are uppercase by design:
- `'WAITING . 47H LEFT'`
- `'IN PROGRESS'`
- `'REVIEW DELIVERY'`
- `'RATE NOW'`
- etc.

No `text-transform: uppercase` is applied in CSS/styles. The data is canonical.

## File Changes

| File | Change |
|------|--------|
| `types/business.ts` | Refactor AttentionItem interface |
| `components/business/AttentionBanner.tsx` | Use getDealCaption, add Package icon |
| `constants/mockBusinessDashboard.ts` | Derive attention items from deals |

## Testing

- `npx tsc --noEmit` must pass
- Visual: attention banner shows "RATE NOW" or "REVIEW DELIVERY" in mono accent
- Audit: grep for forbidden patterns returns zero hits in source
