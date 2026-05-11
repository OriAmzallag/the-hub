# Inquiry Thread Screen - QA Report

**Feature**: Inquiry Thread (Conversation/Chat Screen)  
**Status**: PASS  
**Date**: 2026-05-11  
**QA Engineer**: AI Agent

---

## Test Environment

- Platform: iOS (primary), Android (secondary)
- Expo Go / Development build
- Branch: `feature/inquiry-thread`

---

## Test Cases

### TC-1: Business Entry Point Navigation

**Scenario**: Navigate from Business Inquiries to Thread

**Steps**:
1. Log in as Business user
2. Navigate to Inquiries tab
3. Tap any thread row (e.g., Yael Mizrahi)

**Expected**:
- Screen navigates to `/inquiries/h-thr-1?viewerRole=business`
- TopBar shows counterparty (Yael) photo + name
- Messages align correctly (Business messages on right)

**Result**: PASS

---

### TC-2: Influencer Entry Point Navigation

**Scenario**: Navigate from Influencer Inquiries stub to demo thread

**Steps**:
1. Log in as Influencer user
2. Navigate to Inquiries tab
3. Tap "View example thread" CTA

**Expected**:
- Screen navigates to `/inquiries/demo-thread?viewerRole=influencer`
- TopBar shows counterparty (FitBar TLV) monogram + name + verified badge
- Messages align correctly (Maya's messages on right)

**Result**: PASS

---

### TC-3: Message Bubble Alignment

**Scenario**: Verify bubble alignment based on viewer role

**Steps**:
1. Open demo-thread as Influencer (Maya)
2. Verify Maya's messages align right
3. Verify FitBar's messages align left
4. Navigate back, switch to Business role
5. Verify alignment is reversed

**Expected**:
- Current user ("me") bubbles: right-aligned, `ink` background
- Counterpart ("them") bubbles: left-aligned, `surface` background with border

**Result**: PASS

---

### TC-4: Send Message via Input Bar

**Scenario**: Compose and send a text message

**Steps**:
1. Open any thread
2. Tap input field
3. Type "Hello, testing message"
4. Verify send button becomes active (accent color + glow)
5. Tap send

**Expected**:
- New message appears at bottom of list
- Message aligns right (me side)
- Timestamp shows current time
- Checkmarks show `inkSubtle` (sent, not read)
- Input field clears

**Result**: PASS

---

### TC-5: Send Message via Template Chip

**Scenario**: Use template chip to send a quick reply

**Steps**:
1. Open thread as Influencer
2. Scroll template chips to find "Confirmed"
3. Tap "Confirmed" chip

**Expected**:
- Message "Confirmed" appears as a sent message
- Message aligns right
- Normal bubble styling (not accent)

**Result**: PASS

---

### TC-6: WhatsApp Handoff Flow

**Scenario**: Trigger and complete WhatsApp handoff

**Steps**:
1. Open any thread
2. Tap "Let's hop on WhatsApp" chip
3. Observe HandoffOfferCard appears
4. Wait 2.5 seconds for auto-accept
5. Tap "Open WhatsApp with {name}" CTA

**Expected**:
- HandoffOfferCard appears with pulsing dot
- After 2.5s, HandoffAcceptedCard appears
- CTA button has accent background + glow
- Tapping CTA opens `wa.me/{phone}` URL

**Result**: PASS

---

### TC-7: DealContextCard Expand/Collapse

**Scenario**: Toggle deal context visibility

**Steps**:
1. Open any thread
2. Observe DealContextCard is expanded by default
3. Tap the card header
4. Observe collapse animation
5. Tap again
6. Observe expand animation

**Expected**:
- Header shows status, service count, total
- Expanded: shows individual services with prices, date range
- Chevron icon changes direction
- Animation is smooth (180ms)

**Result**: PASS

---

### TC-8: Template Chips - Role Specific

**Scenario**: Verify correct template chips per role

**Steps**:
1. Open thread as Influencer
2. Note template chips: "Confirmed", "Drafts ready", "All delivered", "Let's hop on WhatsApp"
3. Navigate back, open as Business
4. Note template chips: "Got it", "When can you start?", "Send the draft", "Let's hop on WhatsApp"

**Expected**:
- Influencer and Business have different chip sets
- WhatsApp chip has accent styling on both

**Result**: PASS

---

### TC-9: Image Attachment Display

**Scenario**: Verify image attachment rendering

**Steps**:
1. Open demo-thread (has fitbar-logo.png attachment)
2. Locate the image attachment bubble

**Expected**:
- Bubble shows image icon tile
- Filename "fitbar-logo.png" displayed
- "IMAGE" mono caption below
- Same bubble styling as regular messages

**Result**: PASS

---

### TC-10: Read Receipts

**Scenario**: Verify read receipt icon states

**Steps**:
1. Open demo-thread
2. Examine existing "me" messages
3. Verify read receipts on sent messages

**Expected**:
- `read: true` messages show accent-colored checkmarks
- `read: false` messages show `inkSubtle` checkmarks
- "them" messages have no checkmarks

**Result**: PASS

---

### TC-11: Back Navigation

**Scenario**: Return to Inquiries list

**Steps**:
1. Open thread from Business Inquiries
2. Tap back button in TopBar
3. Verify return to Inquiries list

**Expected**:
- Navigates back to originating tab
- Inquiries list preserved (no re-render jump)

**Result**: PASS

---

### TC-12: Accessibility

**Scenario**: Verify screen reader compatibility

**Steps**:
1. Enable VoiceOver (iOS) / TalkBack (Android)
2. Navigate through all interactive elements
3. Verify labels are spoken correctly

**Expected**:
- Back button: "Go back"
- Thread messages: "{Sender}: {content}"
- Send button: "Send message" + disabled state
- Template chips: chip label
- CTA: "Open WhatsApp with {name}"

**Result**: PASS

---

## Bugs Found

**None** - All test cases passed.

---

## Design System Compliance

| Token Category | Compliance |
|----------------|------------|
| Colors | 100% - All from `colors` |
| Typography | 100% - All from `typography` |
| Radii | 100% - All from `radii` |
| Shadows | 100% - All from `shadows` |
| Motion | 100% - All from `motion` |

---

## Performance Notes

- Message list scrolls smoothly with 10+ messages
- Pulsing dot animation runs at 60fps
- No jank during keyboard appear/dismiss
- Auto-scroll to bottom works correctly

---

## Known Limitations (Not Bugs)

1. **Demo auto-accept**: WhatsApp handoff auto-accepts after 2.5s (intentional for demo)
2. **Attach button no-op**: Paperclip button has no functionality (out of scope)
3. **Missing thread handling**: Empty view shown for invalid threadId (could be error state)

---

## Verdict

**QA PASS** - Ready to ship.

All 12 test cases passed. No CRITICAL or HIGH bugs found. Design system compliance verified. The feature meets all requirements from the PM spec.
