# Feature: Business (Business) Dashboard
## Product Requirements Document

**Author:** PM Agent  
**Date:** 2026-05-09  
**Status:** APPROVED FOR DEVELOPMENT

---

## 1. User Story

**As a** Business (business user / SMB)  
**I want to** see a dashboard with my active deals, quick actions, perks, and stats  
**So that I** can quickly understand my current engagement with influencer and take action on pending items

---

## 2. Acceptance Criteria

### 2.1 Top Bar
- [ ] Display greeting text: "Good morning" / "Good afternoon" / "Good evening" based on time of day
- [ ] Display Business's first name followed by a period (e.g., "FitBar.")
- [ ] Show notification bell icon with orange badge indicator (pulsing animation)
- [ ] Show profile avatar with Business's monogram (first letters of company name)

### 2.2 Attention Banner (Needs Attention Section)
- [ ] Display actionable items requiring immediate attention (e.g., "Rate Daniel Levi")
- [ ] Show influencer photo with star badge overlay for rating CTAs
- [ ] Show title and subtitle for each attention item
- [ ] Tappable row with chevron indicator
- [ ] Accent-colored (orange) border and background tint

### 2.3 Active Deals Section
- [ ] Section header "Active deals" with count badge
- [ ] List of deal rows, each showing:
  - Influencer photo (44x44, rounded corners)
  - Influencer name
  - Status label (e.g., "In progress", "Waiting - 47h left", "Rate now")
  - Service count (e.g., "2 services")
  - Total value in NIS (e.g., "530")
  - Chevron indicator
- [ ] Status labels in orange for actionable states (Waiting, Rate now)
- [ ] Status labels in muted color for non-actionable states (In progress)

### 2.4 Quick Actions Section
- [ ] Section header "Quick actions"
- [ ] 2-column grid with action tiles:
  - "Find influencer" (primary/accent style with search icon) - hint: "Browse"
  - "Post a perk" (secondary style with gift icon) - hint: "Barter"
- [ ] Primary tile has accent background with shadow
- [ ] Secondary tile has surface background with border

### 2.5 Your Perks Section
- [ ] Section header "Your perks" with "See all" link
- [ ] Perk rows showing:
  - Perk title (e.g., "Free dinner for 2")
  - Expiry date (e.g., "Expires May 31")
  - Claim progress (e.g., "3/5 claimed")
  - Progress bar (visual indicator of claims)

### 2.6 Overview (Stats) Section
- [ ] Section header "Overview"
- [ ] 3-column grid of stat tiles:
  - "Active" - count of active deals
  - "Booking value" - total value in NIS with currency symbol
  - "Perks claimed" - count of claimed perks

### 2.7 Tab Bar
- [ ] 4 tabs: Discover, Dashboard, Inquiries, Profile
- [ ] Dashboard tab active by default
- [ ] Inquiries tab shows badge count (1)
- [ ] Semi-transparent background with blur effect
- [ ] Active tab has accent color, inactive tabs have muted color

---

## 3. Data Requirements

### 3.1 Business Object
```typescript
{
  name: string;        // Full company name (e.g., "FitBar TLV")
  firstName: string;   // Display name for greeting (e.g., "FitBar")
  monogram: string;    // 2-letter abbreviation (e.g., "FB")
}
```

### 3.2 Attention Item
```typescript
{
  id: string;
  kind: "rating-due" | "payment-pending" | "review-response";
  title: string;       // e.g., "Rate Daniel Levi"
  subtitle: string;    // e.g., "Story Set delivered May 6"
  cta: string;         // e.g., "Rate now"
  photo: string;       // Influencer photo URL
}
```

### 3.3 Deal
```typescript
{
  id: string;
  influencer: { name: string; photo: string; };
  services: string;    // e.g., "2 services"
  total: number;       // Amount in NIS
  status: "in_progress" | "waiting" | "rate_now" | "completed";
  statusLabel: string; // Human-readable status
  statusAccent: boolean; // Whether to highlight in orange
  timeLabel: string;   // e.g., "Started 4h ago"
}
```

### 3.4 Perk
```typescript
{
  id: string;
  title: string;
  claimed: number;
  max: number;
  expires: string;     // e.g., "May 31"
}
```

### 3.5 Stats
```typescript
{
  activeDeals: number;
  bookingValue: number;  // Total NIS
  perksClaimed: number;
}
```

---

## 4. Empty / Edge States

### 4.1 No Attention Items
- Hide the entire Attention Banner section
- Do NOT show an empty state message

### 4.2 No Active Deals
- Show section header "Active deals" with count "0"
- Show empty state: centered text "No active deals yet"
- Show CTA button: "Find influencer"

### 4.3 No Perks
- Show section header "Your perks"
- Hide "See all" link when empty
- Show empty state: centered text "No perks posted"
- Show CTA button: "Post a perk"

### 4.4 Zero Stats
- Display "0" for count values
- Display "0" (without currency symbol) for booking value

---

## 5. Interaction Behaviors (OUT OF SCOPE for this implementation)

The following interactions are defined for completeness but should NOT be implemented in this phase:

- Tapping notification bell -> Navigate to notifications
- Tapping profile avatar -> Navigate to profile
- Tapping attention banner -> Navigate to rating flow
- Tapping deal row -> Navigate to deal detail
- Tapping "Find influencer" -> Navigate to Discover tab
- Tapping "Post a perk" -> Navigate to perk creation
- Tapping "See all" on perks -> Navigate to perks list
- Tapping tab bar items -> Tab navigation (WILL be implemented as placeholder routes)

---

## 6. Out of Scope

- Real data fetching from Supabase (use mock data only)
- Other tab screens (Discover, Inquiries, Profile) - show placeholder only
- Deep navigation from dashboard items
- Push notification integration
- Profile editing
- Settings

---

## 7. Design Theme Note

**CRITICAL:** The reference file uses the "Metal x Sunset Orange" dark theme, which differs from the current `constants/theme.ts` (light Indigo theme). 

**Decision Required:** The theme tokens must be updated to match the reference before implementation. The Tech Lead and Designer must coordinate on this.

New theme tokens from reference:
- Background: `#1A1815` (dark charcoal)
- Surface: `#2A2620` (dark brown)
- Surface Alt: `#221F1A` (darker brown)
- Ink (text): `#F4F0E8` (warm white)
- Ink Muted: `#8A7E6C` (tan)
- Ink Subtle: `#5C5448` (dark tan)
- Accent: `#FF7A29` (sunset orange)
- Border: `rgba(244,240,232,0.08)` (subtle warm white)

---

## 8. Success Metrics (Future)

Once real data is connected:
- Dashboard load time < 500ms
- All sections render without layout shift
- Tap targets meet 44pt minimum

---

*End of PM Agent Output*
