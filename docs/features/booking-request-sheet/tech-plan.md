# Booking Request Sheet - Technical Plan
Generated: 2026-05-10
Status: APPROVED

## Architecture Overview

The Booking Request Sheet is an overlay component rendered within the Talent Storefront screen (`app/talent/[id].tsx`). It follows the same animation and gesture patterns established by `FilterSheet.tsx`.

**Key principle**: This is NOT a separate route. The sheet renders as the last child of the storefront's root View with absolute positioning and high zIndex.

## Component Decomposition

```
components/talent/booking/
  BookingRequestSheet.tsx       # Sheet shell: animation, drag, scrim, state switching
  RequestForm.tsx               # Form content (header, body, sticky submit)
  RequestSuccess.tsx            # Success state content
  ServicesList.tsx              # Selected services with order badges + remove
  ServiceLineItem.tsx           # One row in the services list
  WhenChips.tsx                 # 2x2 date chip grid
  BriefField.tsx                # Multiline TextInput with char counter
  TotalCard.tsx                 # Line items + total + budget checkbox
  SectionHeader.tsx             # Local section header (title + hint)
  index.ts                      # Barrel export

constants/
  bookingDateChips.ts           # The 4 date chips with computed week ranges

types/
  booking.ts                    # DateChipId, RequestState, BookingSummary
```

## File-by-File Plan

### 1. types/booking.ts
```typescript
export type DateChipId = 'this' | 'next' | 'two' | 'pick';
export type RequestState = 'idle' | 'submitted';

export interface DateChip {
  id: DateChipId;
  label: string;
  days: string | null; // null for 'pick' (calendar)
}

export interface BookingSummary {
  serviceCount: number;
  total: number;
}
```

### 2. constants/bookingDateChips.ts
- Export `DATE_CHIPS: DateChip[]` with computed week ranges
- Use static dates for MVP (May 10 as "today")
- Format: "May 10 - May 17" style

### 3. components/talent/booking/BookingRequestSheet.tsx

**Props:**
```typescript
interface BookingRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  talentFirstName: string;
  selectedServices: TalentService[];
  onRemoveService: (id: number) => void;
  requestState: RequestState;
  onSubmit: () => void;
  onViewStatus: () => void;
  // Form state (lifted to storefront)
  pickedDateChip: DateChipId | null;
  onPickDateChip: (id: DateChipId) => void;
  brief: string;
  onBriefChange: (text: string) => void;
  budgetConfirmed: boolean;
  onBudgetConfirmChange: (checked: boolean) => void;
}
```

**Implementation:**
- Follows FilterSheet pattern exactly for animations
- `useSharedValue` for `sheetTranslateY` and `overlayOpacity`
- `useEffect` triggers rise/fall on `isOpen` change
- Pan gesture for drag-down dismiss (DISABLED during success state)
- Scrim Pressable calls `onClose` (DISABLED during success state)
- Renders `RequestForm` or `RequestSuccess` based on `requestState`

**Animation values (match FilterSheet):**
- sheetRise: 420ms, `Easing.bezier(0.32, 0.72, 0, 1)`
- sheetFall: 320ms, same easing
- overlayFade: 300ms, `Easing.out(Easing.ease)`
- Drag threshold: 25% screen height OR velocity > 800

### 4. components/talent/booking/RequestForm.tsx

**Sections rendered:**
1. Header: mono "BOOKING - {NAME}" + display "Request" + close X
2. ScrollView body:
   - Services section (ServicesList)
   - When section (WhenChips)
   - Brief section (BriefField)
   - Total section (TotalCard)
   - Footer note
3. Sticky submit button (absolute positioned at bottom)

**Validation logic:**
```typescript
const isValid = 
  selectedServices.length > 0 &&
  pickedDateChip !== null &&
  brief.trim().length > 0 &&
  budgetConfirmed;
```

### 5. components/talent/booking/RequestSuccess.tsx

**Props:**
- `talentFirstName: string`
- `summary: BookingSummary`
- `onViewStatus: () => void`
- `onBackToDiscovery: () => void`

**Content:**
- Hero check icon with success-pop animation
- Copy stack (mono label, display heading, sub copy)
- Summary card
- Two CTAs

**Success-pop animation:**
```typescript
// Scale: 0.6 -> 1.05 -> 1 over 500ms
// cubic-bezier(0.34, 1.56, 0.64, 1)
withSpring(1, { damping: 12, stiffness: 180 })
// Plus opacity 0 -> 1
```

### 6. components/talent/booking/ServicesList.tsx

**Props:**
- `services: TalentService[]`
- `onRemove: (id: number) => void`

**Behavior:**
- Maps services to `ServiceLineItem` with 1-indexed badges
- Shows empty state when `services.length === 0`

### 7. components/talent/booking/ServiceLineItem.tsx

**Props:**
- `service: TalentService`
- `index: number` (1-based for badge)
- `onRemove: () => void`

**Layout:**
- Badge (24x24 accent circle) | Name + platform/delivery | Price | Remove X

### 8. components/talent/booking/WhenChips.tsx

**Props:**
- `selected: DateChipId | null`
- `onSelect: (id: DateChipId) => void`

**Layout:**
- 2x2 grid, gap 8
- "Pick a date" shows Calendar icon

### 9. components/talent/booking/BriefField.tsx

**Props:**
- `value: string`
- `onChangeText: (text: string) => void`

