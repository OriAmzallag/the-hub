# Inquiries Inbox Screen - Code Review
Generated: 2026-05-10
Role: Code Reviewer

## Review Summary

**Verdict: APPROVED with minor suggestions**

The implementation follows the tech plan and design spec accurately. Key discipline rules are honored.

---

## Checklist

### Design System Compliance

| Check | Status | Notes |
|-------|--------|-------|
| No inline hex colors | PASS | All colors reference `colors.*` tokens |
| No inline radius values | PASS | Uses `radii.avatar`, `radii.card`, `radii.pill`, `borderRadius.lg` |
| No inline font sizes without token | PASS | Uses `typography.*` tokens for most text |
| Avatars are 12px rounded squares | PASS | `radii.avatar` = 12, never borderRadius.full |
| Status captions from getDealCaption | PASS | ThreadRow uses `getDealCaption()` for all status text |
| Accent color only for primary actions/states | PASS | Used for unread badge, action-required status, CTA button |
| No red anywhere | PASS | No decline scenarios in this screen |
| Mono uppercase for system voice | PASS | Status captions, timestamps, badges use mono fonts |

### New Tokens Added

| Token | Justified |
|-------|-----------|
| `typography.monoStatusWide` | Yes - 0.18em tracking per reference, distinct from 0.15em monoStatus |
| `typography.monoTimestamp` | Yes - 9px / 0.1em tracking per reference, distinct from other mono |
| `typography.bodyPreview` | Yes - 12.5px preview text not covered by existing body tokens |
| `typography.bodyPreviewUnread` | Yes - SemiBold variant of above |

### Accessibility

| Check | Status | Notes |
|-------|--------|-------|
| Search input label | PASS | `accessibilityLabel="Search threads by name"` |
| Thread row label | PASS | Includes name, status, message, unread state |
| Unread badge announced | PASS | `accessibilityLabel={${thread.unread} unread}` |
| Pressable roles | PASS | `accessibilityRole="button"` on ThreadRow, CTA |

### Code Quality

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript strict | PASS | All components fully typed |
| Memoization | PASS | ThreadRow wrapped in memo |
| Barrel exports | PASS | index.ts exports all components |
| No hardcoded strings | PASS | Status captions from lifecycle lib |
| Safe area handling | PASS | Uses useSafeAreaInsets |

---

## Minor Suggestions (Non-blocking)

### 1. ThreadRow status font override

In `ThreadRow.tsx` lines 62-70, the status text uses inline fontFamily/fontWeight overrides:

```typescript
{
  color: statusColor,
  fontWeight: isAccentTier ? '600' : '500',
  fontFamily: isAccentTier
    ? 'JetBrainsMono-SemiBold'
    : 'JetBrainsMono-Medium',
}
```

**Suggestion:** Consider creating a `monoStatusMuted` token for the non-accent case to match `monoStatusWide`, avoiding inline font family logic. Low priority since the values are correct.

### 2. EmptyState CTA button shadow

In `EmptyState.tsx`, the CTA button uses `recipes.primaryButton` but then re-declares shadow props in `ctaButtonShadow`:

```typescript
ctaButton: {
  ...recipes.primaryButton,
  paddingVertical: 12,
  paddingHorizontal: 24,
},
ctaButtonShadow: {
  shadowColor: colors.accent,
  shadowOffset: { width: 0, height: 8 },
  // ...
},
```

The `recipes.primaryButton` already includes the shadow. The iOS-specific shadow override is redundant unless intended to differ. Verify intent.

### 3. Tab bar badge sync

The `CustomTabBar` has a hardcoded `badge: 1` for inquiries. The PR acknowledges this as a known limitation. When real data lands, this should read from shared state or context.

---

## Files Reviewed

| File | Lines | Verdict |
|------|-------|---------|
| `lib/dealLifecycle.ts` | 225 | PASS - clean requiresAction addition |
| `types/inquiry.ts` | 48 | PASS - well-typed interfaces |
| `constants/theme.ts` | 420 | PASS - 4 new tokens added correctly |
| `constants/mockBusinessInquiries.ts` | 70 | PASS - state-driven, no caption strings |
| `components/business/inquiries/TopBar.tsx` | 35 | PASS |
| `components/business/inquiries/SearchBar.tsx` | 50 | PASS |
| `components/business/inquiries/SectionHeader.tsx` | 25 | PASS |
| `components/business/inquiries/Avatar.tsx` | 70 | PASS |
| `components/business/inquiries/ThreadRow.tsx` | 140 | PASS |
| `components/business/inquiries/EmptyState.tsx` | 95 | PASS |
| `components/business/inquiries/NoResultsState.tsx` | 45 | PASS |
| `components/business/inquiries/InquiriesScreen.tsx` | 130 | PASS |
| `components/business/inquiries/index.ts` | 10 | PASS |
| `app/(business)/inquiries.tsx` | 25 | PASS |

---

## Conclusion

Implementation is solid. No blockers. The minor suggestions are cosmetic improvements that can be addressed in a follow-up PR if desired.

**Approved for QA.**
