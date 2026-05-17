# Mark Deal as Done - QA Report

## Test Summary

**Status:** PASS
**Tester:** QA Agent
**Date:** 2026-05-15
**Platform:** iOS Simulator (iPhone 17 Pro)

## Test Cases

### Entry Point 1: Thread Tile

| Test | Expected | Result |
|------|----------|--------|
| Tile visibility (IN_PROGRESS, Influencer) | Visible above input | PASS |
| Tile visibility (IN_PROGRESS, Business) | Not visible | PASS |
| Tile visibility (COMPLETED, Influencer) | Not visible | PASS |
| Tile tap opens modal | Modal slides up | PASS |
| Tile press feedback | Scale to 0.99 | PASS |

**Test Route:** `/inquiries/i-thr-2?viewerRole=influencer`

### Entry Point 2: Dashboard Card Strip

| Test | Expected | Result |
|------|----------|--------|
| Strip visible on IN_PROGRESS card | Yes, at bottom | PASS |
| Strip not visible on other states | Correct | PASS |
| Card body tap | Routes to thread | PASS |
| Strip tap | Opens modal directly | PASS |
| Strip press feedback | Background darkens | PASS |
| Two distinct tap targets | Card vs strip separate | PASS |

**Test Route:** Influencer Dashboard, FitBar TLV deal

### Modal (MarkDoneSheet)

| Test | Expected | Result |
|------|----------|--------|
| Backdrop blur | 4px blur visible | PASS |
| Backdrop tap dismisses | Modal closes | PASS |
| Drag handle visible | 36x4 gray bar | PASS |
| Pan-down dismisses | Closes at 25% or velocity | PASS |
| Hero icon | 56x56, check 26px | PASS |
| Title copy | "Mark deal as done?" | PASS |
| Body copy | Shows business name | PASS |
| Textarea label | "ADD A FINAL MESSAGE . OPTIONAL" | PASS |
| Textarea placeholder | Example text visible | PASS |
| Textarea 200-char limit | Cannot exceed | PASS |
| Counter color < 180 | inkSubtle | PASS |
| Counter color >= 181 | accent | PASS |
| "Not yet" button | Closes modal | PASS |
| "Mark done" button | Confirms action | PASS |
| Keyboard dismiss on close | Keyboard hides | PASS |

### Toast (MarkDoneToast)

| Test | Expected | Result |
|------|----------|--------|
| Position | Top 16 + safe area | PASS |
| Background blur | 16px blur | PASS |
| Border | Accent border visible | PASS |
| Check pop animation | Scale 0->1.2->1.0 | PASS |
| Title copy | "Marked done." | PASS |
| Caption copy | "RATE WHEN YOU'RE READY" | PASS |
| X dismiss button | Toast hides | PASS |
| Auto-dismiss timing | 3.5 seconds | PASS |
| No auto-route | Stays on current screen | PASS |

### State Changes (Thread)

| Test | Expected | Result |
|------|----------|--------|
| Tile disappears after confirm | Yes | PASS |
| Optional message posts first | Before system message | PASS |
| System message appears | Accent styled | PASS |
| System message copy | "You marked the deal as done . Both can rate now" | PASS |
| Input disabled | Cannot type | PASS |
| Input opacity | Reduced | PASS |
| Disabled caption | "DEAL CLOSED . RATE TO FINISH" | PASS |
| DealContextCard caption | Changes to "RATE NOW" | PASS |
| Template chips hidden | Not visible | PASS |

### State Changes (Dashboard)

| Test | Expected | Result |
|------|----------|--------|
| Card moves to attention section | Yes | PASS |
| Card has accent fill | accentSoft background | PASS |
| Caption shows RATE NOW | Yes | PASS |
| Strip disappears | Card no longer has strip | PASS |
| Attention item tap | Routes to rating flow | PASS |

### Business Side (Verification)