**Behavior:**
- `maxLength` not used (we slice manually for paste handling)
- `onChangeText` receives `text.slice(0, 300)`
- Counter shows after first character typed
- Counter accent color when at 300

### 10. components/talent/booking/TotalCard.tsx

**Props:**
- `services: TalentService[]`
- `budgetConfirmed: boolean`
- `onBudgetConfirmChange: (checked: boolean) => void`

**Content:**
- Service line items (name + price)
- Divider
- Total row
- Checkbox + label

### 11. components/talent/booking/SectionHeader.tsx

**Props:**
- `title: string`
- `hint?: string`

**Note:** Different from storefront's SectionHeader (no action button, has mono hint). Keep local for now; refactor later if shapes converge.

## State Machinery on Storefront

Add to `app/talent/[id].tsx`:

```typescript
// Sheet visibility
const [sheetOpen, setSheetOpen] = useState(false);

// Request state (idle or submitted)
const [requestState, setRequestState] = useState<RequestState>('idle');

// Form state
const [pickedDateChip, setPickedDateChip] = useState<DateChipId | null>(null);
const [brief, setBrief] = useState('');
const [budgetConfirmed, setBudgetConfirmed] = useState(false);

// Handlers
const handleOpenSheet = () => setSheetOpen(true);

const handleCloseSheet = () => {
  setSheetOpen(false);
  // Reset form state for next open
  setRequestState('idle');
  setPickedDateChip(null);
  setBrief('');
  setBudgetConfirmed(false);
};

const handleSubmit = () => {
  setRequestState('submitted');
};

const handleRemoveService = (id: number) => {
  setSelectedServiceIds(prev => prev.filter(x => x !== id));
};

const handleViewStatus = () => {
  console.log('TODO: Navigate to request status');
  handleCloseSheet();
};
```

**Wire StickyCTA:**
```typescript
<StickyCTA
  selectedServices={selectedServices}
  onRequestBooking={handleOpenSheet}  // Changed from handleRequestBooking
/>
```

**Render sheet:**
```typescript
<BookingRequestSheet
  isOpen={sheetOpen}
  onClose={handleCloseSheet}
  talentName={talent.name}
  talentFirstName={talent.name.split(' ')[0]}
  selectedServices={selectedServices}
  onRemoveService={handleRemoveService}
  requestState={requestState}
  onSubmit={handleSubmit}
  onViewStatus={handleViewStatus}
  pickedDateChip={pickedDateChip}
  onPickDateChip={setPickedDateChip}
  brief={brief}
  onBriefChange={(text) => setBrief(text.slice(0, 300))}
  budgetConfirmed={budgetConfirmed}
  onBudgetConfirmChange={setBudgetConfirmed}
/>
```

## FilterSheet Pattern Reuse

Patterns to copy from `FilterSheet.tsx`:

1. **Animation setup:**
   - `useSharedValue` for translateY and opacity
   - `useEffect` with `withTiming` on `isOpen` change
   - Same easing curves and durations

2. **Drag gesture:**
   - `Gesture.Pan()` with worklet handlers
   - `'worklet'` directive in callbacks
   - `runOnJS(onClose)()` to call React function from worklet
   - Threshold check: `translationY > SCREEN_HEIGHT * 0.25 || velocityY > 800`

3. **Layout:**
   - `StyleSheet.absoluteFill` for overlay
   - Sheet with `position: 'absolute'`, `bottom: 0`
   - zIndex ordering (overlay 60, sheet 70)
   - `borderTopLeftRadius: 22, borderTopRightRadius: 22`

4. **Scrim:**
   - `BlurView` with intensity 4
   - `backgroundColor: 'rgba(0, 0, 0, 0.55)'`
   - `Pressable` covering full area for tap-to-dismiss

## Open Question: Shared BottomSheet Primitive

**Recommendation: DEFER**

We now have two sheets (FilterSheet, BookingRequestSheet) with similar animation patterns. The temptation is to extract a shared `BottomSheet` component.

**Why defer:**
- Two-of-a-kind is too early for abstraction
- The sheets have different body contents and behaviors (FilterSheet has reset/apply footer, BookingRequestSheet has form/success states)
- When a third sheet arrives, we'll have enough data points to design a good abstraction
- Premature abstraction leads to leaky abstractions

**Plan:** When the third bottom sheet is needed, revisit and extract common shell (animation, drag, scrim) into a shared primitive.

## Dependencies

**Existing:**
- `react-native-reanimated` (already installed)
- `react-native-gesture-handler` (already installed)
- `expo-blur` (already installed)
- `lucide-react-native` (already installed)

**No new dependencies required.**

## Testing Considerations

- Worklet boundaries must be correct (`'worklet'` directive where needed)
- `runOnJS` for any React state updates from worklets
- No gesture conflicts between drag handle and ScrollView (handle is separate View)
- Cleanup: no leaked timers when sheet unmounts mid-animation

## Commit Strategy

1. `feat(booking): BookingRequestSheet - form + success states + drag dismiss`
   - All new components in `components/talent/booking/`
   - New types in `types/booking.ts`
   - New constants in `constants/bookingDateChips.ts`

2. `feat(talent-storefront): wire StickyCTA to open BookingRequestSheet`
   - Modifications to `app/talent/[id].tsx`

3. `docs(booking-request-sheet): per-agent specs`
   - All docs in `docs/features/booking-request-sheet/`
