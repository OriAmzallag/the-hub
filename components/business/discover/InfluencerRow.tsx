/**
 * TalentRow Component
 * Section with title, optional subtitle, "See all" button, and horizontal scroll of TalentCards.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { TalentCard } from './TalentCard';
import { getTalentById } from '@/constants/mockBusinessDiscover';
import type { TalentRow as TalentRowType } from '@/constants/mockBusinessDiscover';

interface TalentRowProps {
  row: TalentRowType;
  delayIndex: number;
  onSeeAllPress?: () => void;
  onTalentPress?: (talentId: string) => void;
}

export function TalentRow({
  row,
  delayIndex,
  onSeeAllPress,
  onTalentPress,
}: TalentRowProps) {
  const entering = FadeInUp
    .delay(delayIndex * 50)
    .duration(400)
    .easing(Easing.out(Easing.ease));

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
          onPress={onSeeAllPress}
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
        {row.talentIds.map((talentId) => {
          const talent = getTalentById(talentId);
          if (!talent) return null;
          return (
            <TalentCard
              key={talentId}
              talent={talent}
              onPress={() => onTalentPress?.(talentId)}
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
