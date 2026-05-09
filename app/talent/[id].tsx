/**
 * Talent Storefront Screen
 * Public profile view for businesses to evaluate talent before booking.
 *
 * Route: /talent/[id]
 * Entry: TalentCard tap from Discover, or deep link (future)
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
import { getTalentStorefront } from '@/constants/mockTalentStorefront';
import {
  TopBar,
  HeroCarousel,
  HeaderBlock,
  BentoStats,
  ServicesList,
  ReviewsPreview,
  StickyCTA,
} from '@/components/talent/storefront';

export default function TalentStorefrontScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  // Fetch talent data (mock for now - always returns Maya)
  // TODO: Fetch talent by id from Supabase
  const talent = getTalentStorefront(id || '');

  // Local state
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  // Scroll tracking for TopBar animation
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Selected services for CTA
  const selectedServices = useMemo(() => {
    return talent.services.filter((s) => selectedServiceIds.includes(s.id));
  }, [talent.services, selectedServiceIds]);

  // Toggle service selection
  const toggleService = (id: number) => {
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
    console.log('TODO: Share profile', talent.handle);
  };

  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
    // TODO: Persist favorite state
  };

  const handleSeeAllReviews = () => {
    // TODO: Navigate to full reviews list
    console.log('TODO: Navigate to reviews list');
  };

  const handleRequestBooking = () => {
    // TODO: Implement booking request flow
    console.log('TODO: Request booking with services:', selectedServiceIds);
  };

  // Calculate content padding for sticky CTA
  const ctaHeight = 80 + insets.bottom;

  return (
    <View style={styles.container}>
      {/* Sticky TopBar */}
      <TopBar
        scrollY={scrollY}
        talentName={talent.name}
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
        <HeroCarousel images={talent.portfolio} />

        {/* Header block: status, name, categories, bio */}
        <HeaderBlock
          name={talent.name}
          location={talent.location}
          available={talent.available}
          verified={talent.verified}
          categories={talent.categories}
          bio={talent.bio}
        />

        {/* Bento stats grid + platforms */}
        <BentoStats
          reach={talent.reach}
          rating={talent.rating}
          reviewCount={talent.reviewCount}
          platforms={talent.platforms}
        />

        {/* Services list */}
        <ServicesList
          services={talent.services}
          selectedIds={selectedServiceIds}
          onToggle={toggleService}
        />

        {/* Reviews preview */}
        {talent.reviewsPreview.length > 0 && (
          <ReviewsPreview
            reviews={talent.reviewsPreview}
            onSeeAllPress={handleSeeAllReviews}
          />
        )}
      </Animated.ScrollView>

      {/* Sticky CTA bar */}
      <StickyCTA
        selectedServices={selectedServices}
        onRequestBooking={handleRequestBooking}
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
});
