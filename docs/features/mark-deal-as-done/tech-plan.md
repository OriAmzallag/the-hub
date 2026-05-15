# Mark Deal as Done - Technical Plan

## Architecture Overview

Mark Done introduces three new UI components and modifies four existing surfaces. No backend changes required - mock data mutation for now.

## New Components

### 1. `components/mark-done/MarkDoneTile.tsx`

Thread entry point - sticky tile above message input.

**Props:**
```typescript
interface MarkDoneTileProps {
  onPress: () => void;
}
```

**Behavior:**
- Rendered conditionally: `dealState === 'IN_PROGRESS' && viewerRole === 'influencer'`
- Pressable with scale-down feedback (0.99)
- Fixed copy per spec

### 2. `components/mark-done/MarkDoneSheet.tsx`

Bottom-sheet modal for confirmation.

**Props:**
```typescript
interface MarkDoneSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalMessage: string | null) => void;
  businessName: string;
}
```

**Behavior:**
- Uses existing Modal + Reanimated + GestureHandler pattern from `ConfirmSheet.tsx`
- Pan-down gesture to dismiss
- Manages internal `finalMessage` state
- Calls `onConfirm` with message (or null if empty)

### 3. `components/mark-done/MarkDoneToast.tsx`

Success toast with auto-dismiss.

**Props:**
```typescript
interface MarkDoneToastProps {
  visible: boolean;
  onDismiss: () => void;
}
```

**Behavior:**
- Slides in from top using Reanimated
- Check icon uses spring animation for "pop" effect
- Auto-dismiss timer (3.5s) managed internally
- Blur backdrop via expo-blur

### 4. `components/mark-done/index.ts`

Barrel export for all components.

## Modified Files

### 1. `app/inquiries/[threadId].tsx`

**Changes:**
- Import `MarkDoneTile`, `MarkDoneSheet`, `MarkDoneToast`
- Add state: `showMarkDoneSheet`, `showToast`, `dealState`
- Render `MarkDoneTile` above `InputBar` when conditions met
- Render `MarkDoneSheet` and `MarkDoneToast` at root level
- Handle `onConfirm`: post optional message, post system message, update state, show toast
- Pass `disabled` prop to `InputBar` when deal is COMPLETED

### 2. `components/thread/InputBar.tsx`

**Changes:**
- Add `disabled?: boolean` and `disabledCaption?: string` props
- When disabled: reduce opacity, disable input and button, show caption below

### 3. `components/influencer/dashboard/InfluencerDealRow.tsx`

**Changes:**
- For IN_PROGRESS state: wrap card in container, add bottom accent strip
- Strip is separate Pressable with `onMarkDone` callback
- Card body Pressable calls existing `onPress` (routes to thread)

**New Props:**
```typescript
interface InfluencerDealRowProps {
  deal: InfluencerDeal;
  onPress?: () => void;
  onMarkDone?: () => void;  // NEW
}
```

### 4. `app/(influencer)/index.tsx`

**Changes:**
- Import `MarkDoneSheet`, `MarkDoneToast`
- Add state for sheet/toast visibility and selected deal
- Pass `onMarkDone` to IN_PROGRESS deal rows
- Render sheet and toast at root level
- Handle confirm: update mock data, show toast

### 5. `constants/mockThread.ts`

**Changes:**
- Add helper function to update thread deal state
- Export function for adding messages to thread

### 6. `types/thread.ts`

No changes needed - existing types sufficient.

## Data Flow

```
User taps Mark Done (either entry)
         |
         v
MarkDoneSheet opens
         |
         v
User optionally types message, taps "Mark done"
         |
         v
onConfirm callback fires
         |
         +---> If message: insert as 'me' message to thread
         |
         +---> Insert system message to thread
         |
         +---> Update deal.state to COMPLETED
         |
         +---> Close sheet
         |
         v
MarkDoneToast appears
         |
         v
3.5s later OR user taps X
         |
         v
Toast dismisses
```

## State Management

For MVP, state is managed locally in each screen:
- Thread screen: manages its own `dealState`, `messages`, `showSheet`, `showToast`
- Dashboard screen: manages its own state, triggers re-render via mock data update

In production, this would use:
- Supabase real-time subscriptions for deal state
- Optimistic updates with rollback on error

## Animation Specifications

From `theme.ts` motion tokens:

### Sheet animations
- Backdrop fade: 200ms ease-out
- Sheet slide: 600ms with `motion.easing.sheet` [0.25, 0.1, 0.25, 1]
- Dismiss: 300ms

### Toast animations
- Slide in: 350ms with cubic-bezier(0.32, 0.72, 0, 1)
- Check pop: Spring with overshoot 1.2x, settle to 1.0
- Fade out: 300ms on dismiss

## Testing Considerations

1. **Entry points:** Both tile and strip should open the same sheet
2. **Message insertion order:** Optional message MUST appear before system message
3. **State persistence:** Deal state change persists across navigation
4. **Toast timing:** Exactly 3.5 seconds auto-dismiss
5. **Disabled input:** Cannot type after deal completed

## Dependencies

Existing (no new packages):
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Pan gesture for sheet
- `expo-blur` - Toast backdrop
- `lucide-react-native` - Icons

## File Structure

```
components/
  mark-done/
    MarkDoneTile.tsx
    MarkDoneSheet.tsx
    MarkDoneToast.tsx
    index.ts
```

## Risk Assessment

**Low risk:**
- Follows existing patterns (ConfirmSheet, InputBar)
- No backend changes
- Isolated component structure

**Medium risk:**
- Two entry points must stay in sync
- State update must be atomic (message + system message + state)

**Mitigations:**
- Single `handleMarkDone` function handles all state changes
- Sheet component is reused across both entry points
