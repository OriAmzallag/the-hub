# Mark Deal as Done - Product Requirements

## Overview

Mark Done is the Influencer's irreversible action that closes the active work portion of a deal and opens the rating phase. It moves deal state `IN_PROGRESS` -> `COMPLETED` (sub-state: `neither-rated`), after which both sides can rate.

Per the Level 2 platform principle, this is an honor-based claim - the platform doesn't verify what "done" means.

## User Story

As an Influencer with an IN_PROGRESS deal, I want to mark the deal as done when I've delivered the work, so both parties can proceed to rate the deal.

## Six Locked Product Decisions

### 1. Two Entry Points

- **Thread tile:** Sticky tile in the Coordination Thread, positioned above the message input. Only visible when deal is `IN_PROGRESS` AND viewer is the Influencer. The tile augments the input - it does NOT replace the input.
- **Dashboard card strip:** Inline accent-soft strip at the bottom of the IN_PROGRESS Dashboard deal card on the Influencer Dashboard. The card has two distinct tap targets:
  - Card body -> routes to Coordination Thread
  - Accent strip -> opens the modal directly

### 2. Modal Confirmation (NOT tap-twice)

Bottom-sheet style modal with:
- Drag handle (decorative): 36x4, borderStrong color
- Hero icon: 56x56 accent-soft container with radius 16, accent check icon 26px
- Title: display 24/800 "Mark deal as done?"
- Body: 14/0.75-opacity "This tells {Business name} you've delivered the work. They'll be able to rate the deal."
- Optional message section
- Action row with two buttons

### 3. Optional 200-char Final Message

Inside the modal:
- Mono label: "ADD A FINAL MESSAGE . OPTIONAL"
- 3-row textarea with 200-char hard limit
- Counter turns accent at 90% (>180 chars)
- Placeholder: "e.g. Reel is live, story set going up tonight. Let me know if you need anything else!"
- If filled on confirm: posts to thread as regular Influencer message IMMEDIATELY BEFORE the system event (two separate inserts)
- If empty: only the system event posts

### 4. Toast After Confirm (NO auto-route to Rating Flow)

- Toast slides in from top of screen
- Accent-bordered, backdrop blur, 32px accent check with pop animation on left
- Title: display-700 "Marked done."
- Caption: mono "RATE WHEN YOU'RE READY"
- X dismiss button on right
- Auto-dismiss after 3.5 seconds
- Rating Flow stays available via persistent RATE NOW card on Dashboard

### 5. NO Business-side Surface

State change propagates ONLY via:
- Canonical Dashboard caption resolver (Business's card flips to RATE NOW)
- Thread system message
- Future push notification (deferred)

Do NOT build a new screen, banner, or inbox entry for Business.

### 6. Irreversible - NO Undo in v1

Failure modes (marked by mistake, marked before Business saw work) are explicit Level 2 tradeoffs. Platform doesn't mediate - ratings capture consequences. 60-second undo deferred per section 6.6.

## Locked Copy

| Surface | Element | Copy |
|---------|---------|------|
| Thread tile | Title | Mark deal as done |
| Thread tile | Caption | WHEN THE WORK IS DELIVERED |
| Dashboard strip | Label | Mark deal as done |
| Modal | Title | Mark deal as done? |
| Modal | Body | This tells {Business name} you've delivered the work. They'll be able to rate the deal. |
| Modal | Textarea label | Add a final message . optional |
| Modal | Textarea placeholder | e.g. Reel is live, story set going up tonight. Let me know if you need anything else! |
| Modal | Cancel button | Not yet |
| Modal | Confirm button | Mark done |
| System message | Text | You marked the deal as done . Both can rate now |
| Thread caption | After confirm | RATE NOW |
| Disabled input | Caption | Deal closed . Rate to finish |
| Toast | Title | Marked done. |
| Toast | Caption | Rate when you're ready |

## State Changes After Confirm (Influencer Side)

1. **Deal state:** `IN_PROGRESS` -> `COMPLETED` (sub-state: `neither-rated`)
2. **Coordination Thread:**
   - Mark Done tile disappears
   - If final message filled: inserts as Influencer message
   - System message inserts: "You marked the deal as done . Both can rate now" (accent tone, accent-soft pill)
   - Message input becomes disabled with "DEAL CLOSED . RATE TO FINISH" mono caption underneath
   - Top-bar caption flips `IN PROGRESS` -> `RATE NOW`
3. **Dashboard:**
   - Card moves from "Active deals" to "Needs your attention"
   - Card gets accent-soft fill
   - Caption shows RATE NOW
   - Tap routes to Rating Flow (per canonical caption resolver - already wired)

## Acceptance Criteria

- [ ] Thread tile visible only when deal is IN_PROGRESS AND viewer is Influencer
- [ ] Dashboard card has two distinct tap targets (body vs strip)
- [ ] Modal matches visual spec exactly (hero, copy, textarea, buttons)
- [ ] Optional message posts before system event when filled
- [ ] Toast appears on confirm with pop animation
- [ ] Toast auto-dismisses after 3.5 seconds
- [ ] After confirm: tile disappears, system message appears, input disabled
- [ ] Thread top-bar caption flips to RATE NOW
- [ ] Dashboard card moves to attention section with RATE NOW caption
- [ ] Business side sees no new UI (existing resolver handles caption)
- [ ] All copy matches locked copy table exactly

## Out of Scope (Deferred)

- 60-second undo window (section 6.6)
- Push notification to Business (section 6.8)
- Backend persistence (mock data for now)

## Related Documents

- `project_mark_done_decisions.md` - Memory file with locked decisions
- `project_rating_decisions.md` - Mark Done is the ONLY producer of IN_PROGRESS -> COMPLETED
- `project_deal_lifecycle_4_plus_2.md` - Canonical state machine
- `project_dashboard_attention_section.md` - Post-confirm card location
