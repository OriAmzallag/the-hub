/**
 * Deal History Route
 * Lists terminal-state deals filtered by tab.
 *
 * Route: /history?viewerRole={role}
 * Shared between business and influencer personas.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/theme';
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
  const [deals, setDeals] = useState<ArchivedDeal[]>([]);
  const [counts, setCounts] = useState<HistoryCounts>({
    completed: 0,
    declined: 0,
    expired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load counts on mount
  useEffect(() => {
    loadCounts();
  }, []);

  // Load deals when tab changes
  useEffect(() => {
    loadDeals();
  }, [activeTab]);

  async function loadCounts() {
    try {
      const historyCounts = await dealArchiveService.getHistoryCounts(
        viewerId,
        viewerRole
      );
      setCounts(historyCounts);
    } catch (err) {
      console.error('Failed to load history counts:', err);
    }
  }

  async function loadDeals() {
    setIsLoading(true);
    try {
      const historyDeals = await dealArchiveService.getHistory(
        viewerId,
        viewerRole,
        activeTab
      );
      setDeals(historyDeals);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  }

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
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} strokeWidth={2.5} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Deal history</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    flex: 1,
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.63, // -0.035em
    lineHeight: 20,
    color: colors.ink,
    textAlign: 'center',
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
