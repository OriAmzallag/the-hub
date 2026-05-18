# Project Plan: Notifications

**Generated:** 2025-05-18  
**Status:** READY TO SHIP

---

## Product Requirements

Full requirements in [requirements.md](./requirements.md).

**Summary:**
- Bell icon in all 8 tab-level headers (4 tabs x 2 personas)
- Full-screen notifications feed at `/notifications`
- Notifications derived from deal/rating/message events (no new entity)
- In-memory read/unread state (v1)
- Flat chronological feed, newest first
- Tap routes to relevant detail screen
- "Mark all read" header action

---

## Creative Direction

N/A - Standard product feature, no premium UX differentiation needed.

---

## Technical Plan

Full plan in [tech-plan.md](./tech-plan.md).

**Summary:**
- `lib/notifications.ts` - Store mirroring `lib/dealStore.ts` pattern
- `components/ui/NotificationBell.tsx` - 38x38 circular button with badge
- `components/notifications/NotificationRow.tsx` - List item component
- `app/notifications.tsx` - Full-screen feed with FlatList
- Seeding from existing mock data on layout mount

---

## Design Specs

Full spec in [design-spec.md](./design-spec.md).

**Summary:**
- Bell: 38x38, surface bg (default), accentSoft bg (has unread)
- Badge: 16x16, accent fill, 2px bg border, capped at "9+"
- Row: 14px padding, accent styling (unread) / neutral styling (read)
- Avatar: 44x44 with 20x20 icon overlay
- Empty state: 48px bell icon + "You're all caught up"

---

## Implementation Summary

### New Files (6)
| File | Type | LOC |
|------|------|-----|
| `types/notification.ts` | Types | ~55 |
| `lib/notifications.ts` | Store | ~175 |
| `components/ui/NotificationBell.tsx` | Component | ~85 |
| `components/notifications/NotificationRow.tsx` | Component | ~130 |
| `components/notifications/index.ts` | Barrel | ~5 |
| `app/notifications.tsx` | Screen | ~125 |

### Modified Files (10)
| File | Change |
|------|--------|
| `components/ui/index.ts` | Export NotificationBell |
| `components/influencer/discover/DiscoverHeader.tsx` | Bell in rightSlot |
| `components/business/discover/DiscoverHeader.tsx` | Bell between search/filter |
| `components/business/TopBar.tsx` | Bell on right |
| `components/influencer/dashboard/InfluencerTopBar.tsx` | Bell on right |
| `components/inquiries/InquiriesScreen.tsx` | Bell replaces unread caption |
| `components/business/profile/BusinessProfileScreen.tsx` | Bell in rightSlot |
| `components/influencer/profile/InfluencerProfileScreen.tsx` | Bell in rightSlot |
| `app/(business)/_layout.tsx` | Seed notifications |
| `app/(influencer)/_layout.tsx` | Seed notifications |

---

## Code Review

Full review in [code-review.md](./code-review.md).

**Verdict:** APPROVE

- Store pattern matches existing `dealStore`
- All 8 headers correctly integrated
- Design system tokens used throughout
- Accessibility labels complete

---

## QA Report

Full report in [qa-report.md](./qa-report.md).

**Verdict:** PASS

- All 12 test cases pass
- No bugs found
- No regressions (Inquiries unread caption removal is intentional)

---

## Final Status

- **Bugs found:** 0
- **Blockers:** No
- **Ready to ship:** YES

---

## Locked Decision Compliance

| # | Decision | Compliant |
|---|----------|-----------|
| 1 | Tap destination = dedicated notifications screen | YES |
| 2 | Bell placement = right of title, before filter | YES |
| 3 | Data source = derived from existing events | YES |

---

## File Changes Summary

### REUSED Components
- `ScreenHeader` - rightSlot mechanism
- `Avatar` pattern from `ThreadRow`
- Layout from `InfluencerAttentionItem`
- Button chrome from filter buttons
- Store pattern from `dealStore`

### NEW Components
- `NotificationBell` - Bell button with badge
- `NotificationRow` - List item
- Notifications screen

---

## Next Steps

1. Create `feature/notifications` branch
2. Commit all changes
3. Push branch
4. Open PR to `main`
5. User reviews and squash-merges

---

## v2 Follow-ups

- Push notifications (OS-level)
- Real-time WebSocket updates
- Notification preferences/settings
- Swipe-to-dismiss individual notifications
- Grouped notifications (Today/Earlier)
- AsyncStorage persistence
- Sound/haptics on new notifications
