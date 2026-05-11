/**
 * Influencer Storefront Screen
 * Public profile view for businesses to evaluate influencer before booking.
 *
 * Route: /influencer/[id]
 * Entry: InfluencerCard tap from Discover, or deep link (future)
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { getInfluencerStorefront } from '@/constants/mockInfluencerStorefront';
import {
  TopBar,
  HeroCarousel,
  HeaderBlock,
  BentoStats,
  ServicesList,
  ReviewsPreview,
  StickyCTA,
  PreviewBanner,
} from '@/components/influencer/storefront';
import { BookingRequestSheet } from '@/components/influencer/booking';
import type { DateChipId, RequestState } from '@/types/booking';

export default function InfluencerStorefrontScreen() {
  const router = useRouter();
  const { id, preview } = useLocalSearchParams<{ id: string; preview?: string }>();
  const insets = useSafeAreaInsets();

  // Preview mode: influencer is viewing their own storefront via
  // "See as a Business sees you". Booking is disabled — no service
  // selection, no sticky CTA, no booking sheet.
  const isPreview = preview === '1';

  // Fetch influencer data (mock for now - always returns Maya)
  // TODO: Fetch influencer by id from Supabase
  const influencer = getInfluencerStorefront(id || '');

  // Local state
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  // Booking sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [pickedDateChip, setPickedDateChip] = useState<DateChipId | null>(null);
  const [brief, setBrief] = useState('');
  const [budgetConfirmed, setBudgetConfirmed] = useState(false);

  // Scroll tracking for TopBar animation
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Selected services for CTA
  const selectedServices = useMemo(() => {
    return influencer.services.filter((s) => selectedServiceIds.includes(s.id));
  }, [influencer.services, selectedServiceIds]);

  // Toggle service selection — no-op in preview mode.
  const toggleService = (id: number) => {
    if (isPreview) return;
    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  // Navigation handlers
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(business)/discover');
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('TODO: Share profile', influencer.handle);
  };

  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
    // TODO: Persist favorite state
  };

  const handleSeeAllReviews = () => {
    // TODO: Navigate to full reviews list
    console.log('TODO: Navigate to reviews list');
  };

  // Booking sheet handlers
  const handleOpenSheet = () => {
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    // Reset form state for next open
    setRequestState('idle');
    setPickedDateChip(null);
    setBrief('');
    setBudgetConfirmed(false);
  };

  const handleSubmit = () => {
    setRequestState('submitted');
  };

  const handleRemoveService = (serviceId: number) => {
    setSelectedServiceIds((prev) => prev.filter((x) => x !== serviceId));
  };

  const handleViewStatus = () => {
    // TODO: Navigate to request status (route doesn't exist yet)
    console.log('TODO: Navigate to request status');
    handleCloseSheet();
  };

  const handleBriefChange = (text: string) => {
    // Hard clip to 300 characters (handles paste)
    setBrief(text.slice(0, 300));
  };

  // Extract first name for the sheet
  const influencerFirstName = influencer.name.split(' ')[0];

  // Calculate content padding for sticky CTA
  const ctaHeight = 80 + insets.bottom;

  return (
    <View style={styles.container}>
      {/* Sticky TopBar */}
      <TopBar
        scrollY={scrollY}
        influencerName={influencer.name}
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
        {/* Hero carousel */}
        <HeroCarousel images={influencer.portfolio} />

        {/* Header block: status, name, categories, bio */}
        <HeaderBlock
          name={influencer.name}
          location={influencer.location}
          available={influencer.available}
          verified={influencer.verified}
          categories={influencer.categories}
          bio={influencer.bio}
        />

        {/* Bento stats grid + platforms */}
        <BentoStats
          reach={influencer.reach}
          rating={influencer.rating}
          reviewCount={influencer.reviewCount}
          platforms={influencer.platforms}
        />

        {/* Services list */}
        <ServicesList
          services={influencer.services}
          selectedIds={selectedServiceIds}
          onToggle={toggleService}
        />

        {/* Reviews preview */}
        {influencer.reviewsPreview.length > 0 && (
          <ReviewsPreview
            reviews={influencer.reviewsPreview}
            onSeeAllPress={handleSeeAllReviews}
          />
        )}
      </Animated.ScrollView>

      {/* Bottom chrome: preview banner for the influencer's own view,
          sticky CTA + booking sheet for real (business) visitors. */}
      {isPreview ? (
        <PreviewBanner onDone={handleBack} />
      ) : (
        <>
          <StickyCTA
            selectedServices={selectedServices}
            onRequestBooking={handleOpenSheet}
          />

          <BookingRequestSheet
            isOpen={sheetOpen}
            onClose={handleCloseSheet}
            influencerName={influencer.name}
            influencerFirstName={influencerFirstName}
            selectedServices={selectedServices}
            onRemoveService={handleRemoveService}
            requestState={requestState}
            onSubmit={handleSubmit}
            onViewStatus={handleViewStatus}
            pickedDateChip={pickedDateChip}
            onPickDateChip={setPickedDateChip}
            brief={brief}
            onBriefChange={handleBriefChange}
            budgetConfirmed={budgetConfirmed}
            onBudgetConfirmChange={setBudgetConfirmed}
          />
        </>
      )}
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
});
