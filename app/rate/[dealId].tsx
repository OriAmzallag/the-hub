/**
 * Rating Flow Route
 * Three-screen rating flow triggered from COMPLETED deal cards.
 *
 * Route: /rate/[dealId]
 * Shared between business and influencer personas.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { ratingsService } from '@/services/ratings';
import { RateScreen, SubmittedWaiting, MutualReveal } from '@/components/rating';
import type { RatingDealContext, Rating, RatingInput, StarRating } from '@/types/rating';
import type { ViewerRole } from '@/lib/dealLifecycle';

/**
 * Flow state machine.
 */
type FlowState =
  | { step: 'loading' }
  | { step: 'rate' }
  | { step: 'submitted'; stars: StarRating }
  | { step: 'reveal' };

/**
 * Mock viewer context.
 * In production, this comes from auth context. For dev we accept a
 * `viewerRole` query param from the dashboard so business and
 * influencer flows can both be tried end-to-end against the same
 * mock service.
 */
function getMockViewerContext(role: ViewerRole): { id: string; role: ViewerRole } {
  return role === 'influencer'
    ? { id: 'maya-001', role: 'influencer' }
    : { id: 'avi-001', role: 'business' };
}

export default function RatingFlowScreen() {
  const { dealId, viewerRole: viewerRoleParam } = useLocalSearchParams<{
    dealId: string;
    viewerRole?: ViewerRole;
  }>();
  const router = useRouter();

  const [flowState, setFlowState] = useState<FlowState>({ step: 'loading' });
  const [context, setContext] = useState<RatingDealContext | null>(null);
  const [viewerRating, setViewerRating] = useState<Rating | null>(null);
  const [counterpartyRating, setCounterpartyRating] = useState<Rating | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const viewer = getMockViewerContext(
    viewerRoleParam === 'influencer' ? 'influencer' : 'business'
  );

  // Load deal context on mount
  useEffect(() => {
    if (!dealId) {
      setError('No deal ID provided');
      return;
    }

    loadContext();
  }, [dealId]);

  async function loadContext() {
    try {
      const dealContext = await ratingsService.getDealContext(
        dealId!,
        viewer.id,
        viewer.role
      );

      setContext(dealContext);

      // Determine initial state based on existing ratings
      if (dealContext.viewerRating && dealContext.counterpartyRating) {
        // Both have rated - go to reveal
        setViewerRating(dealContext.viewerRating);
        setCounterpartyRating(dealContext.counterpartyRating);
        setFlowState({ step: 'reveal' });
      } else if (dealContext.viewerRating) {
        // Viewer already rated, waiting for counterparty
        // This shouldn't happen if entry is properly gated, but handle gracefully
        setViewerRating(dealContext.viewerRating);
        setFlowState({ step: 'submitted', stars: dealContext.viewerRating.stars });
      } else {
        // Viewer needs to rate
        // Store counterparty rating if it exists (for immediate reveal after submit)
        if (dealContext.counterpartyRating) {
          setCounterpartyRating(dealContext.counterpartyRating);
        }
        setFlowState({ step: 'rate' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deal');
    }
  }

  async function handleSubmit(input: RatingInput) {
    if (isSubmitting || !context) return;
    setIsSubmitting(true);

    try {
      const result = await ratingsService.submitRating(
        input,
        viewer.id,
        viewer.role
      );

      setViewerRating(result.rating);

      if (result.dealState === 'RATED' || counterpartyRating) {
        // Both have rated - load counterparty rating and go to reveal
        if (!counterpartyRating) {
          const ratings = await ratingsService.getRatings(dealId!, viewer.role);
          setCounterpartyRating(ratings.counterpartyRating);
        }
        setFlowState({ step: 'reveal' });
      } else {
        // Waiting for counterparty
        setFlowState({ step: 'submitted', stars: input.stars });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to appropriate dashboard based on viewer role
      router.replace(viewer.role === 'business' ? '/(business)' : '/(influencer)');
    }
  }

  function handleBackToDashboard() {
    router.replace(viewer.role === 'business' ? '/(business)' : '/(influencer)');
  }

  function handleViewDealSummary() {
    // Navigate to deal summary screen
    router.push({
      pathname: '/deals/[dealId]/summary',
      params: { dealId: dealId!, viewerRole: viewer.role },
    });
  }

  // Loading state — render an empty bg-colored view so the screen
  // transition lands seamlessly when context resolves (the mock
  // service's 150ms delay is short enough that a spinner reads as
  // jitter rather than progress).
  if (flowState.step === 'loading') {
    return <View style={styles.loadingContainer} />;
  }

  // Error state
  if (error || !context) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error ?? 'Deal not found'}</Text>
        <Pressable onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  // Rate screen
  if (flowState.step === 'rate') {
    return (
      <RateScreen
        context={context}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    );
  }

  // Submitted/Waiting screen
  if (flowState.step === 'submitted') {
    return (
      <SubmittedWaiting
        stars={flowState.stars}
        counterpartyFirstName={context.counterparty.firstName}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Mutual Reveal screen
  if (flowState.step === 'reveal' && viewerRating && counterpartyRating) {
    return (
      <MutualReveal
        context={context}
        viewerRating={viewerRating}
        counterpartyRating={counterpartyRating}
        onBack={handleBackToDashboard}
        onViewDealSummary={handleViewDealSummary}
        onClose={handleClose}
      />
    );
  }

  // Fallback — empty bg-colored view (no spinner)
  return <View style={styles.loadingContainer} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
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
});
