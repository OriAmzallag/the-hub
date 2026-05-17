/**
 * Shared Influencer Deal Store
 *
 * Module-level mutable store + pub-sub so the Coordination Thread and the
 * Influencer Dashboard read from a single source of truth for deal state
 * transitions. Without this, marking done from the thread would not be
 * visible on the dashboard (and vice versa), since each screen would hold
 * its own local copy of the mock data.
 *
 * This is a v1 mock-data bridge. In production both screens will read
 * (and update) the same Supabase row by primary key.
 *
 * Scope: Influencer-side deals only. Mark Done is an Influencer-only
 * action per project_mark_done_decisions; the Business dashboard does not
 * subscribe.
 */

import { useSyncExternalStore } from 'react';
import { MAYA_DASHBOARD } from '@/constants/mockInfluencerDashboard';
import type { InfluencerDeal } from '@/types/influencerDashboard';

// Seed from the canonical dashboard fixture. The store owns the array
// reference from this point forward; consumers must not mutate it.
let deals: readonly InfluencerDeal[] = MAYA_DASHBOARD.deals;

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Subscribe to deal-state changes. Returns an unsubscribe function.
 * Use `useDeals` from React; this primitive is for tests / non-React.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Snapshot of all influencer deals. Identity changes on every update. */
export function getDealsSnapshot(): readonly InfluencerDeal[] {
  return deals;
}

/**
 * Move a deal from IN_PROGRESS → COMPLETED (sub-state: neither-rated).
 * This is the only producer of the transition per locked spec — both
 * entry points (thread tile + dashboard strip) route through here.
 *
 * Idempotent: calling on a deal already past IN_PROGRESS is a no-op
 * (matches the irreversibility decision — there is no way to "re-do"
 * the transition).
 */
export function markDealDone(dealId: string): void {
  let mutated = false;
  const next = deals.map((deal) => {
    if (deal.id !== dealId) return deal;
    if (deal.state !== 'IN_PROGRESS') return deal;
    mutated = true;
    return {
      ...deal,
      state: 'COMPLETED' as const,
      completedSubstate: 'neither-rated' as const,
    };
  });
  if (mutated) {
    deals = next;
    notify();
  }
}

/**
 * React hook that subscribes to the deal store and re-renders on change.
 */
export function useDeals(): readonly InfluencerDeal[] {
  return useSyncExternalStore(subscribe, getDealsSnapshot, getDealsSnapshot);
}
