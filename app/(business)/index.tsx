/**
 * Business Dashboard Screen
 * Main dashboard for business users.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Gift } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { MOCK_BUSINESS_DASHBOARD } from '@/constants/mockBusinessDashboard';
import { isActiveOnDashboard, getDealCaption } from '@/lib/dealLifecycle';

// Components
import { TopBar } from '@/components/business/TopBar';
import { AttentionBanner } from '@/components/business/AttentionBanner';
import { SectionHeader } from '@/components/business/SectionHeader';
import { DealRow } from '@/components/business/DealRow';
import { ActionTile } from '@/components/business/ActionTile';
import { PerkRow } from '@/components/business/PerkRow';
import { StatTile } from '@/components/business/StatTile';

export default function BusinessDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { business, attentionItems, deals, perks, stats } = MOCK_BUSINESS_DASHBOARD;

  // "All deals" = on-dashboard states that are NOT actionable for this
  // viewer. Actionable deals belong in "Needs your attention" only, and a
  // single deal must never appear in both sections.
  const activeDeals = deals.filter(
    (deal) =>
      isActiveOnDashboard(deal.state, 'business') &&
      !getDealCaption(deal, 'business').actionable
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <TopBar business={business} />

      {/* Scrollable Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Needs your attention */}
        {attentionItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Needs your attention" />
            <AttentionBanner
              items={attentionItems}
              onItemPress={(item) => {
                // Attention items are derived from deals via
                // deriveAttentionItems — `att-<dealId>`. Strip the
                // prefix and route COMPLETED items to the rating flow.
                const dealId = item.id.replace(/^att-/, '');
                if (item.state === 'COMPLETED') {
                  router.push(`/rate/${dealId}?viewerRole=business`);
                }
              }}
            />
          </View>
        )}

        {/* Active Deals Section */}
        <View style={styles.section}>
          <SectionHeader title="All deals" count={activeDeals.length} />
          <View style={styles.dealsList}>
            {activeDeals.map((deal) => (
              <DealRow
                key={deal.id}
                deal={deal}
                onPress={() => {
                  // Only the rating destination is wired so far —
                  // other states (PENDING / IN_PROGRESS / RATED /
                  // EXPIRED / DECLINED) will get their own surfaces
                  // in later PRs.
                  const caption = getDealCaption(deal, 'business');
                  if (caption.actionable && deal.state === 'COMPLETED') {
                    router.push(`/rate/${deal.id}?viewerRole=business`);
                  }
                }}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <SectionHeader title="Quick actions" />
          <View style={styles.actionsGrid}>
            <ActionTile
              icon={<Search size={18} strokeWidth={2.2} color={colors.bg} />}
              label="Find influencer"
              hint="Browse"
              primary
              onPress={() => {
                // TODO: Navigate to Discover tab
              }}
            />
            <ActionTile
              icon={<Gift size={18} strokeWidth={2.2} color={colors.ink} />}
              label="Post a perk"
              hint="Barter"
              onPress={() => {
                router.push('/perks/new');
              }}
            />
          </View>
        </View>

        {/* Your Perks Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Your perks"
            actionLabel="See all"
            onAction={() => {
              // TODO: Navigate to perks list
            }}
          />
          {perks.map((perk) => (
            <PerkRow
              key={perk.id}
              perk={perk}
              onPress={() => {
                // TODO: Navigate to perk detail
              }}
            />
          ))}
        </View>

        {/* Overview (Stats) Section */}
        <View style={styles.statsSection}>
          <SectionHeader title="Overview" />
          <View style={styles.statsGrid}>
            <StatTile label="Active" value={stats.activeDeals} />
            <StatTile label="Booking value" value={`${'₪'}${stats.bookingValue}`} />
            <StatTile label="Perks claimed" value={stats.perksClaimed} />
          </View>
        </View>
      </ScrollView>
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
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  dealsList: {
    gap: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
});
