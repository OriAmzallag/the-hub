# Design Spec: Onboarding Auth Update

Generated: 2026-05-12

All specs derived from `references/onboarding-auth.reference.jsx`. Token mappings to `constants/theme.ts`.

## Splash Screen

### Layout
- Flex container, centered
- Padding: 60px top, 28px horizontal, 30px bottom
- Background: `colors.bg` (#1A1815)

### Logo Tile
- Size: 64x64
- Border radius: 18
- Background: `colors.accent` (#FF7A29)
- Shadow: 0 12px 32px `colors.accentShadow`
- Glyph: "H", Inter Tight, 32px, weight 900, color `colors.bg`, letterSpacing -0.06em
- Margin bottom: 28

### Spinner Row
- Flex row, gap 10
- Margin bottom: 60

### Spinner
- Size: 12x12
- Border: 2px solid `colors.surface`
- Border top: `colors.accent`
- Border radius: 50%
- Animation: spin 0.8s linear infinite

### Caption
- Font: JetBrains Mono, 10px, weight 500
- Color: `colors.inkMuted`
- Letter spacing: 0.2em
- Text transform: uppercase
- Text: "SIGNING YOU IN"

## WelcomeBack Screen

### Layout
- Flex column
- Padding: 60px top, 28px horizontal, 30px bottom
- Background: `colors.bg`

### Hero Photo
- Container: allows for check overlay overflow
- Photo: 110x110, borderRadius 28
- Border: 1px `colors.borderStrong`
- Margin bottom: 32

### Check Overlay
- Position: absolute, bottom -6, right -6 from photo edge
- Size: 38x38
- Border radius: 50% (circle - this is a badge)
- Background: `colors.accent`
- Border: 3px solid `colors.bg`
- Shadow: 0 6px 16px `colors.accentShadow`
- Check icon: 18px, strokeWidth 3, color `colors.bg`

### Check-Pop Animation
- Spring: scale 0 -> 1
- Damping: 12, stiffness: 180
- Delay: 200ms
- Matches existing Done step pattern

### Eyebrow
- Font: JetBrains Mono, 11px, weight 600
- Color: `colors.accent`
- Letter spacing: 0.3em
- Text transform: uppercase
- Text: "WELCOME BACK"
- Margin bottom: 16

### Headline
- Font: Inter Tight, 40px, weight 800
- Color: `colors.ink`
- Letter spacing: -0.045em
- Line height: 0.95
- Text: "Hey,\n{firstName}."
- Margin bottom: 16

### Subtitle
- Font: Inter Tight, 15px, weight 400
- Color: `colors.ink` at 0.7 opacity
- Line height: 1.5
- Max width: 30ch
- Text: "Signed in. Picking up where you left off."
- Margin bottom: 36

### Primary CTA
- Full width pill
- Background: `colors.accent`
- Color: `colors.bg`
- Padding: 18px vertical, 22px horizontal
- Border radius: 100
- Font: Inter Tight, 15px, weight 700, letterSpacing -0.015em
- Shadow: 0 8px 24px `colors.accentShadow`
- Text: "Continue to Home"
- Arrow: ArrowRight 16px, strokeWidth 2.6, gap 8

### Fine Print
- Font: JetBrains Mono, 9.5px, weight 500
- Color: `colors.inkSubtle`
- Letter spacing: 0.15em
- Text transform: uppercase
- Text: "NOT YOU? SIGN OUT FROM SETTINGS"
- Margin top: 14

## Entrance Animation

Both screens use `useFadeUpEntrance` hook:
- Opacity: 0 -> 1
- TranslateY: 16 -> 0
- Duration: 400ms
- Easing: ease-out
