# Inquiry Thread Screen - Requirements

**Feature**: Inquiry Thread (Conversation/Chat Screen)  
**Status**: In Progress  
**Date**: 2026-05-11  
**PM**: AI Agent

---

## Overview

The Inquiry Thread screen is a shared conversation/chat view that opens when a user taps a thread from their Inquiries tab. It is the **same screen for both personas** (Business and Influencer) - the viewer role determines:
- Which bubbles align right (current user) vs. left (counterpart)
- Whose name + avatar shows in the top bar (the counterpart)
- Which template chip set appears at the bottom

---

## User Stories

### US-1: View Thread Conversation
**As a** Business or Influencer user  
**I want to** tap a thread from my Inquiries list and see the full conversation  
**So that** I can read all messages exchanged with my counterpart

**Acceptance Criteria**:
- Tapping a ThreadRow navigates to `/inquiries/[threadId]`
- Messages display chronologically (oldest first)
- System messages (e.g., "Deal accepted") display as centered pills
- My messages align right; counterpart messages align left
- Top bar shows counterpart's name and avatar/monogram

### US-2: Send Messages
**As a** Business or Influencer user  
**I want to** compose and send text messages  
**So that** I can communicate with my counterpart

**Acceptance Criteria**:
- Input bar at bottom with text field and send button
- Send button disabled when draft is empty
- Send button enabled with accent glow when draft has content
- Sent messages appear immediately with "sent" indicator (gray checkmarks)
- Read receipt shows accent-colored checkmarks when counterpart has read

### US-3: Use Quick-Reply Templates
**As a** Business or Influencer user  
**I want to** tap template chips for common responses  
**So that** I can respond quickly without typing

**Acceptance Criteria**:
- Horizontal scrollable template chips above input bar
- Tapping a non-handoff chip sends that text as a message
- Templates are role-specific:
  - **Influencer**: "Confirmed", "Drafts ready", "All delivered", "Let's hop on WhatsApp"
  - **Business**: "Got it", "When can you start?", "Send the draft", "Let's hop on WhatsApp"

### US-4: WhatsApp Handoff Flow
**As a** Business or Influencer user  
**I want to** propose moving the conversation to WhatsApp  
**So that** we can communicate more freely off-platform

**Acceptance Criteria**:
- Tapping "Let's hop on WhatsApp" chip triggers handoff offer
- HandoffOfferCard appears showing "You suggested WhatsApp" with pending state
- When counterpart accepts, HandoffAcceptedCard appears with WhatsApp CTA
- CTA links to `wa.me/<counterpart_phone>` to open WhatsApp

### US-5: View Deal Context
**As a** Business or Influencer user  
**I want to** see the deal context (status, services, total, dates)  
**So that** I remember what we're discussing without leaving the thread

**Acceptance Criteria**:
- Collapsible DealContextCard at top of message list
- Shows: status pill, service count + total, individual services when expanded
- Date range with calendar icon
- Tappable header to expand/collapse

### US-6: View Attachments (Images)
**As a** Business or Influencer user  
**I want to** see image attachments in the conversation  
**So that** I can view assets shared by my counterpart

**Acceptance Criteria**:
- Image attachments render as tiles with icon + filename + "IMAGE" mono caption
- Same bubble alignment rules as text messages (me = right, them = left)

---

## Entry Points

### Business Entry Point
- **Current state**: Business Inquiries list exists with tappable ThreadRows
- **Action needed**: Wire `onPress` to navigate to `/inquiries/[threadId]`

### Influencer Entry Point
- **Current state**: Influencer Inquiries is a "Coming soon" stub
- **Decision**: **Option (b)** - Add a single "View example thread" demo CTA to the stub
- **Rationale**: 
  - Option (a) - building full Influencer Inquiries list - is scope creep for this feature
  - Option (b) satisfies "both personas can reach it" with minimal code
  - Option (c) - making entire stub tappable - is less clear UX-wise
- **Action needed**: Add accent-bordered CTA button to stub that navigates to a hardcoded demo thread with `viewerRole=influencer`

---

## Routing

**Route**: `/inquiries/[threadId]`

**Placement**: Top-level in `app/` directory (outside tab groups), similar to existing `app/influencer/[id].tsx` pattern.

**Viewer Role Detection** (MVP Mock):
- Accept `viewerRole` as URL search param: `?viewerRole=business|influencer`
- Default to `business` if not specified
- Future: Derive from auth store

---

## Data Model (Mock-First)

### Thread Data
```typescript
interface ThreadDetail {
  id: string;
  deal: Deal;
  messages: Message[];
  handoffState: HandoffState;
  viewerRole: ViewerRole;
}

interface Deal {
  id: string;
  status: DealState;
  business: Party;
  influencer: Party;
  services: Service[];
  total: number;
  dateLabel: string;
  dateRange: string;
  acceptedAt: string;
}

interface Party {
  name: string;
  firstName: string;
  phone: string;
  monogram?: string;  // Business only
  photo?: string;     // Influencer only
  verified?: boolean;
}

interface Message {
  id: string;
  type: 'system' | 'message' | 'handoff-offer' | 'handoff-accepted';
  side?: 'me' | 'them';
  text?: string;
  attachment?: { kind: 'image'; label: string };
  timestamp: string;
  read?: boolean;
}

type HandoffState = null | 'pending' | 'accepted';
```

### Mock Data Location
- `constants/mockThread.ts` - Contains mock thread data keyed by `threadId`
- Use existing deal lifecycle types from `lib/dealLifecycle.ts`

---

## Template Chip Sets

### Influencer Templates
| ID | Label | Action |
|----|-------|--------|
| confirmed | Confirmed | Send as message |
| drafts | Drafts ready | Send as message |
| delivered | All delivered | Send as message |
| whatsapp | Let's hop on WhatsApp | Trigger handoff flow |

### Business Templates
| ID | Label | Action |
|----|-------|--------|
| got-it | Got it | Send as message |
| when-start | When can you start? | Send as message |
| send-draft | Send the draft | Send as message |
| whatsapp | Let's hop on WhatsApp | Trigger handoff flow |

---

## Constraints

1. **Terminology**: Use `business` / `influencer` throughout. Never `hunter` / `talent`.
2. **Design System**: Use only tokens from `constants/theme.ts`. No new colors.
3. **Encoding**: Fix reference artifacts: `a` to correct unicode chars
4. **Type Safety**: `npx tsc --noEmit` must pass
5. **Mock-First**: No Supabase wiring yet
6. **Reuse Existing Components**: `ScreenHeader`, `Avatar`, `getDealCaption()`, etc.

---

## Out of Scope

- Full Influencer Inquiries list (separate feature)
- Real-time message sync (future Supabase integration)
- Push notifications
- File upload functionality (UI only, no actual upload)
- Counterpart accepting handoff (auto-accept in demo only)

---

## Success Metrics

- Both personas can navigate to the thread screen
- Messages display correctly based on viewer role
- Template chips work and are role-specific
- WhatsApp handoff flow completes (demo auto-accept)
- TypeScript compiles without errors
- Design system tokens used throughout (no drift)