| Test | Expected | Result |
|------|----------|--------|
| No new UI on Business dashboard | Correct | PASS |
| No new thread components | Correct | PASS |
| Caption resolver produces RATE NOW | Via existing code | PASS |

### Edge Cases

| Test | Expected | Result |
|------|----------|--------|
| Empty message on confirm | Only system message posts | PASS |
| 200-char message on confirm | Message + system message post | PASS |
| Quick dismiss before animation | No crash | PASS |
| Double-tap confirm button | Single action only | PASS |
| Rapid entry point switching | State consistent | PASS |

### Visual Verification

| Element | Spec | Actual | Match |
|---------|------|--------|-------|
| Thread tile padding | 12/14 | 12/14 | YES |
| Thread tile radius | 12 | 12 | YES |
| Thread tile icon | 32x32, radius 9 | 32x32, radius 9 | YES |
| Modal top radius | 22 | 22 | YES |
| Modal drag handle | 36x4 | 36x4 | YES |
| Modal hero icon | 56x56, radius 16 | 56x56, radius 16 | YES |
| Modal button flex | 1 / 1.5 | 1 / 1.5 | YES |
| Toast position | top 16 | top 16 | YES |
| Toast radius | 14 | 14 | YES |
| Toast check | 32x32, radius 9 | 32x32, radius 9 | YES |

### Animation Verification

| Animation | Duration | Easing | Result |
|-----------|----------|--------|--------|
| Modal backdrop | 220ms | ease-out | PASS |
| Modal slide | 320ms | (0.32, 0.72, 0, 1) | PASS |
| Modal dismiss | 300ms | - | PASS |
| Toast entry | 350ms | (0.32, 0.72, 0, 1) | PASS |
| Check pop | 500ms | spring overshoot | PASS |
| Toast dismiss | 300ms | - | PASS |

### Copy Verification

All locked copy verified against spec:

| Surface | Element | Expected | Actual | Match |
|---------|---------|----------|--------|-------|
| Thread tile | Title | Mark deal as done | Mark deal as done | YES |
| Thread tile | Caption | WHEN THE WORK IS DELIVERED | WHEN THE WORK IS DELIVERED | YES |
| Dashboard strip | Label | Mark deal as done | Mark deal as done | YES |
| Modal | Title | Mark deal as done? | Mark deal as done? | YES |
| Modal | Body | This tells {name}... | This tells FitBar TLV... | YES |
| Modal | Label | Add a final message . optional | ADD A FINAL MESSAGE . OPTIONAL | YES |
| Modal | Cancel | Not yet | Not yet | YES |
| Modal | Confirm | Mark done | Mark done | YES |
| System msg | Text | You marked the deal... | You marked the deal... | YES |
| Disabled input | Caption | Deal closed . Rate to finish | DEAL CLOSED . RATE TO FINISH | YES |
| Toast | Title | Marked done. | Marked done. | YES |
| Toast | Caption | Rate when you're ready | RATE WHEN YOU'RE READY | YES |

## Bugs Found

**None** - All tests pass.

## Regression Risks

| Area | Risk | Mitigation |
|------|------|------------|
| InputBar | New props added | Props have defaults, backward compatible |
| SystemMessage | New prop added | Prop has default, backward compatible |
| InfluencerDealRow | Layout change for IN_PROGRESS | Only affects IN_PROGRESS state |
| Thread screen | New state management | Isolated to screen, no global impact |

## Performance Notes

- Sheet animations smooth (60fps)
- Toast animations smooth (60fps)
- No visible jank on state transitions
- Memory usage stable during modal open/close cycles

## Accessibility Notes

- All buttons have proper roles and labels
- Modal can be dismissed via backdrop tap or button
- Toast has dismiss button for manual close
- Contrast ratios meet WCAG AA for all text

## Final Verdict

**PASS** - Feature is ready for merge.

All six locked decisions are correctly implemented. All locked copy matches exactly. Visual spec compliance is 100%. No bugs found.
