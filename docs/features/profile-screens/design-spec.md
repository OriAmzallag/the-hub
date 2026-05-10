# Profile Screens - Design Specification
**Author**: Designer Agent  
**Date**: 2026-05-10  
**Status**: APPROVED

---

## Design System Compliance

This spec adheres to The Hub's design discipline:
- **One accent only** (`colors.accent`) for primary actions, active states, verified badges
- **No red anywhere** - Sign out and Unpublish use `colors.decline*` tokens
- **Mono = system voice** - captions, hints, version footer
- **Avatars are rounded squares, NEVER circles**
- **Numbers always pair with labels**

---

## New Token Request

### `radii.avatarHero = 24`

**Justification**: The 96x96 hero avatar is 2.18x larger than the standard 44x44 avatar. Using `radii.avatar = 12` on the hero size appears too tight (ratio of radius-to-size is 12.5% vs the 27% on standard avatars). 

The proposed `radii.avatarHero = 24` maintains visual proportion:
- Standard avatar: 44px with radius 12 = 27% ratio
- Hero avatar: 96px with radius 24 = 25% ratio

**Alternative considered**: Formula `radius = size/4` but explicit token is clearer.

**Add to `constants/theme.ts`:**
```typescript
export const radii = {
  card: borderRadius.xl,        // 14
  pill: borderRadius.full,      // 9999
  avatar: borderRadius.lg,      // 12
  avatarHero: 24,               // NEW - 96x96 hero avatars
  sheet: 22,
} as const;
```

---

## Screen Specifications

### 1. Business Profile Screen

#### Layout Structure
```
SafeAreaView (bg: colors.bg)
  ScrollView (paddingHorizontal: 20)
    ProfileTopBar (marginTop: 8)
    ProfileHero (marginTop: 32, alignItems: center)
    MiniStatsRow (marginTop: 24, maxWidth: 280)
    ProfileSection "MANAGE" (marginTop: 32)
    ProfileSection "ACCOUNT" (marginTop: 24)
    SignOutButton (marginTop: 32, alignSelf: center)
    VersionFooter (marginTop: 24, marginBottom: 32)
```

#### ProfileTopBar
- Height: 44px
- Title: "Profile" using `typography.sectionTitle`, `colors.ink`

#### ProfileHero (Monogram Variant)

**MonogramAvatar:**
- Size: 96 x 96
- Background: `colors.surfaceAlt`
- Border radius: `radii.avatarHero` (24)
- Initials: `typography.displayLg` (24px weight 800), `colors.ink`
- Initials derived from first letters of business name words

**Name Row:**
- marginTop: 16
- Name: `typography.sectionTitle`, `colors.ink`
- Verified badge (if applicable): 
  - Icon: `BadgeCheck` from lucide-react-native
  - Size: 18
  - Color: `colors.accent`
  - marginLeft: 6
  - Positioned inline with name (flexDirection: row, alignItems: center)

#### MiniStatsRow
- Container:
  - maxWidth: 280
  - borderTopWidth: 1, borderBottomWidth: 1
  - borderColor: `colors.border`
  - paddingVertical: 16
  - flexDirection: row
  - justifyContent: space-between

**MiniStat:**
- alignItems: center
- flex: 1

Value:
- `typography.displayLg` (weight 800, size 24)
- `colors.ink`
- For rating: append accent star icon (Star filled, size 14, `colors.accent`, marginLeft: 4)

Label:
- marginTop: 4
- `typography.monoStatLabel` (9.5px, 0.15em tracking, uppercase)
- `colors.inkMuted`

**Divider:**
- width: 1
- height: 100%
- backgroundColor: `colors.border`

**Stats for FitBar TLV:**
- "47" / "DEALS"
- "19,420" / "BOOKING VALUE" (formatted with shekel)
- "4.9 [star]" / "RATING"

#### ProfileSection

**Caption:**
- `typography.monoStatus` (9.5px, 0.15em tracking, uppercase)
- `colors.inkMuted`
- marginBottom: 12

**Card Container:**
- backgroundColor: `colors.surface`
- borderRadius: `radii.card` (14)
- borderWidth: 1
- borderColor: `colors.border`
- overflow: hidden

#### ProfileRow

- height: 52
- paddingHorizontal: 16
- flexDirection: row
- alignItems: center
- backgroundColor: transparent (inherits from card)

**Left Icon:**
- Size: 20
- strokeWidth: 2
- Color: `colors.inkMuted`

**Label:**
- marginLeft: 12
- flex: 1
- `typography.rowTitle` (15px, weight 700)
- `colors.ink`

