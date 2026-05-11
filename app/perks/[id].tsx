/**
 * Perk Detail Screen
 * Full perk view with deliverables, qualification status, and claim flow.
 *
 * Route: /perks/[id]
 * Entry: PerkCard tap from Discover
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';
import { colors, radii, textScale } from '@/constants/theme';
import { getPerkDetailById, VIEWER_REACH } from '@/constants/mockInfluencerPerks';
import { getOverallQualification } from '@/lib/perkQualification';
import {
  PerkDetailTopBar,
  PerkHero,
  PerkIdentity,
  QualificationBanner,
  PerkStatsRow,
  DeliverableTile,
  DeadlinePill,
  ConfirmSheet,
  ClaimedSuccess,
} from '@/components/influencer/perk-detail';

type ScreenState = 'detail' | 'claimed';

export default function PerkDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  // Fetch perk detail
  const perk = getPerkDetailById(id || '');

  // Screen state
  const [screenState, setScreenState] = useState<ScreenState>('detail');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Scroll tracking for TopBar animation
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Qualification status
  const qualificationStatus = useMemo(() => {
    if (!perk) return 'none';
    // Use Perk-compatible shape for qualification check
    return getOverallQualification(
      {
        id: perk.id,
        title: perk.title,
        business: perk.business.name,
        businessMonogram: perk.business.monogram,
        value: perk.value,
        cover: perk.cover,
        deliverables: perk.deliverables,
        category: perk.category,
        slotsLeft: perk.slotsLeft,
        slotsTotal: perk.slotsTotal,
        badge: perk.badge,
        expiringSoon: perk.expiringSoon,
      },
      VIEWER_REACH
    );
  }, [perk]);

  const canClaim = qualificationStatus === 'full';

  // Navigation handlers
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(influencer)/discover');
    }
  };

  const handleShare = () => {
    console.log('TODO: Share perk', perk?.id);
  };

  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
  };

  // Claim flow handlers
  const handleClaimPress = () => {
    if (canClaim) {
      setConfirmOpen(true);
    }
  };

  const handleConfirmClaim = () => {
    setConfirmOpen(false);
    setScreenState('claimed');
  };

  const handleCancelClaim = () => {
    setConfirmOpen(false);
  };

  const handleOpenInquiry = () => {
    // Navigate to inquiries tab (MVP destination)
    router.push('/(influencer)/inquiries');
  };

  const handleBackToPerks = () => {
    router.replace('/(influencer)/discover');
  };

  // Handle missing perk
  if (!perk) {
    return (
      <View style={[styles.container, styles.notFound]}>
        <Text style={styles.notFoundText}>Perk not found</Text>
        <Pressable style={styles.notFoundButton} onPress={handleBack}>
          <Text style={styles.notFoundButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // Claimed success state
  if (screenState === 'claimed') {
    return (
      <ClaimedSuccess
        perk={perk}
        onOpenInquiry={handleOpenInquiry}
        onBackToPerks={handleBackToPerks}
      />
    );
  }

  // Detail view
  const ctaHeight = 80 + insets.bottom;

  return (
    <View style={styles.container}>
      {/* Sticky TopBar */}
      <PerkDetailTopBar
        scrollY={scrollY}
        perkTitle={perk.title}
        isFavorited={isFavorited}
        onFavoriteToggle={handleFavoriteToggle}
        onBack={handleBack}
        onShare={handleShare}
      />

      {/* Scrollable content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: ctaHeight + 20 },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <PerkHero
          cover={perk.cover}
          value={perk.value}
          badge={perk.badge}
        />

        {/* Identity block */}
        <PerkIdentity
          category={perk.category}
          title={perk.title}
          business={perk.business}
        />

        {/* Qualification banner */}
        <QualificationBanner
          status={qualificationStatus}
          deliverables={perk.deliverables}
          viewerReach={VIEWER_REACH}
        />

        {/* Stats row */}
        <PerkStatsRow
          slotsLeft={perk.slotsLeft}
          slotsTotal={perk.slotsTotal}
          value={perk.value}
          expiresOn={perk.expiresOn}
        />

        {/* Deliverables section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you'll deliver</Text>
          <View style={styles.deliverablesList}>
            {perk.deliverables.map((deliverable, index) => (
              <DeliverableTile
                key={`${deliverable.platform}-${index}`}
                deliverable={deliverable}
                index={index}
                viewerReach={VIEWER_REACH}
              />
            ))}
          </View>
          <DeadlinePill deadline={perk.deadline} />
        </View>

        {/* Description section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The offer</Text>
          <Text style={styles.descriptionText}>{perk.description}</Text>
        </View>
      </Animated.ScrollView>

      {/* Sticky CTA */}
      <View
        style={[
          styles.ctaContainer,
          { paddingBottom: Math.max(insets.bottom, 22) },
        ]}
      >
        {canClaim ? (
          <Pressable style={styles.ctaButton} onPress={handleClaimPress}>
            <Text style={styles.ctaButtonText}>Claim this perk</Text>
            <ArrowRight size={18} strokeWidth={2.5} color={colors.bg} />
          </Pressable>
        ) : (
          <View style={styles.ctaDisabled}>
            <Text style={styles.ctaDisabledText}>
              {qualificationStatus === 'partial'
                ? 'Partial match - Can\'t claim'
                : 'Below threshold - Can\'t claim'}
            </Text>
          </View>
        )}
      </View>

      {/* Confirm sheet */}
      <ConfirmSheet
        isOpen={confirmOpen}
        onClose={handleCancelClaim}
        onConfirm={handleConfirmClaim}
        perk={perk}
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
    // paddingBottom set dynamically for CTA height
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    ...textScale.displayM,
    color: colors.ink,
    marginBottom: 14,
  },
  deliverablesList: {
    gap: 10,
  },
  descriptionText: {
    ...textScale.bodyL,
    color: colors.ink,
  },
  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.bgOverlay94,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
  ctaDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.declineSoft,
    borderWidth: 1,
    borderColor: colors.declineBorder,
    borderRadius: radii.pill,
  },
  ctaDisabledText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.decline,
  },
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    ...textScale.heading,
    color: colors.ink,
    marginBottom: 16,
  },
  notFoundButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  notFoundButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
});
