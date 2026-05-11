# Inquiry Thread Screen - Technical Plan

**Feature**: Inquiry Thread (Conversation/Chat Screen)  
**Status**: In Progress  
**Date**: 2026-05-11  
**Tech Lead**: AI Agent

---

## Architecture Overview

The Inquiry Thread screen is a shared route at `/inquiries/[threadId]` that renders the same UI for both Business and Influencer personas. The viewer role determines bubble alignment, template chips, and counterpart display.

---

## Route Structure

### Route Placement

Create `app/inquiries/[threadId].tsx` as a top-level route outside tab groups.

**Rationale**:
- Matches existing pattern of `app/influencer/[id].tsx` (storefront outside influencer tabs)
- Both `(business)` and `(influencer)` tab groups can navigate to it via `router.push('/inquiries/<id>')`
- Avoids duplicating the screen in both tab groups
- Back navigation returns to the originating Inquiries tab naturally

### File Structure

```
app/
  inquiries/
    [threadId].tsx          # Main thread screen
components/
  thread/                   # New directory for thread components
    TopBar.tsx              # Back + counterpart info
    DealContextCard.tsx     # Collapsible deal summary
    MessageList.tsx         # ScrollView of messages
    SystemMessage.tsx       # Centered system pill
    MessageBubble.tsx       # Text/attachment bubble
    HandoffOfferCard.tsx    # Pending WhatsApp handoff
    HandoffAcceptedCard.tsx # Accepted handoff with CTA
    TemplateChips.tsx       # Quick-reply chip bar
    InputBar.tsx            # Compose + send
constants/
  mockThread.ts             # Mock thread data
types/
  thread.ts                 # Thread-specific types
```

---

## Data Model

### Types (types/thread.ts)

```typescript
import type { DealState, ViewerRole } from '@/lib/dealLifecycle';

/**
 * Party in a deal (Business or Influencer)
 */
export interface Party {
  name: string;
  firstName: string;
  phone: string;
  monogram?: string;   // Business only
  photo?: string;      // Influencer only
  verified?: boolean;  // Verified badge
}

/**
 * Service in a deal
 */
export interface DealService {
  id: string;
  name: string;
  platform: string;  // e.g., "IG REEL", "IG STORY"
  price: number;
}

/**
 * Deal context for the thread
 */
export interface ThreadDeal {
  id: string;
  status: DealState;
  business: Party;
  influencer: Party;
  services: DealService[];
  total: number;
  dateLabel: string;     // e.g., "Next week"
  dateRange: string;     // e.g., "May 16 - May 23"
  acceptedAt: string;    // e.g., "May 9 . 14:32"
}

/**
 * Message attachment (images only for MVP)
 */
export interface MessageAttachment {
  kind: 'image';
  label: string;  // Filename
}

/**
 * Message types in the thread
 */
export type MessageType = 'system' | 'message' | 'handoff-offer' | 'handoff-accepted';

/**
 * Single message in the thread
 */
export interface ThreadMessage {
  id: string;
  type: MessageType;
  side?: 'me' | 'them';      // For message/handoff-offer types
  text?: string;             // For message/system types
  attachment?: MessageAttachment;
  timestamp: string;
  read?: boolean;            // For 'me' messages - read receipt
  icon?: 'check' | string;   // For system messages (e.g., deal accepted)
}

/**
 * WhatsApp handoff state machine
 */
export type HandoffState = null | 'pending' | 'accepted';

/**
 * Full thread data for the screen
 */
export interface ThreadDetail {
  id: string;
  deal: ThreadDeal;
  messages: ThreadMessage[];
  handoffState: HandoffState;
}

/**
 * Template chip definition
 */
export interface TemplateChip {
  id: string;
  label: string;
  isHandoff?: boolean;  // True for WhatsApp chip
}
```

### Mock Data (constants/mockThread.ts)

```typescript
export const MOCK_THREADS: Record<string, ThreadDetail> = {
  'demo-thread': { /* Maya + FitBar conversation from reference */ },
  'h-thr-1': { /* Yael thread from business inquiries */ },
  // etc.
};

export const TEMPLATES_BUSINESS: TemplateChip[] = [
  { id: 'got-it', label: 'Got it' },
  { id: 'when-start', label: 'When can you start?' },
  { id: 'send-draft', label: 'Send the draft' },
  { id: 'whatsapp', label: "Let's hop on WhatsApp", isHandoff: true },
];

export const TEMPLATES_INFLUENCER: TemplateChip[] = [
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'drafts', label: 'Drafts ready' },
  { id: 'delivered', label: 'All delivered' },
  { id: 'whatsapp', label: "Let's hop on WhatsApp", isHandoff: true },
];

export function getTemplates(viewerRole: ViewerRole): TemplateChip[] {
  return viewerRole === 'BUSINESS' ? TEMPLATES_BUSINESS : TEMPLATES_INFLUENCER;
}
```

---

## Viewer Role Resolution

### MVP Approach (URL Param)

```typescript
// In app/inquiries/[threadId].tsx
const { threadId, viewerRole: roleParam } = useLocalSearchParams<{
  threadId: string;
  viewerRole?: string;
}>();

const viewerRole: ViewerRole = 
  roleParam === 'influencer' ? 'INFLUENCER' : 'BUSINESS';
```

### Navigation from Entry Points

**Business Inquiries** (`app/(business)/inquiries.tsx`):
```typescript
// In ThreadRow onPress handler
router.push(`/inquiries/${thread.id}?viewerRole=business`);
```

**Influencer Stub** (`app/(influencer)/inquiries.tsx`):
```typescript
// Add demo CTA button
router.push('/inquiries/demo-thread?viewerRole=influencer');
```

---

## WhatsApp Handoff State Machine

