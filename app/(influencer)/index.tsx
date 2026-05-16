/**
 * Influencer Dashboard Screen
 * Main dashboard for influencer users.
 *
 * Structure (top to bottom):
 * 1. Top bar (greeting + name)
 * 2. Hero earnings card
 * 3. Needs your attention
 * 4. All deals
 * 5. Quick actions
 * 6. Active claims
 * 7. Overview
 * 8. Tab bar (handled by layout)
 *
 * Mark Done integration:
 *   - IN_PROGRESS deal cards show inline "Mark deal as done" strip
 *   - Strip tap opens MarkDoneSheet directly (card body still goes to thread)
 *   - On confirm: deal moves to attention section with RATE NOW caption
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gift, Edit3 } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { MAYA_DASHBOARD } from '@/constants/mockInfluencerDashboard';
import { getDealCaption, isActiveOnDashboard } from '@/lib/dealLifecycle';
import type { InfluencerDeal } from '@/types/influencerDashboard';

// Mark Done components
import { MarkDoneSheet, MarkDoneToast } from '@/components/mark-done';

// Influencer-specific components
import {
  InfluencerTopBar,
  EarningsCard,
  InfluencerAttentionItem,
  InfluencerDealRow,
  PerkClaimRow,
} from '@/components/influencer/dashboard';

// Reused from Business Dashboard
import { SectionHeader } from '@/components/business/SectionHeader';
import { ActionTile } from '@/components/business/ActionTile';
import { StatTile } from '@/components/business/StatTile';

export default function InfluencerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Local copy of dashboard data for state mutations
  const [dashboardData, setDashboardData] = useState(MAYA_DASHBOARD);
  const {
    influencer,
    earnings,
    deals,
    perkClaims,
    stats,
  } = dashboardData;

  // Mark Done sheet state
  const [markDoneSheetOpen, setMarkDoneSheetOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<InfluencerDeal | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Derive attention items from deals (COMPLETED where influencer needs to rate)
  const attentionItems = deals
    .filter((deal) => {
      const caption = getDealCaption(deal, 'influencer');
      return caption.actionable && isActiveOnDashboard(deal.state, 'influencer');
    })
    .map((deal) => ({
      id: `att-${deal.id}`,
      state: deal.state,
      title: deal.business.name,
      monogram: deal.business.monogram,
      hoursLeft: deal.hoursLeft,
      completedSubstate: deal.completedSubstate,
    }));

  // "All deals" = on-dashboard states that are NOT actionable for this
  // viewer. Actionable deals belong in "Needs your attention" only, and a
  // single deal must never appear in both sections.
  const activeDeals = deals.filter(
    (deal) =>
      isActiveOnDashboard(deal.state, 'influencer') &&
      !getDealCaption(deal, 'influencer').actionable
  );

  /**
   * Handle Mark Done strip tap from deal card
   */
  const handleMarkDoneTap = useCallback((deal: InfluencerDeal) => {
    setSelectedDeal(deal);
    setMarkDoneSheetOpen(true);
  }, []);

  /**
   * Handle Mark Done confirm
   * Updates deal state to COMPLETED, which moves it to attention section
   */
  const handleMarkDoneConfirm = useCallback((finalMessage: string | null) => {
    if (!selectedDeal) return;

    // Update the deal state in our local copy
    setDashboardData((prev) => ({
      ...prev,
      deals: prev.deals.map((deal) =>
        deal.id === selectedDeal.id
          ? { ...deal, state: 'COMPLETED' as const, completedSubstate: 'neither-rated' as const }
          : deal
      ),
    }));

    // If there was a final message, it would post to thread.
    // In production this hits the messages API; in dev we drop it
    // since the dashboard doesn't host the thread message log.
    if (__DEV__ && finalMessage) {
      console.log('Final message to post:', finalMessage);
    }

    setMarkDoneSheetOpen(false);
    setSelectedDeal(null);
    setShowToast(true);
  }, [selectedDeal]);

  /**
   * Handle sheet close without confirm
   */
  const handleSheetClose = useCallback(() => {
    setMarkDoneSheetOpen(false);
    setSelectedDeal(null);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <InfluencerTopBar firstName={influencer.firstName} />

      {/* Scrollable Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Earnings Card */}
        <View style={styles.earningsSection}>
          <EarningsCard earnings={earnings} />
        </View>

        {/* Needs your attention */}
        {attentionItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Needs your attention" />
            <View style={styles.attentionList}>
              {attentionItems.map((item) => (
                <InfluencerAttentionItem
                  key={item.id}
                  item={item}
                  onPress={() => {
                    // Attention items are derived from deals via
                    // deriveInfluencerAttentionItems — `att-<dealId>`.
                    // Strip the prefix and route COMPLETED items to
                    // the rating flow. PENDING items will get their
                    // own surface in a later PR.
                    const dealId = item.id.replace(/^att-/, '');
                    if (item.state === 'COMPLETED') {
                      router.push(`/rate/${dealId}?viewerRole=influencer`);
                    } else {
                      console.log('Attention item pressed:', item.id);
                    }
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Active Deals Section */}
        {activeDeals.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="All deals" count={activeDeals.length} />
            <View style={styles.dealsList}>
              {activeDeals.map((deal) => (
                <InfluencerDealRow
                  key={deal.id}
                  deal={deal}
                  onPress={() => {
                    // Navigate to thread
                    // For now, route to the coordination thread if available
                    // The thread will show the Mark Done tile for IN_PROGRESS deals
                    if (deal.state === 'IN_PROGRESS') {
                      // Route to thread - look up thread by deal ID
                      // For mock data, use i-thr-2 for FitBar deal
                      if (deal.business.name === 'FitBar TLV') {
                        router.push('/inquiries/i-thr-2?viewerRole=influencer');
                      } else {
                        console.log('Deal pressed:', deal.id);
                      }
                    } else {
                      const caption = getDealCaption(deal, 'influencer');
                      if (caption.actionable && deal.state === 'COMPLETED') {
                        router.push(`/rate/${deal.id}?viewerRole=influencer`);
                      } else {
                        console.log('Deal pressed:', deal.id);
                      }
                    }
                  }}
                  onMarkDone={() => handleMarkDoneTap(deal)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <SectionHeader title="Quick actions" />
          <View style={styles.actionsGrid}>
            <ActionTile
              icon={<Gift size={18} strokeWidth={2.2} color={colors.bg} />}
              label="Browse perks"
              hint="BARTER"
              primary
              onPress={() => router.push('/(influencer)/discover')}
            />
            <ActionTile
              icon={<Edit3 size={18} strokeWidth={2.2} color={colors.ink} />}
              label="Edit storefront"
              hint="PROFILE"
              onPress={() => router.push('/influencer/storefront/edit')}
            />
          </View>
        </View>

        {/* Active Claims Section */}
        {perkClaims.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Active claims"
              actionLabel="SEE ALL"
              onAction={() => {
                // TODO: Navigate to all claims
                console.log('Navigate to All claims');
              }}
            />
            <View style={styles.claimsList}>
              {perkClaims.map((claim) => (
                <PerkClaimRow
                  key={claim.id}
                  claim={claim}
                  onPress={() => {
                    // TODO: Navigate to claim detail
                    console.log('Claim pressed:', claim.id);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Overview (Stats) Section */}
        <View style={styles.statsSection}>
          <SectionHeader title="Overview" />
          <View style={styles.statsGrid}>
            <StatTile label="Active" value={stats.activeDeals} />
            <StatTile label="Rating" value={stats.rating} starred />
            <StatTile
              label="This month"
              value={stats.thisMonthCount}
              hint="DEALS"
            />
          </View>
        </View>
      </ScrollView>

      {/* Mark Done Sheet */}
      <MarkDoneSheet
        isOpen={markDoneSheetOpen}
        onClose={handleSheetClose}
        onConfirm={handleMarkDoneConfirm}
        businessName={selectedDeal?.business.name || 'the business'}
      />

      {/* Mark Done Toast */}
      <MarkDoneToast
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Room for tab bar
  },
  earningsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  attentionList: {
    gap: 8,
  },
  dealsList: {
    gap: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  claimsList: {
    gap: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
});
