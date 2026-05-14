# Deal Archive - Design Specification

## Deal History Screen

### Top Bar (56px height)
- ChevronLeft 36x36 back button (surface bg, borderRadius 18)
- "Deal history" display 18/800/-0.035em center (ink)

### Hero Section
- Mono 10/0.22em/uppercase "{N} CLOSED DEALS" eyebrow (accent)
- Display 30/800/-0.04em "Everything\nthat's wrapped." headline (ink)

### Filter Tabs (3 equal flex buttons)
- Gap 8 between tabs
- Each tab:
  - Display 13/700 label
  - Mono 9.5/0.18em count below
  - Padding 12 vertical
  - borderRadius 10
- **Active state**: accentSoft bg + accentBorder (1px) + accent text
- **Inactive state**: surface bg + border (1px) + ink text

### History Row (HistoryRow card)
- Padding 13/14, borderRadius 12, gap 12
- Surface bg + border (1px)
- Press scale 0.99

**Row layout**:
- **Avatar**: 40x40, radius 11, borderStrong border
  - Business POV: influencer photo
  - Influencer POV: business monogram tile (surfaceAlt bg + borderStrong)
  - EXPIRED + DECLINED: opacity 0.6 (60% desaturation)
- **Middle column**:
  - Name: display 14/700/-0.025em, numberOfLines 1
  - Caption: mono 8.5/0.16em/uppercase/600, color by tone (inkMuted for RATED, decline for EXPIRED/DECLINED)
  - Summary: body 11.5/inkMuted "{services} · {money}", numberOfLines 1
- **Right column**: mono 9/0.12em/inkSubtle uppercase date ("MAY 3")

### Empty States
- Mono 10/0.22em "NOTHING HERE YET" eyebrow (inkMuted)
- Body 13/inkMuted explanation text
- Centered, role-aware copy per tab

**Empty state copy**:
| Tab | Business | Influencer |
|-----|----------|------------|
| Completed | "Completed deals will appear here once you've rated them." | "Your completed deals will appear here once both sides have rated." |
| Declined | "Influencers who declined your requests will appear here." | "Requests you've declined will appear here." |
| Expired | "Requests that timed out without a response will appear here." | "Requests you didn't respond to in time will appear here." |

---

## Deal Summary Screen

### Top Bar (56px height)
- ChevronLeft 36x36 back button
- "DEAL SUMMARY · ARCHIVED" mono 10/0.22em/uppercase center (inkMuted)
- No counterparty name in bar (it's in hero)

### Compact Hero
- 56x56 avatar, radius 14
  - EXPIRED + DECLINED: opacity 0.6
- Caption from `getDealCaption` (mono 8.5/0.16em, accent for RATED, decline for EXPIRED/DECLINED)
- Name: display 18/800/-0.035em (ink)
- Summary: body 12/inkMuted "{services} · {money}"

### "The story" Timeline Section
- Section header: mono 10/0.22em/uppercase "THE STORY" (inkMuted), marginBottom 16
- Vertical event list:
  - 24px circle with icon (accentSoft + accentBorder for happy-path, declineSoft + declineBorder for expired/declined)
  - 1px connector line (border color) running vertically between circles
  - Title: display 13.5/700/-0.02em (ink)
  - Date/time: mono 9/0.1em/inkSubtle ("APR 28 · 14:22") right-aligned
  - Detail (optional): body 12/inkMuted below title, marginTop 2
- Last event has no connector line below

### "The deal" Card
- Section header: mono 10/0.22em/uppercase "THE DEAL" (inkMuted)
- Surface tile, padding 16, radius 14
- Services list: each line display 14/600/-0.02em (ink)
- Total: display 17/800/-0.035em (ink), marginTop 12
- Deal ID: mono 9/0.12em/inkSubtle "#D-{ID}" right-aligned

### State-specific Block

**RATED**:
- "Ratings exchanged" section header
- Two compact RatingCard variants:
  - 13px stars (not 16px)
  - 10.5px tag pills (not 12px)
  - Italic review (if present)
  - Viewer's rating labeled "You rated {firstName}"
  - Counterparty's rating labeled "{firstName} rated you"

**DECLINED**:
- "Decline note" section header (decline color)
- DeclineSoft tile, declineBorder, radius 14, padding 16
- Italic quoted note or "No note was added." fallback
- Mono 9/0.16em/uppercase footer "REASON: {REASON}" (decline color)

**EXPIRED**:
- Nothing displayed. Timeline tells the story.

### Coordination Block
- Section header: mono 10/0.22em/uppercase "COORDINATION" (inkMuted)

**If messages exist**:
- Surface tile, padding 14, radius 14, row layout
- 40px message-circle icon in accentSoft circle (radius 12)
- Middle: display 14.5/700 "Open archived thread", mono 9/0.18em "READ-ONLY · {N} MESSAGES"
- ArrowRight 16 accent

**If no messages (EXPIRED + DECLINED)**:
- Dashed border tile (borderStyle: 'dashed', borderColor: borderStrong)
- Body 13/inkMuted centered text:
  - EXPIRED: "No messages exchanged. The request expired before a conversation started."
  - DECLINED: "No messages exchanged. The request was declined right away."

### Sticky Footer
- BlurView with bgOverlay94
- Padding 16 top, 24 horizontal
- Single outlined button: "Back to history" with ChevronLeft 16 icon
- borderStrong border, radius pill, padding 14 vertical

---

## Color Mapping

| Element | RATED | DECLINED | EXPIRED |
|---------|-------|----------|---------|
| Caption text | inkMuted | decline | decline |
| Timeline icon bg | accentSoft | declineSoft | declineSoft |
| Timeline icon border | accentBorder | declineBorder | declineBorder |
| Timeline icon color | accent | decline | decline |
| Avatar treatment | normal | 60% opacity | 60% opacity |