```
null -----> "pending" -----> "accepted"
     (user taps      (counterpart
      WhatsApp        accepts -
      chip)           auto in demo)
```

### Implementation

```typescript
const [messages, setMessages] = useState<ThreadMessage[]>(initialMessages);
const [handoffState, setHandoffState] = useState<HandoffState>(null);

const offerWhatsAppHandoff = () => {
  // Add handoff-offer message
  setMessages((prev) => [
    ...prev,
    {
      id: `handoff-${Date.now()}`,
      type: 'handoff-offer',
      side: 'me',
      timestamp: formatTime(new Date()),
    },
  ]);
  setHandoffState('pending');
};

// Demo auto-accept after 2.5s
useEffect(() => {
  if (handoffState === 'pending') {
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `accepted-${Date.now()}`,
          type: 'handoff-accepted',
          timestamp: formatTime(new Date()),
        },
      ]);
      setHandoffState('accepted');
    }, 2500);
    return () => clearTimeout(timer);
  }
}, [handoffState]);
```

---

## Component Responsibilities

### TopBar
- Back button (ChevronLeft) - calls `router.back()`
- Counterpart monogram/avatar tile (36x36, radius 10)
- Counterpart name + verified badge (CheckCircle2)
- Bottom border

### DealContextCard
- Collapsible via `useState<boolean>`
- Header: status pill (mono accent), service count + total
- Body: service list with prices, date range with Calendar icon
- Uses `getDealCaption()` for status display

### MessageList
- `ScrollView` with ref for auto-scroll to bottom
- Renders array of messages by type
- Auto-scrolls on new messages

### SystemMessage
- Centered pill with icon + text
- Used for "Deal accepted" etc.

### MessageBubble
- `me` side: `ink` background, `bg` text, right-aligned, sharp bottom-right
- `them` side: `surface` background, `ink` text, left-aligned, sharp bottom-left
- Timestamp + read receipt (CheckCheck icon) for `me` bubbles

### HandoffOfferCard
- `accentSoft` + `accentBorder` surface
- MessageCircle icon + "YOU SUGGESTED WHATSAPP" label
- Body text explaining the pending state
- Pulsing 6x6 accent dot + "PENDING" label

### HandoffAcceptedCard
- `surface` + `borderStrong`
- WhatsApp icon tile + "Numbers shared" header
- Body text reminder
- Primary accent CTA linking to `wa.me/{phone}`

### TemplateChips
- Horizontal ScrollView
- Regular chips: `surface` + `border`
- WhatsApp chip: `accentSoft` + `accentBorder` + MessageCircle icon

### InputBar
- Paperclip button (attach - no-op for MVP)
- Text input with border state change when has content
- Send button: disabled (`surface`) vs active (`accent` + glow)

---

## Component Reuse

### Existing Components to Import
- `ScreenHeader` - Not used (custom TopBar with back button needed)
- `Avatar` from `components/business/inquiries/Avatar.tsx` - Can reuse for counterpart display
- `getDealCaption()` from `lib/dealLifecycle.ts` - For status pill text

### New Components Needed
All components in `components/thread/` directory are new.

---

## Keyboard Handling

- `KeyboardAvoidingView` wrapper for iOS
- Input bar should stay above keyboard
- `scrollToEnd()` when keyboard appears

---

## Navigation Integration

### Wire Business ThreadRow

In `components/business/inquiries/ThreadRow.tsx`, the `onPress` prop already exists but is not wired. Parent `InquiriesScreen` should pass:

```typescript
<ThreadRow
  key={thread.id}
  thread={thread}
  viewerRole={viewerRole}
  onPress={() => router.push(`/inquiries/${thread.id}?viewerRole=business`)}
/>
```

### Add Influencer Demo CTA

In `app/(influencer)/inquiries.tsx`, add below the existing stub content:

```tsx
<Pressable
  style={styles.demoCta}
  onPress={() => router.push('/inquiries/demo-thread?viewerRole=influencer')}
>
  <Text style={styles.demoCtaText}>View example thread</Text>
</Pressable>
```

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `app/inquiries/[threadId].tsx` | Main thread screen route |
| `components/thread/TopBar.tsx` | Back + counterpart header |
| `components/thread/DealContextCard.tsx` | Collapsible deal summary |
| `components/thread/MessageList.tsx` | Message container |
| `components/thread/SystemMessage.tsx` | System event pill |
| `components/thread/MessageBubble.tsx` | Text/attachment bubble |
| `components/thread/ImageAttachment.tsx` | Image attachment tile |
| `components/thread/HandoffOfferCard.tsx` | Pending handoff state |
| `components/thread/HandoffAcceptedCard.tsx` | Accepted handoff with CTA |
| `components/thread/TemplateChips.tsx` | Quick-reply chips |
| `components/thread/InputBar.tsx` | Compose + send bar |
| `components/thread/index.ts` | Barrel export |
| `constants/mockThread.ts` | Mock thread data |
| `types/thread.ts` | Thread type definitions |

### Modified Files
| File | Change |
|------|--------|
| `app/(influencer)/inquiries.tsx` | Add demo CTA button |
| `components/business/inquiries/InquiriesScreen.tsx` | Wire onPress to navigate |

---

## Type Safety Checklist

- [ ] All new types exported from `types/thread.ts`
- [ ] `ViewerRole` imported from `lib/dealLifecycle.ts`
- [ ] All components properly typed with interfaces
- [ ] `npx tsc --noEmit` passes before commit

---

## Testing Strategy

1. Navigate from Business Inquiries -> Thread -> Back
2. Navigate from Influencer stub demo CTA -> Thread -> Back
3. Send message via input bar
4. Send message via template chip
5. Trigger WhatsApp handoff and verify pending/accepted states
6. Verify bubble alignment based on viewer role
7. Verify correct template chips per role
