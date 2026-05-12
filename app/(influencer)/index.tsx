/**
 * Influencer Dashboard Screen
 * Main dashboard for influencer users.
 *
 * Structure (top to bottom):
 * 1. Top bar (greeting + name)
 * 2. Hero earnings card
 * 3. Needs your attention
 * 4. Active deals
 * 5. Quick actions
 * 6. Active claims
 * 7. Overview
 * 8. Tab bar (handled by layout)
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gift, Edit3 } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { MAYA_DASHBOARD } from '@/constants/mockInfluencerDashboard';

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
  const {
    influencer,
    earnings,
    attentionItems,
    deals,
    perkClaims,
    stats,
  } = MAYA_DASHBOARD;

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
              {attentionItems.map((item, index) => (
                <InfluencerAttentionItem
                  key={item.id}
                  item={item}
                  isPrimary={index === 0}
                  onPress={() => {
                    // TODO: Navigate to deal/request detail
                    console.log('Attention item pressed:', item.id);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Active Deals Section */}
        <View style={styles.section}>
          <SectionHeader title="Active deals" count={deals.length} />
          <View style={styles.dealsList}>
            {deals.map((deal) => (
              <InfluencerDealRow
                key={deal.id}
                deal={deal}
                onPress={() => {
                  // TODO: Navigate to deal detail
                  console.log('Deal pressed:', deal.id);
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
