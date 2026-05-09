/**
 * Hunter Dashboard Type Definitions
 * Types for the hunter (business) dashboard data shapes.
 */

export interface Hunter {
  name: string;
  firstName: string;
  monogram: string;
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

export type DealStatus = 'in_progress' | 'waiting' | 'rate_now' | 'completed';

export interface Deal {
  id: string;
  talent: DealTalent;
  services: string;
  total: number;
  status: DealStatus;
  statusLabel: string;
  statusAccent: boolean;
  timeLabel: string;
}

export interface Perk {
  id: string;
  title: string;
  claimed: number;
  max: number;
  expires: string;
}

export interface HunterStats {
  activeDeals: number;
  bookingValue: number;
  perksClaimed: number;
}

export interface HunterDashboardData {
  hunter: Hunter;
  attentionItems: AttentionItem[];
  deals: Deal[];
  perks: Perk[];
  stats: HunterStats;
}
