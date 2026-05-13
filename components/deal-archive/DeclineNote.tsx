/**
 * DeclineNote Component
 * Decline note and reason display for Deal Summary (DECLINED state).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import type { ArchivedDeal } from '@/types/dealArchive';

interface DeclineNoteProps {
  deal: ArchivedDeal;
}

export function DeclineNote({ deal }: DeclineNoteProps) {
  if (deal.state !== 'DECLINED') return null;

  const hasNote = Boolean(deal.declineNote);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>DECLINE NOTE</Text>
      <View style={styles.card}>
        <Text style={styles.note}>
          {hasNote ? `"${deal.declineNote}"` : 'No note was added.'}
        </Text>
        {deal.declineReason && (
          <Text style={styles.reason}>REASON: {deal.declineReason}</Text>
        )}
      </View>
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
    color: colors.decline,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.declineSoft,
    borderWidth: 1,
    borderColor: colors.declineBorder,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  note: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 19,
    color: colors.ink,
  },
  reason: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.44, // 0.16em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.decline,
  },
});
