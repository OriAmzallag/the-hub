/**
 * Booking Request Types
 * Types for the booking request sheet and related flows.
 */

/**
 * Date chip identifiers for the "When" section
 */
export type DateChipId = 'this' | 'next' | 'two' | 'pick';

/**
 * Request state for the booking sheet
 */
export type RequestState = 'idle' | 'submitted';

/**
 * Date chip data structure
 */
export interface DateChip {
  id: DateChipId;
  label: string;
  days: string | null; // null for 'pick' (calendar opens)
}

/**
 * Summary data for the success state
 */
export interface BookingSummary {
  serviceCount: number;
  total: number;
}
