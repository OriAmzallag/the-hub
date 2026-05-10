/**
 * Business Dashboard Screen
 * Main dashboard for business users.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Gift } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { MOCK_BUSINESS_DASHBOARD } from '@/constants/mockBusinessDashboard';
import { isActiveOnDashboard } from '@/lib/dealLifecycle';

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

  // Filter deals to only show active-on-dashboard states for Business role
  const activeDeals = deals.filter((deal) =>
    isActiveOnDashboard(deal.state, 'BUSINESS')
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
                // TODO: Handle attention item tap
              }}
            />
          </View>
        )}

        {/* Active Deals Section */}
        <View style={styles.section}>
          <SectionHeader title="Active deals" count={activeDeals.length} />
          <View style={styles.dealsList}>
            {activeDeals.map((deal) => (
              <DealRow
                key={deal.id}
                deal={deal}
                onPress={() => {
                  // TODO: Navigate to deal detail
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
              label="Find talent"
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
                // TODO: Navigate to perk creation
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
