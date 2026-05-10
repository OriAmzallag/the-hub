# Booking Request Sheet - QA Report
Generated: 2026-05-10
Status: READY FOR MANUAL VERIFICATION

## Test Environment
- Branch: `feature/booking-request-sheet`
- Platform: iOS Simulator (Tom to verify)
- Prerequisites: Navigate to Influencer Storefront (`/influencer/[id]`)

---

## Manual Test Checklist

### 1. Entry Point Validation

| Test | Expected | Status |
|------|----------|--------|
| StickyCTA shows "SELECT A SERVICE" with 0 services | CTA button disabled, muted styling | PENDING |
| StickyCTA shows "1 SERVICE SELECTED" with 1 service | CTA button enabled, accent styling | PENDING |
| StickyCTA shows "2 SERVICES SELECTED" with 2 services | CTA button enabled, total shown | PENDING |
| Tap disabled CTA | Nothing happens | PENDING |
| Tap enabled CTA | Booking sheet rises | PENDING |

### 2. Sheet Rise Animation

| Test | Expected | Status |
|------|----------|--------|
| Sheet rises from bottom | 420ms smooth animation | PENDING |
| Scrim fades in | 300ms fade to rgba(0,0,0,0.55) | PENDING |
| Scrim has blur effect | Slight blur (intensity 4) visible | PENDING |
| Storefront content dimmed | Visible behind scrim but not interactive | PENDING |

### 3. Services Section

| Test | Expected | Status |
|------|----------|--------|
| 1 service selected | Shows 1 line item with badge "01" | PENDING |
| 2 services selected | Shows badges "01", "02" in selection order | PENDING |
| 3+ services selected | Badges continue "01", "02", "03"... | PENDING |
| Remove middle service | Remaining services renumber (no gaps) | PENDING |
| Remove first service | Second becomes "01" | PENDING |
| Remove all services | Empty state: "ALL SERVICES REMOVED - GO BACK TO ADD SOME" | PENDING |
| Submit with empty services | Button disabled | PENDING |

### 4. When Section

| Test | Expected | Status |
|------|----------|--------|
| Initial state | No chip selected | PENDING |
| Tap "This week" | Chip highlights with accent styling | PENDING |
| Tap "Next week" | Selection moves, previous deselects | PENDING |
| Tap "In 2 weeks" | Selection updates | PENDING |
| Tap "Pick a date" | Chip selects (no calendar opens - TODO) | PENDING |
| Shows date ranges | "May 10 - May 17", "May 17 - May 24", etc. | PENDING |
| "Pick a date" shows | Calendar icon + "CALENDAR" text | PENDING |

### 5. Brief Section

| Test | Expected | Status |
|------|----------|--------|
| Initial state | Placeholder visible, no counter | PENDING |
| Type 1 character | Counter appears: "1 / 300" | PENDING |
| Type 5 characters | Counter shows "5 / 300" in muted color | PENDING |
| Type 299 characters | Counter shows "299 / 300" in muted color | PENDING |
| Type 300 characters | Counter shows "300 / 300" in accent color | PENDING |
| Type 301+ characters | Input stops accepting, stays at 300 | PENDING |
| Paste 500 characters | Clipped to 300, counter shows "300 / 300" accent | PENDING |
| Clear all text | Counter hidden, placeholder reappears | PENDING |
| Border on focus/content | Border strengthens when content present | PENDING |

### 6. Total Section

| Test | Expected | Status |
|------|----------|--------|
| Line items shown | Each service name + price | PENDING |
| Total calculated | Sum of all service prices | PENDING |
| Total formatting | Large display text with shekel symbol | PENDING |
| Checkbox unchecked | Hollow square with border | PENDING |
| Tap checkbox | Fills with accent color + check icon | PENDING |
| Checkbox label | "I confirm the total budget of [total]" | PENDING |

### 7. Footer Note

| Test | Expected | Status |
|------|----------|--------|
| Shows influencer first name | "MAYA RESPONDS WITHIN 72H" (uppercase) | PENDING |
| Styling | Mono font, subtle color, centered | PENDING |

### 8. Submit Button Validation

| Test | Expected | Status |
|------|----------|--------|
| All fields empty | Disabled (surface bg, muted text) | PENDING |
| Only services selected | Disabled | PENDING |
| Services + date chip | Disabled | PENDING |
| Services + date + brief | Disabled | PENDING |
| Services + date + brief + checkbox | ENABLED (accent bg, glow) | PENDING |
| Remove any field | Reverts to disabled | PENDING |
| Tap disabled button | Nothing happens | PENDING |
| Tap enabled button | Morphs to success state | PENDING |

