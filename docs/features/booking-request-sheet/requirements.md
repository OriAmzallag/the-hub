# Booking Request Sheet - Product Requirements
Generated: 2026-05-10
Status: APPROVED

## Overview
The Booking Request Sheet is a bottom sheet overlay that appears when a Business taps "Request a booking" on the Influencer Storefront. It allows businesses to configure and submit a booking request to the influencer.

## User Story
**As a** Business user viewing a Influencer's storefront,
**I want to** submit a booking request with my selected services, preferred timing, and project brief,
**So that** the Influencer can review my request and respond with availability.

## Entry Point
- Tap "Request a booking" CTA on the Influencer Storefront (StickyCTA component)
- CTA is only enabled when at least 1 service is selected
- Sheet rises over the storefront (storefront stays dimmed in background, not a route change)

## Core Features

### 1. Services Section
- Displays selected services with numbered badges (01, 02, 03...) in tap order
- Each line item shows: badge, service name, platform/delivery, price, remove button
- User can remove services from within the sheet
- Removing a service renumbers remaining badges (no gaps)
- **Empty state**: When all services removed, show "ALL SERVICES REMOVED - GO BACK TO ADD SOME" in dashed-border container. Submit disabled.

### 2. When Section (Date Selection)
- 2x2 chip grid with 4 options:
  - "This week" (May 10 - May 17)
  - "Next week" (May 17 - May 24)
  - "In 2 weeks" (May 24 - May 31)
  - "Pick a date" (opens calendar - TODO for future PR)
- Single selection required
- "Pick a date" chip just selects (calendar component is out of scope)

### 3. Brief Section
- Multiline text input for project description
- 300 character hard cap (enforced via slice, not soft limit)
- Character counter visible after typing starts
- Counter shows accent color when at 300/300

### 4. Total Section
- Line items showing each selected service name + price
- Total sum displayed prominently
- Budget confirmation checkbox: "I confirm the total budget of [total]"
- Checkbox must be checked to enable submit

### 5. Footer Note
- "{FIRST NAME} RESPONDS WITHIN 72H" mono caption

### 6. Submit Button
- "Send request ->" pill button
- **Enabled when ALL of:**
  - At least 1 service selected
  - Date chip selected
  - Brief has non-empty content (after trim)
  - Budget confirmation checked
- **Disabled state**: surface bg, inkMuted text, no shadow, no press handler

## Success State

After submit, the sheet morphs in place (same sheet, different content):

### Content
- Hero check icon (72px accent circle) with success-pop animation
- "REQUEST SENT" mono label
- "On its way to {first name}." display heading
- "She typically responds within 72 hours..." sub copy
- Summary card: services count + total
- Primary CTA: "View request status ->" (TODO - logs placeholder)
- Secondary CTA: "Back to discovery" - closes sheet

### Behavior During Success State
- Scrim is NOT dismissable (tap does nothing)
- Drag-down is disabled
- Only CTAs close the sheet
- Form state resets when sheet next opens

## Validation Rules

| Field | Rule | Error/Disabled behavior |
|-------|------|------------------------|
| Services | length > 0 | Empty state shown, submit disabled |
| Date chip | !== null | Submit disabled |
| Brief | trim().length > 0 | Submit disabled |
| Budget checkbox | === true | Submit disabled |

## Edge Cases

### 1. All Services Removed
- Show empty state with dashed border
- "ALL SERVICES REMOVED - GO BACK TO ADD SOME"
- User must dismiss sheet and add services on storefront

### 2. Paste Over Character Cap
- Text is hard-clipped to 300 via slice()
- Counter shows "300 / 300" in accent color
- No error toast, just enforcement

### 3. Scrim During Success State
- NOT dismissable - intentional anchor
- User must acknowledge via CTAs

### 4. Mid-Flow Draft Persistence
- **Open question per PRD section 3.4**
- Current implementation: form resets when sheet closes
- Future: may persist draft in local state for session

### 5. Reopening Sheet After Submit
- Form should be reset (empty brief, no chip selected, budget unchecked)
- Services reflect current storefront selection (may have changed)

## Accessibility Requirements
- Close button has accessible label
- Submit button announces disabled state
- Success state semantics for screen readers
- Date chips are selectable via accessibility

## Out of Scope (This PR)
- Calendar picker for "Pick a date"
- Network call on submit (mock only)
- "View request status" navigation (route doesn't exist)
- Draft persistence across sessions

## Success Metrics
- Sheet opens/closes smoothly (420ms rise, 320ms fall)
- Form validation prevents invalid submissions
- Success state provides clear confirmation
- User can easily return to browsing
