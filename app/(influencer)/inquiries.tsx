/**
 * Influencer Inquiries (stub with demo CTA)
 *
 * Placeholder. Real Inquiries surface will mirror the Business
 * Inquiries pattern (search + threaded list) once incoming requests
 * are wired up.
 *
 * For MVP, includes a "View example thread" CTA so the Inquiry Thread
 * screen is reachable from the Influencer side.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';

export default function InfluencerInquiriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleViewExampleThread = () => {
    router.push('/inquiries/demo-thread?viewerRole=influencer');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Inquiries" />
      <View style={[styles.body, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.iconTile}>
          <MessageSquare size={28} color={colors.accent} strokeWidth={1.8} />
        </View>
        <Text style={styles.caption}>COMING SOON</Text>
        <Text style={styles.headline}>Booking requests</Text>
        <Text style={styles.subtext}>
          Incoming briefs from businesses will appear here. Respond to keep
          deals moving.
        </Text>

        {/* Demo CTA */}
        <Pressable
          style={styles.demoCta}
          onPress={handleViewExampleThread}
          accessibilityRole="button"
          accessibilityLabel="View example thread"
        >
          <Text style={styles.demoCtaText}>View example thread</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  caption: {
    ...typography.monoStatusWide,
    color: colors.accent,
    marginBottom: 12,
  },
  headline: {
    ...typography.sectionTitle,
    color: colors.ink,
    marginBottom: 8,
  },
  subtext: {
    ...typography.bodyPreview,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  demoCta: {
    marginTop: 28,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  demoCtaText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
