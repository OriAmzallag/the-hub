# Profile Screens - Technical Plan
**Author**: Tech Lead Agent  
**Date**: 2026-05-10  
**Status**: APPROVED

---

## Architecture Overview

This PR introduces three screens with a shared component library. The design emphasizes reusability between Business and Influencer profiles while keeping screen-specific components properly namespaced.

---

## Key Technical Decisions

### 1. Influencer Tab Structure Decision

**Recommendation: MINIMAL APPROACH**

Rationale:
- The full tab structure (4 tabs with placeholders) would add 3 extra placeholder files and require modifying the CustomTabBar to be reusable or duplicated
- The current `(influencer)/_layout.tsx` has `tabBarStyle: { display: "none" }` which allows us to add screens without visible tabs
- For this PR, we add only `profile.tsx` and wire it as the index route
- Future PRs can properly scaffold the influencer tab bar when real content exists

Implementation:
- Keep hidden tab bar in `(influencer)/_layout.tsx`
- Add `profile.tsx` as a Tab.Screen (hidden bar, but proper routing)
- Access via direct navigation or dev menu for testing

### 2. Storefront Editor Route

**Route**: `app/influencer/storefront/edit.tsx`

This is a shared route (not inside `(influencer)` group) because:
- Stack-pushed, not a tab
- May be accessed from other contexts in future
- Clean URL: `/influencer/storefront/edit`

### 3. Mock Data Strategy

**Approach**: Extend existing `mockInfluencerStorefront.ts`, add new `mockBusinessProfile.ts`

The existing `MAYA_COHEN` constant already has most fields needed for the profile screen. We'll add a UI-specific extension type for profile-specific computed values.

For business, we create a parallel mock for FitBar TLV.

---

## File-by-File Implementation Plan

### New Theme Token

```
constants/theme.ts
  ADD: radii.avatarHero = 24
```

Justification: The 96x96 hero avatar needs proportionally larger radius than the standard 44x44 avatar (which uses `radii.avatar = 12`). The ratio is roughly size/4, so 96/4 = 24.

---

### Shared Profile Components

```
components/profile/
  index.ts                    -- barrel export
  ProfileTopBar.tsx           -- Simple title bar ("Profile")
  ProfileHero.tsx             -- Dispatcher: renders PhotoAvatar or MonogramAvatar + name + badge
  PhotoAvatar.tsx             -- 96x96 Image with avatarHero radius
  MonogramAvatar.tsx          -- 96x96 surfaceAlt + initials
  MiniStatsRow.tsx            -- 3-column bordered container for MiniStat
  MiniStat.tsx                -- value + label, optional accent star
  Divider.tsx                 -- 1px vertical divider
  ProfileSection.tsx          -- mono caption + grouped surface card
  ProfileRow.tsx              -- icon + label + hint + chevron, pressable
  SignOutButton.tsx           -- decline outline button + LogOut icon
  VersionFooter.tsx           -- "THE HUB . vX.Y" mono text
```

**Component Patterns:**

- `ProfileHero` accepts `variant: 'photo' | 'monogram'` and `imageUri` or `initials`
- `ProfileRow` accepts `isLast: boolean` to control bottom border
- `MiniStatsRow` maps array of `{ value, label, hasAccentStar? }` to `MiniStat` + `Divider`

---

### Business Profile Components

```
components/business/profile/
  index.ts
  BusinessProfileScreen.tsx   -- composes shared components for business
```

This screen is thin - mostly composition of shared primitives.

---

### Influencer Profile Components

```
components/influencer/profile/
  index.ts
  InfluencerProfileScreen.tsx -- composes shared + ViewAsPublicCard
  ViewAsPublicCard.tsx        -- accentSoft CTA card
```

---

### Storefront Editor Components

```
components/influencer/storefront-editor/
  index.ts
  StorefrontEditorScreen.tsx  -- main screen component
  EditorTopBar.tsx            -- back + title + Save pill
  EditorSection.tsx           -- title + description + children
  IdentityPhotoCard.tsx       -- 60x60 photo + label + Change button
  FieldRow.tsx                -- surface card with mono label + value
  FieldDisplayRow.tsx         -- preview row with chevron
  AddRow.tsx                  -- dashed border "+ {label}" button
  CategoryChipsEditor.tsx     -- chip grid with badges + remove
  PlatformRow.tsx             -- single platform row
  ServiceRow.tsx              -- single service row
  PortfolioGrid.tsx           -- 3-col grid + Cover badge
```

---

### Type Definitions

```
types/profile.ts
  BusinessProfile             -- UI shape for business profile screen
  InfluencerProfile           -- UI shape for influencer profile screen (extends storefront)
```

