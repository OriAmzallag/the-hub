/**
 * Business Dashboard Type Definitions
 * Types for the business dashboard data shapes.
 */

import type { DealState } from '@/lib/dealLifecycle';

export interface Business {
  name: string;
  firstName: string;
}

export interface AttentionItem {
  id: string;
  kind: 'rating-due' | 'payment-pending' | 'review-response';
  title: string;
  subtitle: string;
  cta: string;
  photo: string;
}

export interface DealTalent {
  name: string;
  photo: string;
}

export interface Deal {
  id: string;
  talent: DealTalent;
  services: string;
  total: number;
  /** Canonical deal state from the lifecycle state machine */
  state: DealState;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Whether the business/hunter has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the talent has submitted their rating (only for COMPLETED) */
  talentRated?: boolean;
  /** Human-readable time context (e.g., "Started 4h ago", "Sent yesterday") */
  timeLabel?: string;
}

export interface Perk {
  id: string;
  title: string;
  claimed: number;
  max: number;
  expires: string;
}

export interface BusinessStats {
  activeDeals: number;
  bookingValue: number;
  perksClaimed: number;
}

export interface BusinessDashboardData {
  business: Business;
  attentionItems: AttentionItem[];
  deals: Deal[];
  perks: Perk[];
  stats: BusinessStats;
}
