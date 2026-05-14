# Design Spec: Influencer Inquiries

**Feature**: Influencer Inquiries  
**Date**: 2026-05-14  
**Status**: N/A (No UI changes)

## Summary

No design work required. The shared `InquiriesScreen` component handles both personas with identical UI. The only visual difference is the avatar rendering:

- **Business view**: Photo avatars (influencer counterparties)
- **Influencer view**: Monogram avatars (business counterparties)

This is data-driven via the `Counterparty` shape, not role-conditional UI logic.

## Avatar Rendering

The `Avatar` component (`components/inquiries/Avatar.tsx`) dispatches based on counterparty data:

```
if (counterparty.photo) -> Photo avatar
else if (counterparty.monogram) -> Monogram tile
else -> Fallback monogram from name initials
```

For influencer inquiries, counterparties are businesses with `{ name, monogram }` and no `photo`, so the monogram path renders.

## EmptyState Handling

Already implemented in `EmptyState.tsx`:

| Role | Headline | Body | CTA |
|------|----------|------|-----|
| Business | "Find someone to work with." | "Browse Discover to find influencer..." | "Browse Discover" button |
| Influencer | "Your first request is around the corner." | "When a business sends you a request..." | None |

No changes needed.

## Visual Consistency

Both personas see:
- Same header ("Inquiries" with unread count)
- Same search bar
- Same section headers ("Needs your attention", "All inquiries")
- Same thread row layout (avatar, name, caption, timestamp, preview)
- Same pinning logic (requiresAction OR unread > 0)

The design system tokens from `constants/theme.ts` apply uniformly.
