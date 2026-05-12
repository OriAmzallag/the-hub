/**
 * InfluencerAttentionItem Component
 * Attention card with monogram tile, kind-icon overlay, and optional earnings.
 *
 * Reference spec:
 * - Primary (first): accentSoft bg + accentBorder, accent text on subtitle/earnings/chevron
 * - Default (rest): surface bg + border
 * - Layout:
 *   - Padding: 14/16, radius 14
 *   - Monogram tile: 44x44, radius 12, surfaceAlt bg, borderStrong border
 *   - Kind-icon overlay: 20x20 circle, bottom-right, accent bg, 2px bg border
 *   - Title: display 14.5 weight 700 -0.025em, ink
 *   - Subtitle: mono 9.5 / 0.15em, accent (primary) or inkMuted (default)
 *   - Earnings: display 16 weight 700, ink (optional, right side)
 *   - Chevron: size 18, accent (primary) or inkMuted (default)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, Inbox, Star, Package } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { InfluencerAttentionItem as AttentionItemType, AttentionKind } from '@/types/influencerDashboard';

interface InfluencerAttentionItemProps {
  item: AttentionItemType;
  isPrimary?: boolean;
  onPress?: () => void;
}

function getKindIcon(kind: AttentionKind) {
  switch (kind) {
    case 'new-request':
      return Inbox;
    case 'rate':
      return Star;
    case 'deliver':
      return Package;
    default:
      return Inbox;
  }
}

export function InfluencerAttentionItem({
  item,
  isPrimary = false,
  onPress,
}: InfluencerAttentionItemProps) {
  const KindIcon = getKindIcon(item.kind);
  const subtitleColor = isPrimary ? colors.accent : colors.inkMuted;
  const chevronColor = isPrimary ? colors.accent : colors.inkMuted;

  return (
    <Pressable
      style={[
        styles.container,
        isPrimary ? styles.containerPrimary : styles.containerDefault,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}${item.earnings ? `, ${item.earnings} shekels` : ''}`}
    >
      {/* Monogram tile with kind-icon overlay */}
      <View style={styles.monogramWrapper}>
        <View style={styles.monogramTile}>
          <Text style={styles.monogramText}>{item.monogram}</Text>
        </View>
        <View style={styles.kindIconOverlay}>
          <KindIcon size={10} strokeWidth={2.5} color={colors.bg} />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          {item.subtitle}
        </Text>
      </View>

      {/* Earnings (optional) */}
      {item.earnings !== undefined && (
        <Text style={styles.earnings}>{'₪'}{item.earnings}</Text>
      )}

      {/* Chevron */}
      <ChevronRight size={18} strokeWidth={2.2} color={chevronColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  containerPrimary: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  containerDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Monogram
  monogramWrapper: {
    position: 'relative',
  },
  monogramTile: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  kindIconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.bannerTitle,
    color: colors.ink,
    marginBottom: 3,
  },
  subtitle: {
    ...typography.monoStatus,
    // color is set dynamically
  },

  // Earnings
  earnings: {
    ...typography.rowPrimary,
    color: colors.ink,
  },
});
