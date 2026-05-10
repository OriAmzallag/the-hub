// =================================================================
// REFERENCE FILE — Profile screens (Business + Influencer + Storefront Editor)
// =================================================================
// Source: Tom-provided reference, 2026-05-10
//
// PURPOSE: Visual reference ONLY. Do NOT port 1:1.
// React Native + NativeWind + Reanimated + StyleSheet only.
// Use existing tokens from constants/theme.ts. Honor the design-system
// discipline rules (no red anywhere — `colors.decline*` for Sign out and
// Unpublish; avatars are rounded squares; mono = system voice; numbers
// always paired with a label).
//
// THREE SCREENS in this PR:
//
// 1. BusinessProfileScreen  — mounts at app/(business)/profile.tsx
//    Identity hero (monogram avatar) + 3-up mini stats + Manage section
//    (1 row: "Edit business profile") + Account section (4 rows) +
//    Sign out (decline outline) + version footer.
//
// 2. InfluencerProfileScreen  — mounts at app/(influencer)/profile.tsx
//    Same shell as Business but with:
//      - Photo avatar (first portfolio image) instead of monogram
//      - "See as a Business sees you" CTA card BEFORE Manage section
//        (accentSoft surface, primary action — opens public storefront
//        at /influencer/[id])
//      - Manage section adds 2nd row: "Availability · {status} · {city}"
//    The "Edit storefront" row routes to the StorefrontEditor below.
//
// 3. StorefrontEditorScreen  — mounts at app/influencer/storefront/edit.tsx
//    Stack-pushed from InfluencerProfileScreen → "Edit storefront" tap.
//    Top bar: back arrow + "Edit storefront" title + Save pill (disabled
//    until hasChanges, matches the canonical primary-button recipe when
//    enabled).
//    Editor sections (in order):
//      - Identity        — photo edit row, display name (FieldRow),
//                           bio (FieldRow with multiline + char count
//                           "{N}/150")
//      - Categories      — pill chips, max 3, first one tagged "01" in
//                           accent (the primary). Add chip is dashed.
//      - Platforms       — list of {Icon · Name · Followers · Edit pen}
//                           rows + "Add platform" dashed row
//      - Services        — list of {Name · Platform · Delivery · ₪Price ·
//                           Edit pen} rows + "Add service" dashed row
//      - Portfolio       — 3-column square grid. First image gets a "COVER"
//                           accent caption tag. Each tile has a remove X
//                           in the top-right. + Add tile (dashed) at end.
//      - About your content  — non-editable display rows (FieldDisplayRow)
//                              for Content types / Languages / Age bracket
//                              / Gender. Each opens a deeper editor (out
//                              of scope this PR — log a TODO on tap).
//      - Bottom: "Unpublish storefront" outline button in decline tone
//        (NOT red).
//
// SHARED COMPONENTS (build once, reuse on both Profile screens):
//   - ProfileTopBar      — title only ("Profile")
//   - ProfileHero        — Avatar (photo OR monogram dispatcher) + name +
//                           verified accent badge. 96×96 avatar, radius
//                           24 (NOT a circle — rounded square scaled up
//                           for the hero size).
//   - MiniStatsRow       — 3 MiniStat tiles separated by 1px Dividers,
//                           inside a top+bottom border box, max-width 280.
//   - MiniStat           — value (display 18 weight 800, optional accent
//                           star) + mono uppercase label (8.5px 0.15em).
//   - ProfileSection     — mono caption (9.5px 0.2em) + grouped surface
//                           card with rows.
//   - ProfileRow         — icon + label + optional mono hint right +
//                           chevron. Bottom border between rows
//                           (last has none — TL's call on how to do this).
//   - SignOutButton      — outline pill, decline color text + LogOut icon.
//   - VersionFooter      — "THE HUB · vX.Y" mono inkSubtle.
//
// EDITOR-SPECIFIC COMPONENTS:
//   - EditorTopBar       — back + title + Save pill
//   - EditorSection      — display 18 title + body 12.5 inkMuted description +
//                           gap-8 children
//   - FieldRow           — surface card with mono label on top + body value
//                           below. Optional charCount in top-right.
//   - FieldDisplayRow    — surface card, label + flex-wrap multi-value
//                           preview, chevron at right (tap → deeper editor)
//   - AddRow             — dashed-border button "+ {label}"
//   - IdentityPhotoCard  — 60×60 photo + label/hint + Camera "Change" button
//   - CategoryChipsEditor — pill chips with order badges + remove X + Add
//   - PortfolioGrid      — 3-col square grid + Cover badge + remove X + Add tile
//
// NEW TOKEN REQUEST candidate:
//   - The 96×96 hero avatar uses radius 24. Existing `radii.avatar` = 12 is
//     for standard 44×44 tiles; using it on 96×96 looks too tight. The
//     Designer should propose `radii.avatarHero = 24` (additive expansion)
//     or document the rule as "avatar radius = max(12, size/4)".
//
// Encoding artifacts in source (already corrected in this file):
//   `âª` → `₪`, `Ã` → `×`, `→` → `→`.
//
// =================================================================

// (full reference body as provided by Tom — see the chat history; the
//  pixel values in each section's comments are verbatim from the original.)
