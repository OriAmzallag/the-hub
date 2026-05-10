/**
 * Booking Date Chips
 * Predefined date options for the booking request sheet.
 */

import type { DateChip } from '@/types/booking';

/**
 * Date chips for the "When" section.
 * Week ranges are computed relative to May 10, 2026 (mock date for MVP).
 */
export const DATE_CHIPS: DateChip[] = [
  { id: 'this', label: 'This week', days: 'May 10 – May 17' },
  { id: 'next', label: 'Next week', days: 'May 17 – May 24' },
  { id: 'two', label: 'In 2 weeks', days: 'May 24 – May 31' },
  { id: 'pick', label: 'Pick a date', days: null },
];

/**
 * Maximum character count for the brief field
 */
export const MAX_BRIEF_LENGTH = 300;
