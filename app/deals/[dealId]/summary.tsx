/**
 * Deal Summary Route
 * Comprehensive archive view of a terminal-state deal.
 *
 * Route: /deals/[dealId]/summary?viewerRole={role}
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
  SummaryHero,
  Timeline,
  DealCard,
  RatingsArchiveCard,
  DeclineNote,
  CoordinationCTA,
  BackToHistoryFooter,
} from '@/components/deal-archive';
import type { ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

export default function DealSummaryScreen() {
  const { dealId, viewerRole: viewerRoleParam } = useLocalSearchParams<{
    dealId: string;
    viewerRole?: ViewerRole;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const viewerRole: ViewerRole =
    viewerRoleParam === 'influencer' ? 'influencer' : 'business';

  const [deal, setDeal] = useState<ArchivedDeal | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load deal on mount
  useEffect(() => {
    if (!dealId) {
      setError('No deal ID provided');
      return;
    }
    loadDeal();
  }, [dealId]);

  async function loadDeal() {
    try {
      const archivedDeal = await dealArchiveService.getDeal(dealId!, viewerRole);
      setDeal(archivedDeal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deal');
    }
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/history',
        params: { viewerRole },
      });
    }
  }

  function handleBackToHistory() {
    router.replace({
      pathname: '/history',
      params: { viewerRole },
    });
  }

  function handleOpenThread() {
    // TODO: Navigate to read-only archived thread view when implemented
    // For now, log a TODO as per the Rating Flow pattern
    console.log('TODO: Open archived thread for deal:', dealId);
  }

  // Loading state
  if (!deal && !error) {
    return <View style={styles.loadingContainer} />;
  }

  // Error state
  if (error || !deal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error ?? 'Deal not found'}</Text>
        <Pressable onPress={handleBack} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

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
        <Text style={styles.eyebrow}>DEAL SUMMARY · ARCHIVED</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <SummaryHero deal={deal} viewerRole={viewerRole} />

        {/* Timeline */}
        <Timeline deal={deal} viewerRole={viewerRole} />

        {/* Deal card */}
        <DealCard deal={deal} />

        {/* State-specific block */}
        {deal.state === 'RATED' && (
          <RatingsArchiveCard deal={deal} viewerRole={viewerRole} />
        )}
        {deal.state === 'DECLINED' && <DeclineNote deal={deal} />}
        {/* EXPIRED: nothing displayed - timeline tells the story */}

        {/* Coordination */}
        <CoordinationCTA deal={deal} onPress={handleOpenThread} />
      </ScrollView>

      {/* Sticky footer */}
      <BackToHistoryFooter onPress={handleBackToHistory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.decline,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
  },
  errorButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
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
  eyebrow: {
    flex: 1,
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
