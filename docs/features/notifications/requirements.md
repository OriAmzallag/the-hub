# Notifications Feature Requirements

**Author:** PM Agent  
**Date:** 2025-05-18  
**Status:** APPROVED

---

## Overview

Add a unified notifications system to The Hub that surfaces deal lifecycle events, rating activity, and new messages in a dedicated full-screen feed. The bell icon appears in all 8 tab-level headers across both personas (Business and Influencer), providing quick access to actionable updates.

---

## Three Locked Decisions (Non-negotiable)

These were locked during kickoff and must not be changed:

1. **Tap destination = dedicated notifications screen.** Bell tap pushes `app/notifications.tsx`. Full-screen feed. NOT a bottom sheet, NOT a dropdown.

2. **Header placement = bell sits right of title, BEFORE the existing right-slot.** On Discover that's `[title/search] ... [bell] [filter]`. On Dashboard / Inquiries / Profile, bell is the only right-side button. Same on both personas. Uses the same 38x38 circular chrome as the filter button, with accent fill + count badge when unread > 0.

3. **Data source = derived from existing deal/rating/inquiry events.** No new entity. Notifications are computed reactively from the same source-of-truth surfaces as Dashboard attention items, thread system messages, and rating state. Reuse the `lib/dealStore` pattern (`useSyncExternalStore` over module-level state).

---

## Surfaces Touched

**8 Tab-level headers only** (detail screens do NOT get the bell):

| Persona | Discover | Dashboard | Inquiries | Profile |
|---------|----------|-----------|-----------|---------|
| Business | Yes | Yes | Yes | Yes |
| Influencer | Yes | Yes | Yes | Yes |

---

## Open Product Decisions (Resolved)

### 1. Read/Unread Persistence
**Decision:** In-memory only for v1.

**Rationale:** Keeps implementation simple, aligns with existing mock-data patterns. Notifications reset on app restart. v2 can add AsyncStorage or backend persistence.

### 2. Grouping
**Decision:** Flat chronological feed, newest first.

**Rationale:** Simpler implementation, easier to scan. Grouping (Today / Earlier) adds complexity without clear user benefit at this scale. Can revisit if feed grows.

### 3. Tap Action on a Notification
**Decision:** Route to the relevant detail screen AND mark as read.

**Rationale:** Users expect tapping to take action. Routes follow existing patterns:
- Deal events (accepted, expired, declined, marked done) -> Thread screen
- Rating events (received, revealed) -> Rating flow or reveal screen
- Perk claimed -> Perk detail (placeholder for v1)
- New message -> Thread screen

### 4. "Mark All Read" Affordance
**Decision:** Top-right header action button only (no swipe gesture).

**Rationale:** Consistent with iOS patterns. Single tap clears badge. Swipe-to-dismiss individual items is v2.

### 5. Empty State
**Decision:** Copy: "You're all caught up" / Visual: Bell icon (muted), centered.

**Rationale:** Friendly, non-alarming. Matches design system empty state patterns.

### 6. Notification Type Taxonomy and Copy

| Event Type | Business Copy | Influencer Copy | Icon |
|------------|---------------|-----------------|------|
| deal_accepted | "{Name} accepted your booking" | "You accepted {Business}'s booking" | Check |
| deal_expired | "Booking with {Name} expired" | "Booking from {Business} expired" | Clock |
| deal_declined | "{Name} declined your booking" | "You declined {Business}'s booking" | X |
| marked_done | "{Name} marked the deal as done" | "You marked the deal with {Business} as done" | CheckCircle |
| rating_received | "{Name} rated your collaboration" | "{Business} rated your collaboration" | Star |
| mutual_reveal | "Mutual ratings revealed with {Name}" | "Mutual ratings revealed with {Business}" | Eye |
| perk_claimed | "{Name} claimed your perk" | "You claimed a perk from {Business}" | Gift |
| new_message | "New message from {Name}" | "New message from {Business}" | MessageCircle |

### 7. Notification Age Cutoff
**Decision:** Keep last 50 notifications OR last 30 days, whichever is smaller.

**Rationale:** Prevents unbounded growth while keeping recent history. Aligns with typical notification retention patterns.

---

## User Stories

### US-1: View Notifications Feed
**As** a Business/Influencer user  
**I want** to tap the bell icon to see all my notifications  
**So that** I can stay updated on deal activity without hunting through different screens

**Acceptance Criteria:**
- Bell icon visible in all 8 tab headers
- Tapping bell navigates to full-screen notifications list
- List shows notifications newest-first
- Each notification shows: icon, title, timestamp, read/unread state

### US-2: Unread Badge
**As** a user  
**I want** to see how many unread notifications I have  
**So that** I know when there's something new

**Acceptance Criteria:**
- Badge appears on bell icon when unread count > 0
- Badge shows count (capped at 9+)
- Badge uses accent color fill
- Badge disappears when all read

### US-3: Navigate from Notification
**As** a user  
**I want** to tap a notification to go to the relevant screen  
**So that** I can take action immediately

**Acceptance Criteria:**
- Tapping marks notification as read
- Routes to appropriate detail screen based on type
- Back navigation returns to notifications list

### US-4: Mark All as Read
**As** a user  
**I want** to clear all notifications at once  
**So that** I can reset my notification state

**Acceptance Criteria:**
- "Mark all read" button in header
- Button only appears when unread > 0
- Tapping clears all unread states
- Badge on bell icon resets to 0

### US-5: Empty State
**As** a user  
**I want** to see a friendly message when I have no notifications  
**So that** I know the feature is working

**Acceptance Criteria:**
- Shows centered bell icon (muted)
- Shows "You're all caught up" text
- No action required

---

## Out of Scope (v2)

1. Push notifications (OS-level)
2. Real-time WebSocket updates
3. Notification preferences/settings
4. Swipe-to-dismiss individual notifications
5. Grouped notifications (Today/Earlier)
6. AsyncStorage persistence
7. Sound/haptics

---

## Success Metrics

- Bell icon rendered in all 8 tab headers
- Notifications derived correctly from deal/rating/message events
- Zero new entities created (reuses existing data sources)
- All tap actions route to correct destinations
- Badge count matches actual unread count

---

## Technical Constraints

1. **Must reuse** `lib/dealStore` pattern for the notifications store
2. **Must reuse** `ScreenHeader` right-slot mechanism for bell placement
3. **Must use** `lucide-react-native` Bell icon
4. **Must use** existing theme tokens (no new colors, fonts, or radii)
5. **Row component** should draw inspiration from `InfluencerAttentionItem` and `ThreadRow`