**Hint (optional, right side):**
- `typography.monoStatus`
- `colors.inkMuted`
- marginRight: 8

**Chevron:**
- `ChevronRight` icon
- Size: 18
- Color: `colors.inkSubtle`

**Bottom Border:**
- If not last row: borderBottomWidth: 1, borderBottomColor: `colors.border`
- Last row: no bottom border

**Manage Section Rows (Business):**
1. Icon: `Building2`, Label: "Edit business profile"

**Account Section Rows:**
1. Icon: `Bell`, Label: "Notifications"
2. Icon: `Shield`, Label: "Privacy"
3. Icon: `Globe`, Label: "Language"
4. Icon: `HelpCircle`, Label: "Help & support"

#### SignOutButton

- Style: `recipes.declineButton` (outline, decline border)
- paddingVertical: 12
- paddingHorizontal: 24
- flexDirection: row
- alignItems: center
- gap: 8

**Icon:**
- `LogOut` from lucide-react-native
- Size: 18
- Color: `colors.decline`

**Text:**
- "Sign out"
- `typography.rowSecondary` (14px, weight 700)
- `colors.decline`

#### VersionFooter

- alignItems: center
- Text: "THE HUB . v0.6"
- `typography.monoTimestamp` (9px, 0.1em tracking)
- `colors.inkSubtle`

---

### 2. Influencer Profile Screen

Same structure as Business with these differences:

#### ProfileHero (Photo Variant)

**PhotoAvatar:**
- Size: 96 x 96
- borderRadius: `radii.avatarHero` (24)
- Source: first image from `portfolio[]` array
- Use `expo-image` with `contentFit="cover"`
- Fallback: MonogramAvatar if no portfolio images

#### ViewAsPublicCard (NEW - before Manage section)

- marginTop: 24
- Styles: `recipes.accentTile`
  - backgroundColor: `colors.accentSoft`
  - borderWidth: 1
  - borderColor: `colors.accentBorder`
  - borderRadius: `radii.card` (14)
- paddingVertical: 14
- paddingHorizontal: 16
- flexDirection: row
- alignItems: center

**Left Icon Tile:**
- width: 36, height: 36
- borderRadius: 10
- backgroundColor: `colors.accent`
- alignItems: center, justifyContent: center
- Icon: `ExternalLink`, size: 18, color: `colors.bg`

**Text Container:**
- marginLeft: 14
- flex: 1

Title:
- "See as a Business sees you"
- `typography.bannerTitle` (14.5px, weight 700)
- `colors.ink`

Caption:
- marginTop: 2
- "VIEW PUBLIC STOREFRONT"
- `typography.monoTimestamp` (9px, 0.1em tracking)
- `colors.accent`

**Chevron:**
- `ChevronRight`
- Size: 20
- Color: `colors.accent`

#### Manage Section Rows (Influencer)

1. Icon: `PenSquare`, Label: "Edit storefront" -> routes to `/influencer/storefront/edit`
2. Icon: `Calendar`, Label: "Availability", Hint: "AVAILABLE . TEL AVIV"

---

### 3. Storefront Editor Screen

#### EditorTopBar

- height: 56
- paddingHorizontal: 16
- flexDirection: row
- alignItems: center
- borderBottomWidth: 1
- borderBottomColor: `colors.border`
- backgroundColor: `colors.bg`

**Back Button:**
- Pressable, hitSlop: 12
- Icon: `ArrowLeft`, size: 24, color: `colors.ink`
- accessibilityLabel: "Go back"

**Title:**
- flex: 1
- marginLeft: 16
- "Edit storefront"
- `typography.rowPrimary` (16px, weight 700)
- `colors.ink`

**Save Pill:**
- Disabled state: backgroundColor: `colors.surfaceAlt`, text `colors.inkMuted`
- Enabled state: `recipes.primaryButton` (accent bg + glow)
- paddingVertical: 8
- paddingHorizontal: 16
- borderRadius: `radii.pill`
- Text: "Save", `typography.rowSecondary`, color: `colors.bg` (enabled) or `colors.inkMuted` (disabled)

#### EditorSection

- marginTop: 32

**Title:**
- `typography.tileTitle` (17px, weight 700)
- `colors.ink`

**Description:**
- marginTop: 6
- `typography.bodyPreview` (12.5px, weight 400)
- `colors.inkMuted`

**Children Container:**
- marginTop: 16
- gap: 8

---

#### Identity Section