These are UI mock shapes, NOT database entities. They compose the data needed for rendering.

---

### Mock Data

```
constants/mockBusinessProfile.ts
  FITBAR_TLV: BusinessProfile -- FitBar TLV mock data
  getBusinessProfile()        -- getter (returns mock for now)

constants/mockInfluencerStorefront.ts
  (existing MAYA_COHEN)       -- already sufficient, no changes needed
```

---

### Route Files

```
app/(business)/profile.tsx
  REPLACE placeholder with BusinessProfileScreen import

app/(influencer)/_layout.tsx
  MODIFY: add Tabs.Screen for "profile" (keep tabBarStyle hidden)

app/(influencer)/profile.tsx
  NEW: mounts InfluencerProfileScreen

app/influencer/storefront/edit.tsx
  NEW: mounts StorefrontEditorScreen with Stack navigation
```

---

## Component Dependency Graph

```
BusinessProfileScreen
  |-- ProfileTopBar
  |-- ProfileHero (variant="monogram")
  |     |-- MonogramAvatar
  |-- MiniStatsRow
  |     |-- MiniStat (x3)
  |     |-- Divider (x2)
  |-- ProfileSection ("Manage")
  |     |-- ProfileRow
  |-- ProfileSection ("Account")
  |     |-- ProfileRow (x4)
  |-- SignOutButton
  |-- VersionFooter

InfluencerProfileScreen
  |-- ProfileTopBar
  |-- ProfileHero (variant="photo")
  |     |-- PhotoAvatar
  |-- MiniStatsRow
  |-- ViewAsPublicCard        <-- unique to influencer
  |-- ProfileSection ("Manage")
  |     |-- ProfileRow (x2)
  |-- ProfileSection ("Account")
  |     |-- ProfileRow (x4)
  |-- SignOutButton
  |-- VersionFooter

StorefrontEditorScreen
  |-- EditorTopBar
  |-- EditorSection ("Identity")
  |     |-- IdentityPhotoCard
  |     |-- FieldRow (x2)
  |-- EditorSection ("Categories")
  |     |-- CategoryChipsEditor
  |-- EditorSection ("Platforms")
  |     |-- PlatformRow (x N)
  |     |-- AddRow
  |-- EditorSection ("Services")
  |     |-- ServiceRow (x N)
  |     |-- AddRow
  |-- EditorSection ("Portfolio")
  |     |-- PortfolioGrid
  |-- EditorSection ("About your content")
  |     |-- FieldDisplayRow (x4)
  |-- UnpublishButton (inline, uses recipes.declineButton)
```

---

## State Management

### Storefront Editor State

```typescript
interface EditorState {
  displayName: string;
  bio: string;
  categories: string[];
  // ... other fields
  hasChanges: boolean;  // derived from comparing to initial
}
```

Use `useState` with a simple `initialData` snapshot. `hasChanges` is computed by shallow comparison.

For this PR, we don't persist - Save button just resets `hasChanges` to false and logs TODO.

---

## Navigation Implementation

```typescript
// From InfluencerProfile to public storefront
router.push(`/influencer/${influencer.id}`);

// From InfluencerProfile to editor
router.push('/influencer/storefront/edit');

// From Editor back to profile
router.back();
```

---

## Accessibility Requirements

- All `Pressable` rows must have `accessibilityRole="button"` and `accessibilityLabel`
- Back button: `accessibilityLabel="Go back"`
- Sign out button: `accessibilityLabel="Sign out of The Hub"`
- Tab items already handled by existing CustomTabBar

---

## Error Handling

- Missing portfolio images: graceful fallback to monogram
- Missing avatar: show initials
- Empty categories/services/portfolio: show only Add button

---

## Performance Considerations

- Use `expo-image` with `cachePolicy="memory-disk"` for avatars
- Wrap PortfolioGrid in `React.memo` to prevent re-renders
- Keep ScrollView simple (no FlatList needed - content is bounded)

---

## Testing Strategy

- TypeScript: `npx tsc --noEmit` must pass
- Manual: Follow QA checklist
- No automated tests in this PR (future consideration)

---

## Commit Strategy

1. `feat(theme): add radii.avatarHero token`
2. `feat(profile): shared profile primitives`
3. `feat(business-profile): screen + mock + route wiring`
4. `feat(influencer-profile): screen + mock + route wiring`
5. `feat(storefront-editor): editor screen + sub-components + route`
6. `docs(profile-screens): per-agent specs`

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Token additions conflict with future design changes | Designer validates `radii.avatarHero` against system |
| Influencer tab structure incomplete | Minimal approach keeps scope tight |
| Editor state complexity | Simple useState, no persistence this PR |

---

**Tech Lead Status**: PLAN APPROVED
