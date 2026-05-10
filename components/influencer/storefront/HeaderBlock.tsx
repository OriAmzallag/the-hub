/**
 * HeaderBlock Component
 * Status line, display name, verified badge, categories, and bio.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { colors } from '@/constants/theme';

interface HeaderBlockProps {
  name: string;
  location: string;
  available: boolean;
  verified: boolean;
  categories: string[];
  bio: string | null;
}

export function HeaderBlock({
  name,
  location,
  available,
  verified,
  categories,
  bio,
}: HeaderBlockProps) {
  // Split name for display (e.g., "Maya Cohen" -> "Maya\nCohen.")
  const nameParts = name.split(' ');
  const formattedName = nameParts.length > 1
    ? `${nameParts[0]}\n${nameParts.slice(1).join(' ')}.`
    : `${name}.`;

  return (
    <View style={styles.container}>
      {/* Status line */}
      <View style={styles.statusRow}>
        <PulsingDot size={8} style={styles.pulsingDot} />
        <Text style={styles.statusText}>
          {available ? 'AVAILABLE' : 'UNAVAILABLE'} {'·'} {location.toUpperCase()}
        </Text>
      </View>

      {/* Name + verified badge */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{formattedName}</Text>
        {verified && (
          <View style={styles.verifiedBadge}>
            <CheckCircle2
              size={22}
              fill={colors.accent}
              color={colors.bg}
              strokeWidth={2.5}
            />
          </View>
        )}
      </View>

      {/* Categories */}
      <Text style={styles.categories}>
        {categories.map((c) => c.toUpperCase()).join(' · ')}
      </Text>

      {/* Bio */}
      {bio && <Text style={styles.bio}>{bio}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulsingDot: {
    position: 'relative',
  },
  statusText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.89,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  name: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -2.34,
    lineHeight: 47.84,
    color: colors.ink,
  },
  verifiedBadge: {
    marginLeft: 10,
    marginTop: 6,
  },
  categories: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.89,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginTop: 12,
  },
  bio: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    color: colors.ink,
    opacity: 0.85,
    marginTop: 14,
  },
});
