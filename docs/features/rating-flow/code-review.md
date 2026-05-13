# Rating Flow - Code Review
Version: 1.0
Date: 2026-05-13
Status: APPROVE (with minor items)

## Files Reviewed

| File | LOC | Verdict |
|------|-----|---------|
| `types/rating.ts` | 75 | PASS |
| `lib/ratingTags.ts` | 52 | PASS |
| `services/ratings.ts` | 358 | PASS |
| `components/rating/StarInput.tsx` | 105 | MINOR |
| `components/rating/TagChips.tsx` | 98 | PASS |
| `components/rating/ReviewInput.tsx` | 68 | PASS |
| `components/rating/NoticeCard.tsx` | 46 | PASS |
| `components/rating/CheckHero.tsx` | 48 | PASS |
| `components/rating/RatingCard.tsx` | 119 | PASS |
| `components/rating/RateScreen.tsx` | 328 | PASS |
| `components/rating/SubmittedWaiting.tsx` | 124 | PASS |
| `components/rating/MutualReveal.tsx` | 205 | PASS |
| `components/rating/index.ts` | 12 | PASS |
| `app/rate/[dealId].tsx` | 173 | MINOR |

## Summary

**Verdict: APPROVE**

The implementation correctly follows the tech plan and design spec. Code quality is high, patterns are consistent with existing codebase, and the feature is well-structured. Two minor issues noted, neither blocking.

## Findings

### MINOR-01: Hook call inside map callback (StarInput.tsx:69)

```typescript
{Array.from({ length: STAR_COUNT }).map((_, index) => {
  // ...
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scales[index].value }],
  }));
  // ...
})}
```

**Issue**: `useAnimatedStyle` is called inside a `.map()` callback. While this works because the array length is constant (5), it violates React's rules of hooks and could cause issues with future React versions or strict mode.

**Recommendation**: Extract each star into a separate component (`StarItem`) that owns its own hook call. Low priority since the code works correctly.

### MINOR-02: Hardcoded mock viewer in route (app/rate/[dealId].tsx:39-48)

```typescript
function getMockViewerContext(): { id: string; role: ViewerRole } {
  return {
    id: 'avi-001',
    role: 'business',
  };
}
```

**Issue**: The viewer context is hardcoded to business role, which means testing the influencer flow requires code changes.

**Recommendation**: Consider reading from a development config or query param for easier QA testing. Document the limitation.

### NIT-01: Duplicate STAR_LABELS constant

`STAR_LABELS` is defined in both `types/rating.ts` and `RateScreen.tsx`. Consider exporting from one location.

### NIT-02: Unused `StarRating` import in services/ratings.ts

The `StarRating` type is imported but never used directly in the service file.

## Spec Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| Six locked decisions | PASS | All enforced in types and UI |
| Two tag taxonomies | PASS | Correctly implemented in `lib/ratingTags.ts` |
| Three screens | PASS | All implemented per spec |
| Design system tokens | PASS | Only existing tokens used |
| Animation specs | PASS | Star-pop and check-pop match spec |
| Mutual reveal logic | PASS | Correct state machine |
| wouldWorkAgain extraction | PASS | Stored separately per spec |
| Entry point gating | PASS | Route checks existing ratings |

## Security Review

- No sensitive data exposed
- Input validation present (max 200 chars on review)
- No XSS vectors (React Native)
- Service interface properly abstracts storage

## Performance Notes

- Animations use native driver via Reanimated
- Lazy loading of deal context on mount
- No unnecessary re-renders detected
- Memory usage reasonable (in-memory mock is dev-only)

## Final Verdict

**APPROVE** - Ready for QA. The two minor items are non-blocking and can be addressed in a follow-up PR if desired.
