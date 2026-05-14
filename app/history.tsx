/**
 * Deal History Route
 * Lists terminal-state deals filtered by tab.
 *
 * Route: /history?viewerRole={role}
 * Shared between business and influencer personas.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';
import { dealArchiveService } from '@/services/dealArchive';
import {
  HistoryHero,
  FilterTabs,
  HistoryRow,
  EmptyState,
} from '@/components/deal-archive';
import type { ArchivedDeal, HistoryTab, HistoryCounts } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

/**
 * Mock viewer context.
 * In production, this comes from auth context.
 */
function getMockViewerId(role: ViewerRole): string {
  return role === 'influencer' ? 'maya-001' : 'avi-001';
}

export default function HistoryScreen() {
  const { viewerRole: viewerRoleParam } = useLocalSearchParams<{
    viewerRole?: ViewerRole;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const viewerRole: ViewerRole =
    viewerRoleParam === 'influencer' ? 'influencer' : 'business';
  const viewerId = getMockViewerId(viewerRole);

  const [activeTab, setActiveTab] = useState<HistoryTab>('completed');
  // All three tabs are fetched once on mount and cached here.
  // Tab switching reads from the cache — no service round-trip, no
  // loading state after the initial load.
  const [dealsByTab, setDealsByTab] =
    useState<Record<HistoryTab, ArchivedDeal[]> | null>(null);
  const [counts, setCounts] = useState<HistoryCounts>({
    completed: 0,
    declined: 0,
    expired: 0,
  });

  useEffect(() => {
    loadHistory();
    loadCounts();
  }, []);

  async function loadCounts() {
    try {
      const historyCounts = await dealArchiveService.getHistoryCounts(
        viewerId,
        viewerRole
      );
      setCounts(historyCounts);
    } catch (err) {
      if (__DEV__) {
        console.error('Failed to load history counts:', err);
      }
    }
  }

  async function loadHistory() {
    try {
      const [completed, declined, expired] = await Promise.all([
        dealArchiveService.getHistory(viewerId, viewerRole, 'completed'),
        dealArchiveService.getHistory(viewerId, viewerRole, 'declined'),
        dealArchiveService.getHistory(viewerId, viewerRole, 'expired'),
      ]);
      setDealsByTab({ completed, declined, expired });
    } catch (err) {
      if (__DEV__) {
        console.error('Failed to load history:', err);
      }
    }
  }

  const deals = dealsByTab?.[activeTab] ?? [];
  const isLoading = dealsByTab === null;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(viewerRole === 'business' ? '/(business)/profile' : '/(influencer)/profile');
    }
  }

  function handleDealPress(dealId: string) {
    router.push({
      pathname: '/deals/[dealId]/summary',
      params: { dealId, viewerRole },
    });
  }

  const totalCount = counts.completed + counts.declined + counts.expired;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Deal history" onBack={handleBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <HistoryHero totalCount={totalCount} />

        {/* Filter tabs */}
        <FilterTabs
          activeTab={activeTab}
          counts={counts}
          onTabChange={setActiveTab}
        />

        {/* Deal list */}
        {isLoading ? (
          <View style={styles.loadingContainer} />
        ) : deals.length === 0 ? (
          <EmptyState tab={activeTab} viewerRole={viewerRole} />
        ) : (
          <View style={styles.dealList}>
            {deals.map((deal) => (
              <HistoryRow
                key={deal.id}
                deal={deal}
                viewerRole={viewerRole}
                onPress={() => handleDealPress(deal.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    height: 200,
  },
  dealList: {
    gap: 8,
  },
});
