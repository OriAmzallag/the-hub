# Profile Screens - Product Requirements
**Author**: PM Agent  
**Date**: 2026-05-10  
**Status**: APPROVED

---

## Overview

This PR delivers the **Profile screens trifecta** for The Hub application:
1. **BusinessProfileScreen** - Profile tab for business (SMB/brand) users
2. **InfluencerProfileScreen** - Profile tab for influencer users  
3. **StorefrontEditorScreen** - Editor for influencers to manage their public storefront

These screens establish the self-service profile management foundation for both user types.

---

## User Stories

### 1. Business Profile Screen

**As a business owner**, I want to view my profile summary and access account settings so that I can manage my business presence and app preferences.

#### Acceptance Criteria
- [ ] Identity hero displays monogram avatar (96x96 rounded square) with business initials
- [ ] Business name displayed with verified badge (accent color) if applicable
- [ ] 3-up mini stats row shows: Deals count, Booking value (formatted with shekel), Rating (with accent star)
- [ ] "Manage" section contains 1 row: "Edit business profile" (TODO action)
- [ ] "Account" section contains 4 rows: Notifications, Privacy, Language, Help & support (all TODO actions)
- [ ] Sign out button uses decline tone (NOT red) with LogOut icon
- [ ] Version footer displays "THE HUB . vX.Y" in mono inkSubtle

### 2. Influencer Profile Screen

**As an influencer**, I want to view my profile, see how businesses perceive me, and access my storefront editor so that I can optimize my public presence and manage settings.

#### Acceptance Criteria
- [ ] Identity hero displays photo avatar (96x96 rounded square) using first portfolio image
- [ ] Name displayed with verified badge (accent color) if applicable
- [ ] 3-up mini stats row shows: Deals count, Booking value, Rating (with accent star)
- [ ] "See as a Business sees you" CTA card appears BEFORE Manage section
  - Uses accentSoft surface with accentBorder
  - 36x36 accent tile with ExternalLink icon
  - Tapping routes to `/influencer/{id}` (public storefront)
- [ ] "Manage" section contains 2 rows:
  - "Edit storefront" - routes to StorefrontEditor
  - "Availability" - shows mono hint "AVAILABLE . TEL AVIV" (or current state)
- [ ] "Account" section contains 4 rows (same as Business)
- [ ] Sign out button uses decline tone with LogOut icon
- [ ] Version footer displays "THE HUB . vX.Y" in mono inkSubtle

### 3. Storefront Editor Screen

**As an influencer**, I want to edit my storefront content so that I can keep my public profile current and attractive to businesses.

#### Acceptance Criteria
- [ ] Stack-pushed screen (not a tab) with back button navigation
- [ ] Top bar: back arrow + "Edit storefront" title + Save pill
- [ ] Save pill disabled by default, enabled when `hasChanges` is true
- [ ] Save pill uses `recipes.primaryButton` styling when active

**Editor Sections (in order):**

1. **Identity Section**
   - [ ] Photo edit card (60x60) with "Change" button (TODO action)
   - [ ] Display name FieldRow (editable)
   - [ ] Bio FieldRow with multiline + "{N}/150" character count

2. **Categories Section**
   - [ ] Chip grid displaying current categories
   - [ ] Maximum 3 categories allowed
   - [ ] Primary category tagged with "01" badge (mono accent)
   - [ ] Each chip has remove X button
   - [ ] "+ Add" dashed chip at end (TODO action)

3. **Platforms Section**
   - [ ] List of platform rows: Icon, Name, Followers, Edit pen
   - [ ] "Add platform" dashed row at bottom (TODO action)

4. **Services Section**
   - [ ] List of service rows: Name, Platform badge, Delivery, Price (shekel)
   - [ ] "Add service" dashed row at bottom (TODO action)

5. **Portfolio Section**
   - [ ] 3-column square grid of images
   - [ ] First image shows "COVER" accent badge
   - [ ] Each tile has remove X in top-right
   - [ ] Add tile (dashed) at end (TODO action)

6. **About Your Content Section**
   - [ ] FieldDisplayRow for: Content types, Content languages, Age bracket, Gender
   - [ ] Each row opens deeper editor on tap (TODO - logs console message)

7. **Unpublish Storefront**
   - [ ] Outline button at bottom
   - [ ] Uses `colors.decline*` tokens (NOT red)
   - [ ] TODO action on tap

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Long business/influencer name | Ellipsis truncation with `numberOfLines={1}` |
| Missing avatar (no portfolio images) | Show monogram fallback using initials |
| 0 categories | Empty state with just "+ Add" chip |
| 0 services | Empty state with just "Add service" row |
| 0 portfolio images | Empty state with just Add tile |
| Bio at 150 characters | Counter shows "150/150", input stops accepting |
| "View as public" tap | Routes to `/influencer/[id]` with influencer's ID |
| Save pill disabled | Not tappable, uses muted styling |
| Deep-link to editor | `/influencer/storefront/edit` works directly |

---

## Out of Scope (This PR)

The following are explicitly **TODO** implementations:

1. **Sub-editors for "About your content"**
   - Content types editor
   - Content languages editor  
   - Age bracket selector
   - Gender selector
   - All should log "TODO: Open {field} editor" on tap

2. **Actual save action**
   - Save button toggles `hasChanges` state for demo
   - No persistence to backend

3. **Sign-out flow**
   - Button visible but logs "TODO: Sign out" on tap

4. **Influencer Discover/Dashboard/Inquiries content**
   - Placeholder screens only if full tab structure is implemented
   - Tech Lead decides minimal vs full tab approach

5. **Real photo upload**
   - Camera/Change button logs "TODO: Upload photo" on tap

6. **Edit actions in Storefront Editor**
   - Edit business profile row
   - Edit/remove categories
   - Edit/add platforms
   - Edit/add services
   - Remove/reorder portfolio images

---

## Navigation Flow

```
Business Profile Tab
  |-- Tap "Edit business profile" -> TODO
  |-- Tap Account rows -> TODO
  |-- Tap Sign out -> TODO

Influencer Profile Tab
  |-- Tap "See as a Business sees you" -> /influencer/{id}
  |-- Tap "Edit storefront" -> /influencer/storefront/edit
  |-- Tap "Availability" -> TODO
  |-- Tap Account rows -> TODO
  |-- Tap Sign out -> TODO

Storefront Editor (stack pushed)
  |-- Back button -> pop to Influencer Profile
  |-- Save (when enabled) -> TODO (toggles hasChanges demo)
  |-- Section field taps -> TODO
```

---

## Success Metrics (Post-Launch)

- Profile tab loads in <100ms from cold start
- Editor screen navigation feels instant (<50ms perceived)
- All interactive elements have proper touch feedback

---

## Dependencies

- Existing `mockInfluencerStorefront.ts` data (Maya Cohen)
- New `mockBusinessProfile.ts` data (FitBar TLV)
- Existing theme tokens from `constants/theme.ts`
- Existing `CustomTabBar` component pattern

---

## Sign-off

- [x] User stories cover all three screens
- [x] Acceptance criteria are testable
- [x] Edge cases documented
- [x] Out-of-scope items explicitly listed
- [x] Navigation flow mapped

**PM Status**: REQUIREMENTS COMPLETE