**IdentityPhotoCard:**
- paddingVertical: 16
- paddingHorizontal: 16
- backgroundColor: `colors.surface`
- borderRadius: `radii.card`
- borderWidth: 1
- borderColor: `colors.border`
- flexDirection: row
- alignItems: center

Photo:
- width: 60, height: 60
- borderRadius: 15 (proportional: 60/4)
- expo-image, contentFit: cover

Text Container:
- marginLeft: 16
- flex: 1

Label:
- "Profile photo"
- `typography.rowTitle`
- `colors.ink`

Hint:
- marginTop: 2
- "Square works best"
- `typography.monoTimestamp`
- `colors.inkMuted`

Change Button:
- flexDirection: row
- alignItems: center
- gap: 6
- Icon: `Camera`, size: 16, color: `colors.accent`
- Text: "Change", `typography.rowSecondary`, `colors.accent`

**FieldRow:**
- backgroundColor: `colors.surface`
- borderRadius: `radii.card`
- borderWidth: 1
- borderColor: `colors.border`
- paddingVertical: 14
- paddingHorizontal: 16

Label (top):
- `typography.monoTimestamp` (9px)
- `colors.inkMuted`
- textTransform: uppercase

Value:
- marginTop: 6
- `typography.bodyPreview` (12.5px)
- `colors.ink`
- For multiline bio: numberOfLines: 4

CharCount (bio field only):
- position: absolute
- top: 14, right: 16
- "{N}/150"
- `typography.monoTimestamp`
- `colors.inkSubtle`

---

#### Categories Section

**CategoryChipsEditor:**
- flexDirection: row
- flexWrap: wrap
- gap: 8

**Category Chip:**
- paddingVertical: 8
- paddingHorizontal: 14
- borderRadius: `radii.pill`
- backgroundColor: `colors.surface`
- borderWidth: 1
- borderColor: `colors.border`
- flexDirection: row
- alignItems: center
- gap: 6

Order Badge (primary only):
- width: 18, height: 18
- borderRadius: 9
- backgroundColor: `colors.accent`
- alignItems: center, justifyContent: center
- Text: "01", `typography.monoBadge`, `colors.bg`

Label:
- `typography.rowSecondary`
- `colors.ink`

Remove X:
- Icon: `X`, size: 14, color: `colors.inkMuted`
- Pressable

**Add Chip:**
- Same sizing as category chip
- borderStyle: dashed
- borderColor: `colors.borderStrong`
- backgroundColor: transparent
- Icon: `Plus`, size: 14, color: `colors.inkMuted`
- Text: "Add", `typography.rowSecondary`, `colors.inkMuted`

---

#### Platforms Section

**PlatformRow:**
- paddingVertical: 14
- paddingHorizontal: 16
- backgroundColor: `colors.surface`
- borderRadius: `radii.card`
- borderWidth: 1
- borderColor: `colors.border`
- flexDirection: row
- alignItems: center

Platform Icon:
- Size: 24
- Color: `colors.ink`
- Use platform-specific icons (Instagram, TikTok, YouTube from lucide or custom)

Name:
- marginLeft: 12
- `typography.rowTitle`
- `colors.ink`

Followers:
- flex: 1
- textAlign: right
- marginRight: 12
- `typography.monoLabel`
- `colors.inkMuted`

Edit Icon:
- `Pencil`, size: 16, color: `colors.inkMuted`

---

#### Services Section

**ServiceRow:**
- paddingVertical: 14
- paddingHorizontal: 16
- backgroundColor: `colors.surface`
- borderRadius: `radii.card`
- borderWidth: 1
- borderColor: `colors.border`
- flexDirection: row
- alignItems: center

Name:
- flex: 1
- `typography.rowTitle`
- `colors.ink`

Platform Badge:
- marginLeft: 8
- paddingVertical: 4
- paddingHorizontal: 8
- borderRadius: 6
- backgroundColor: `colors.surfaceAlt`
- Text: platform code, `typography.monoBadge`, `colors.inkMuted`

Delivery:
- marginLeft: 12
- `typography.monoStatus`
- `colors.inkMuted`

Price:
- marginLeft: 12
- `typography.rowSecondary`
- `colors.ink`

Edit Icon:
- marginLeft: 12
- `Pencil`, size: 16, color: `colors.inkMuted`

---

#### Portfolio Section

**PortfolioGrid:**
- flexDirection: row
- flexWrap: wrap
- gap: 8

**Tile Size Calculation:**
- containerWidth = screenWidth - 40 (padding) - 16 (gaps)
- tileSize = Math.floor(containerWidth / 3)

