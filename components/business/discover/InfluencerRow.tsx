/**
 * InfluencerRow Component
 * Section with title, optional subtitle, "See all" button, and horizontal scroll of InfluencerCards.
 * Updated to route "See all" to the unified See All screen with entry param.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { InfluencerCard } from './InfluencerCard';
import { getInfluencerById } from '@/constants/mockBusinessDiscover';
import type { InfluencerRow as InfluencerRowType } from '@/constants/mockBusinessDiscover';

interface InfluencerRowProps {
  row: InfluencerRowType;
  delayIndex: number;
  onSeeAllPress?: () => void;
  onInfluencerPress?: (influencerId: string) => void;
}

export function InfluencerRow({
  row,
  delayIndex,
  onSeeAllPress,
  onInfluencerPress,
}: InfluencerRowProps) {
  const router = useRouter();

  const entering = FadeInUp
    .delay(delayIndex * 50)
    .duration(400)
    .easing(Easing.out(Easing.ease));

  const handleSeeAll = () => {
    // If custom handler provided, use it; otherwise route to See All
    // with the row's title carried through so the destination header
    // reflects "Top match for FitBar" / "Trending in Tel Aviv" instead
    // of the generic "All talent".
    if (onSeeAllPress) {
      onSeeAllPress();
    } else {
      router.push(
        `/see-all?entry=${row.id}&title=${encodeURIComponent(row.title)}`
      );
    }
  };

  return (
    <Animated.View style={styles.container} entering={entering}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{row.title}</Text>
          {row.subtitle && (
            <Text style={styles.subtitle}>{row.subtitle}</Text>
          )}
        </View>
        <Pressable
          style={styles.seeAllButton}
          onPress={handleSeeAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={`See all ${row.title}`}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <ChevronRight size={12} strokeWidth={2.4} color={colors.inkMuted} />
        </Pressable>
      </View>

      {/* Cards scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {row.influencerIds.map((influencerId) => {
          const influencer = getInfluencerById(influencerId);
          if (!influencer) return null;
          return (
            <InfluencerCard
              key={influencerId}
              influencer={influencer}
              onPress={() => onInfluencerPress?.(influencerId)}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleContainer: {},
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 20,
    letterSpacing: -0.7,
    lineHeight: 22,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    letterSpacing: 1.71,
    textTransform: 'uppercase',
    color: colors.accent,
    marginTop: 5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
