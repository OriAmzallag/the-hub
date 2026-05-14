/**
 * CoordinationCTA Component
 * "Open archived thread" CTA for Deal Summary.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MessageCircle, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { ArchivedDeal } from '@/types/dealArchive';

interface CoordinationCTAProps {
  deal: ArchivedDeal;
  onPress: () => void;
}

export function CoordinationCTA({ deal, onPress }: CoordinationCTAProps) {
  const hasMessages = deal.messageCount > 0;

  // For EXPIRED + DECLINED with no messages, show empty state
  if (!hasMessages && (deal.state === 'EXPIRED' || deal.state === 'DECLINED')) {
    const emptyText =
      deal.state === 'EXPIRED'
        ? 'No messages exchanged. The request expired before a conversation started.'
        : 'No messages exchanged. The request was declined right away.';

    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>COORDINATION</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>COORDINATION</Text>
      <Pressable
        style={styles.card}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open archived thread with ${deal.messageCount} messages`}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MessageCircle size={20} strokeWidth={2} color={colors.accent} />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Open archived thread</Text>
          <Text style={styles.subtitle}>
            READ-ONLY · {deal.messageCount} MESSAGES
          </Text>
        </View>

        {/* Arrow */}
        <ArrowRight size={16} strokeWidth={2.5} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.3625, // -0.025em
    lineHeight: 16,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62, // 0.18em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
});