### 9. Dismiss Behaviors (Form State)

| Test | Expected | Status |
|------|----------|--------|
| Tap scrim | Sheet falls, storefront visible | PENDING |
| Tap X button | Sheet falls, storefront visible | PENDING |
| Drag handle down 25% | Sheet dismisses | PENDING |
| Drag handle down 20% and release | Sheet snaps back up | PENDING |
| Fast flick down (>800 velocity) | Sheet dismisses | PENDING |

### 10. Success State

| Test | Expected | Status |
|------|----------|--------|
| Hero icon appears | 72px accent circle with check, pop animation | PENDING |
| "REQUEST SENT" label | Mono uppercase accent color | PENDING |
| Heading shows | "On its way\nto Maya." (38px display) | PENDING |
| Sub copy shows | "She typically responds within 72 hours..." | PENDING |
| Summary card | Services count + total | PENDING |
| Animations | Staggered fade-up entrance | PENDING |

### 11. Success State Dismiss Behaviors

| Test | Expected | Status |
|------|----------|--------|
| Tap scrim | NOTHING (scrim not dismissable) | PENDING |
| Drag handle down | NOTHING (drag disabled) | PENDING |
| Tap "View request status" | Logs TODO, sheet closes | PENDING |
| Tap "Back to discovery" | Sheet closes, storefront visible | PENDING |

### 12. Form Reset After Close

| Test | Expected | Status |
|------|----------|--------|
| Close sheet after partial form fill | - | PENDING |
| Reopen sheet | Date chip unselected | PENDING |
| Reopen sheet | Brief empty | PENDING |
| Reopen sheet | Budget unchecked | PENDING |
| Reopen sheet | Services reflect current storefront selection | PENDING |

### 13. State Sync with Storefront

| Test | Expected | Status |
|------|----------|--------|
| Remove service in sheet | Badge numbers update immediately | PENDING |
| Remove service in sheet | Total recalculates | PENDING |
| Remove service in sheet | Storefront selection updates when sheet closes | PENDING |
| Close sheet, add service, reopen | New service appears in sheet | PENDING |

---

## Edge Case Tests

### EC-1: Rapid Open/Close
| Test | Expected | Status |
|------|----------|--------|
| Open sheet, immediately tap scrim | Sheet animates closed smoothly | PENDING |
| Open/close rapidly 5 times | No animation glitches | PENDING |

### EC-2: Keyboard Interaction
| Test | Expected | Status |
|------|----------|--------|
| Tap brief field | Keyboard opens | PENDING |
| Scroll while keyboard open | Content scrolls properly | PENDING |
| Dismiss keyboard | Brief field visible | PENDING |

### EC-3: Long Service Names
| Test | Expected | Status |
|------|----------|--------|
| Service with very long name | Text truncates or wraps appropriately | PENDING |

---

## Accessibility Tests

| Test | Expected | Status |
|------|----------|--------|
| VoiceOver: Close button | Announces "Close booking request, button" | PENDING |
| VoiceOver: Disabled submit | Announces "Send request, button, dimmed" | PENDING |
| VoiceOver: Date chips | Announces selection state | PENDING |
| VoiceOver: Checkbox | Announces checked/unchecked state | PENDING |
| VoiceOver: Remove service | Announces "Remove [service name], button" | PENDING |

---

## Known Limitations (Not Bugs)

1. "Pick a date" chip selects but doesn't open calendar (TODO for future PR)
2. "View request status" logs TODO (route doesn't exist yet)
3. Pronoun "She" is hardcoded (pending influencer gender data)
4. Date ranges are static (May 10-based, acceptable for MVP)

---

## Bugs Found

None found during code review. Pending manual testing.

---

## Summary

| Category | Tests | Status |
|----------|-------|--------|
| Entry Point | 5 | PENDING |
| Sheet Animation | 4 | PENDING |
| Services | 7 | PENDING |
| When | 7 | PENDING |
| Brief | 10 | PENDING |
| Total | 6 | PENDING |
| Footer | 2 | PENDING |
| Submit Validation | 9 | PENDING |
| Form Dismiss | 5 | PENDING |
| Success State | 6 | PENDING |
| Success Dismiss | 4 | PENDING |
| Form Reset | 5 | PENDING |
| State Sync | 4 | PENDING |
| Edge Cases | 5 | PENDING |
| Accessibility | 5 | PENDING |
| **TOTAL** | **84** | **PENDING** |

---

## Verdict

**READY FOR MANUAL VERIFICATION**

Code review passed. All test cases documented. Tom to run through checklist on iOS simulator.
