/**
 * DealContextCard Component
 * Collapsible card showing deal status, services, total, and date range
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import { colors, typography, radii, motion } from '@/constants/theme';
import { getDealCaption, type ViewerRole } from '@/lib/dealLifecycle';
import type { ThreadDeal } from '@/types/thread';

interface DealContextCardProps {
  deal: ThreadDeal;
  viewerRole: ViewerRole;
}

export function DealContextCard({ deal, viewerRole }: DealContextCardProps) {
  const [expanded, setExpanded] = useState(true);

  // Get status caption using the canonical resolver
  const caption = getDealCaption(deal.status, viewerRole);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  // Animated style for expanded content
  const expandedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded ? 1 : 0, {
        duration: motion.duration.base,
        easing: Easing.bezier(...motion.easing.smooth),
      }),
      height: expanded ? 'auto' : 0,
      overflow: 'hidden',
    };
  }, [expanded]);

  const ChevronIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <View style={styles.container}>
      {/* Header - always visible */}
      <Pressable
        style={styles.header}
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Deal context: ${deal.services.length} services, ${deal.total} total. ${expanded ? 'Collapse' : 'Expand'}`}
      >
        <View style={styles.headerLeft}>
          {/* Status pill */}
          <Text style={styles.status}>{caption.text}</Text>

          {/* Dot separator */}
          <View style={styles.dot} />

          {/* Summary */}
          <Text style={styles.summary}>
            {deal.services.length} services · ₪{deal.total}
          </Text>
        </View>

        <ChevronIcon size={16} color={colors.inkMuted} strokeWidth={2} />
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <Animated.View style={[styles.body, expandedStyle]}>
          <View style={styles.divider} />

          {/* Services list */}
          {deal.services.map((service) => (
            <View key={service.id} style={styles.serviceRow}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>₪{service.price}</Text>
            </View>
          ))}

          {/* Date row */}
          <View style={styles.dateRow}>
            <Calendar size={11} color={colors.inkMuted} strokeWidth={2} />
            <Text style={styles.dateText}>{deal.dateRange.toUpperCase()}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    marginHorizontal: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  status: {
    ...typography.monoStatus,
    color: colors.accent,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.inkSubtle,
    marginHorizontal: 6,
  },
  summary: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.27, // -0.02em
    color: colors.ink,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceName: {
    fontFamily: 'InterTight-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: colors.inkMuted,
  },
  servicePrice: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.27, // -0.02em
    color: colors.ink,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dateText: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
});
