/**
 * NoticeCard Component
 * Explainer card with icon for rating flow screens.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

interface NoticeCardProps {
  icon?: 'clock';
  title?: string;
  children: React.ReactNode;
}

export function NoticeCard({ icon = 'clock', title, children }: NoticeCardProps) {
  const IconComponent = icon === 'clock' ? Clock : Clock;

  return (
    <View style={styles.card}>
      <IconComponent size={16} strokeWidth={2} color={colors.inkMuted} />
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.body}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    ...typography.monoLabel,
    color: colors.inkMuted,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.inkMuted,
  },
});
