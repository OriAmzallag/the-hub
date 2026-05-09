/**
 * Hunter Dashboard Screen
 * Main dashboard for hunter (business) users.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Gift } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { MOCK_HUNTER_DASHBOARD } from '@/constants/mockHunterDashboard';

// Components
import { TopBar } from '@/components/hunter/TopBar';
import { AttentionBanner } from '@/components/hunter/AttentionBanner';
import { SectionHeader } from '@/components/hunter/SectionHeader';
import { DealRow } from '@/components/hunter/DealRow';
import { ActionTile } from '@/components/hunter/ActionTile';
import { PerkRow } from '@/components/hunter/PerkRow';
import { StatTile } from '@/components/hunter/StatTile';

export default function HunterDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { hunter, attentionItems, deals, perks, stats } = MOCK_HUNTER_DASHBOARD;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <TopBar
        hunter={hunter}
        hasNotifications={true}
        onNotificationPress={() => {
          // TODO: Navigate to notifications
        }}
        onProfilePress={() => {
          // TODO: Navigate to profile
        }}
      />

      {/* Scrollable Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Attention Banner */}
        <AttentionBanner
          items={attentionItems}
          onItemPress={(item) => {
            // TODO: Handle attention item tap
          }}
        />

        {/* Active Deals Section */}
        <View style={styles.section}>
          <SectionHeader title="Active deals" count={deals.length} />
          <View style={styles.dealsList}>
            {deals.map((deal) => (
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
            <StatTile label="Booking value" value={`₪${stats.bookingValue}`} />
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
