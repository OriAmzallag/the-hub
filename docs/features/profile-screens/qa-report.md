# Profile Screens - QA Report
**Author**: QA Agent  
**Date**: 2026-05-10  
**Status**: READY FOR SIM VERIFICATION

---

## Test Environment

- Branch: `feature/profile-screens`
- TypeScript: Pending `npx tsc --noEmit` verification
- Manual testing: Requires simulator

---

## Test Cases

### TC-001: Business Profile Tab Navigation
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to business dashboard | Dashboard loads |
| 2 | Tap Profile tab | Profile screen displays |
| 3 | Verify monogram avatar | 96x96 rounded square with "FB" initials |
| 4 | Verify business name | "FitBar TLV" with orange verified badge |
| 5 | Verify stats row | 3 stats with borders: 47/Deals, 19,420/Booking value, 4.9[star]/Rating |

---

### TC-002: Business Profile Sections
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify "MANAGE" section | Contains 1 row: "Edit business profile" |
| 2 | Verify "ACCOUNT" section | Contains 3 rows: Privacy, Language, Help & support |
| 3 | Tap any row | Console logs TODO message |
| 4 | Verify Sign out button | Warm decline color (NOT red), LogOut icon |
| 5 | Tap Sign out | Console logs "TODO: Sign out" |
| 6 | Verify version footer | "THE HUB . v0.6" in subtle text |

---

### TC-003: Influencer Profile Tab Navigation
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to influencer dashboard | (Tab bar hidden - access via deep link or dev menu) |
| 2 | Access profile screen | Profile screen displays |
| 3 | Verify photo avatar | 96x96 rounded square with Maya's first portfolio image |
| 4 | Verify influencer name | "Maya Cohen" with orange verified badge |
| 5 | Verify stats row | 3 stats: 38/Deals, 12,850/Booking value, 4.9[star]/Rating |

---

### TC-004: Influencer "See as Business" Card
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify CTA card position | Appears between stats and MANAGE section |
| 2 | Verify card styling | Orange-tinted background, orange border |
| 3 | Verify card content | ExternalLink icon tile, title, "VIEW PUBLIC STOREFRONT" caption |
| 4 | Tap card | Routes to `/influencer/maya-cohen-1` (Maya's storefront) |
| 5 | Verify storefront loads | Public storefront screen displays |

---

### TC-005: Influencer Manage Section
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify "MANAGE" section | Contains 2 rows |
| 2 | Verify first row | "Edit storefront" with pen icon |
| 3 | Verify second row | "Availability" with hint "AVAILABLE . TEL AVIV" |
| 4 | Tap "Edit storefront" | Routes to `/influencer/storefront/edit` |

---

### TC-006: Storefront Editor Top Bar
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify top bar | Back arrow, "Edit storefront" title, Save pill |
| 2 | Verify Save initial state | Disabled, muted styling |
| 3 | Tap back arrow | Returns to Influencer Profile |

---

### TC-007: Storefront Editor Save State
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open editor | Save pill disabled |
| 2 | Remove a category | Save pill becomes enabled (orange) |
| 3 | Re-add the category | (Not possible in MVP, skip) |
| 4 | Remove a portfolio image | Save pill enabled |
| 5 | Tap Save | Console logs TODO, hasChanges resets |

---

### TC-008: Storefront Editor Sections
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify Identity section | Photo card (60x60), Display name, Bio with char count |
| 2 | Verify Categories section | Chip grid with 3 categories, "01" badge on first |
| 3 | Verify Platforms section | 3 platform rows + Add row |
| 4 | Verify Services section | 4 service rows + Add row |
| 5 | Verify Portfolio section | 5 images in 3-col grid, "COVER" badge on first |
| 6 | Verify About section | 4 display rows: Content types, Languages, Age, Gender |
| 7 | Verify Unpublish button | Warm decline color (NOT red), EyeOff icon |

---

### TC-009: Portfolio Grid Cover Badge
**Priority**: MEDIUM  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open editor | Portfolio grid displays |
| 2 | Verify first image | Has "COVER" badge in orange |
| 3 | Remove first image | Second image now has "COVER" badge |

---

### TC-010: Category Removal
**Priority**: MEDIUM  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open editor | Categories section shows 3 chips |
| 2 | Tap X on a category | Category removed, hasChanges = true |
| 3 | Verify Add chip appears | "+ Add" appears when < 3 categories |

---

### TC-011: Decline Color Verification
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Business Profile: Sign out | Warm muted color (#C4886B), NOT red |
| 2 | Influencer Profile: Sign out | Same warm color |
| 3 | Editor: Unpublish button | Same warm color |

---

### TC-012: Avatar Shape Verification
**Priority**: HIGH  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Business Profile avatar | Rounded square (radius 24), NOT circle |
| 2 | Influencer Profile avatar | Rounded square (radius 24), NOT circle |
| 3 | Editor photo card | Rounded square (radius 15), NOT circle |

---

### TC-013: Deep Link to Editor
**Priority**: MEDIUM  
**Status**: READY FOR MANUAL TEST

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate directly to `/influencer/storefront/edit` | Editor screen loads |
| 2 | Tap back | Navigates back (may need fallback handling) |

---

## Bug Summary

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| - | - | No bugs found in code review | - |

---

## Blockers

None identified. All critical functionality is implemented per spec.

---

## Notes for Manual Testing

1. **Accessing Influencer Profile**: The influencer tab bar is hidden. Access via:
   - Deep link: `exp://localhost:8081/(influencer)/profile`
   - Or temporarily modify `_layout.tsx` to show tab bar

2. **Testing hasChanges**: Remove a category or portfolio image to trigger the enabled state.

3. **Console logs**: Open React Native debugger to verify TODO logs on button taps.

---

## Sign-off Checklist

- [ ] Business Profile: monogram avatar, stats, 5 rows, sign out
- [ ] Influencer Profile: photo avatar, stats, "See as Business" card, 6 rows
- [ ] "View public storefront" routes correctly
- [ ] "Edit storefront" routes correctly  
- [ ] Editor: Save pill state toggles with changes
- [ ] Editor: 6 sections present
- [ ] Editor: Portfolio first tile has "COVER" badge
- [ ] Editor: Unpublish uses decline color (NOT red)
- [ ] All avatars are rounded squares (NOT circles)

---

## TypeScript Verification

**Command**: `npx tsc --noEmit`  
**Status**: PENDING - To be run by Developer

---

**QA Status**: READY FOR SIM VERIFICATION