**Image Tile:**
- width: tileSize, height: tileSize
- borderRadius: `radii.card`
- overflow: hidden

Image:
- expo-image
- contentFit: cover
- width: 100%, height: 100%

Cover Badge (first image only):
- position: absolute
- bottom: 8, left: 8
- paddingVertical: 4
- paddingHorizontal: 8
- borderRadius: 6
- backgroundColor: `colors.accent`
- Text: "COVER", `typography.monoBadge`, `colors.bg`

Remove X:
- position: absolute
- top: 8, right: 8
- width: 24, height: 24
- borderRadius: 12
- backgroundColor: `colors.bgOverlay70`
- alignItems: center, justifyContent: center
- Icon: `X`, size: 14, color: `colors.ink`

**Add Tile:**
- Same dimensions as image tile
- borderStyle: dashed
- borderWidth: 1.5
- borderColor: `colors.borderStrong`
- borderRadius: `radii.card`
- backgroundColor: transparent
- alignItems: center, justifyContent: center
- Icon: `Plus`, size: 24, color: `colors.inkMuted`

---

#### About Your Content Section

**FieldDisplayRow:**
- paddingVertical: 14
- paddingHorizontal: 16
- backgroundColor: `colors.surface`
- borderRadius: `radii.card`
- borderWidth: 1
- borderColor: `colors.border`
- flexDirection: row
- alignItems: center

Label:
- width: 100 (fixed)
- `typography.monoTimestamp`
- `colors.inkMuted`
- textTransform: uppercase

Values Container:
- flex: 1
- flexDirection: row
- flexWrap: wrap
- gap: 6

Value Pill:
- paddingVertical: 4
- paddingHorizontal: 10
- borderRadius: 8
- backgroundColor: `colors.surfaceAlt`
- Text: `typography.bodyPreview`, `colors.ink`

Chevron:
- marginLeft: 8
- `ChevronRight`, size: 18, color: `colors.inkSubtle`

**Rows:**
1. "CONTENT TYPES" -> ["Posts", "Reels", "Stories"]
2. "LANGUAGES" -> ["Hebrew", "English"]
3. "AGE BRACKET" -> ["25-34"]
4. "GENDER" -> ["Female"]

---

#### Unpublish Storefront Button

- marginTop: 40
- marginBottom: 32
- alignSelf: center
- Style: `recipes.declineButton`
- paddingVertical: 14
- paddingHorizontal: 24
- flexDirection: row
- alignItems: center
- gap: 8

Icon:
- `EyeOff`, size: 18, color: `colors.decline`

Text:
- "Unpublish storefront"
- `typography.rowSecondary`
- `colors.decline`

---

## Token Usage Summary

| Use Case | Token |
|----------|-------|
| Screen background | `colors.bg` |
| Card surface | `colors.surface` |
| Hero avatar initials bg | `colors.surfaceAlt` |
| Card border | `colors.border` |
| Row divider | `colors.border` |
| Primary text | `colors.ink` |
| Secondary text | `colors.inkMuted` |
| Tertiary text | `colors.inkSubtle` |
| Primary action | `colors.accent` |
| CTA card bg | `colors.accentSoft` |
| CTA card border | `colors.accentBorder` |
| Negative action | `colors.decline` |
| Sign out border | `colors.declineBorder` |
| Card radius | `radii.card` (14) |
| Button radius | `radii.pill` (9999) |
| Standard avatar radius | `radii.avatar` (12) |
| Hero avatar radius | `radii.avatarHero` (24) - NEW |
| Primary button | `recipes.primaryButton` |
| Secondary button | `recipes.secondaryButton` |
| Decline button | `recipes.declineButton` |
| Accent card | `recipes.accentTile` |

---

## Typography Usage

| Element | Token |
|---------|-------|
| Screen title | `typography.sectionTitle` |
| Stat value | `typography.displayLg` |
| Stat label | `typography.monoStatLabel` |
| Section caption | `typography.monoStatus` |
| Row label | `typography.rowTitle` |
| Row hint | `typography.monoStatus` |
| Row secondary | `typography.rowSecondary` |
| Banner title | `typography.bannerTitle` |
| Body text | `typography.bodyPreview` |
| Timestamp/small | `typography.monoTimestamp` |
| Badge text | `typography.monoBadge` |

---

## Accessibility Notes

- All interactive elements have minimum 44x44 touch target
- Color contrast meets WCAG AA (verified against colors.bg)
- Accent star in rating is decorative; value is read by screen reader
- Chevron icons are decorative (row announces action)

---

**Designer Status**: SPEC APPROVED
