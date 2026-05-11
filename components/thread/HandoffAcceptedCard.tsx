/**
 * HandoffAcceptedCard Component
 * Card showing accepted WhatsApp handoff with CTA to open WhatsApp
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors, radii, recipes, shadows } from '@/constants/theme';

interface HandoffAcceptedCardProps {
  counterpartyFirstName: string;
  counterpartyPhone: string;
}

export function HandoffAcceptedCard({
  counterpartyFirstName,
  counterpartyPhone,
}: HandoffAcceptedCardProps) {
  const handleOpenWhatsApp = () => {
    // Format phone for wa.me (remove + if present)
    const cleanPhone = counterpartyPhone.replace(/^\+/, '');
    const url = `https://wa.me/${cleanPhone}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <MessageCircle size={16} color={colors.bg} strokeWidth={2} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Numbers shared</Text>
          <Text style={styles.subtitle}>CONTINUE ON WHATSAPP</Text>
        </View>
      </View>

      {/* Body */}
      <Text style={styles.body}>
        Important commitments still belong here - confirmations, deliverables,
        ratings.
      </Text>

      {/* CTA */}
      <Pressable
        style={styles.cta}
        onPress={handleOpenWhatsApp}
        accessibilityRole="link"
        accessibilityLabel={`Open WhatsApp with ${counterpartyFirstName}`}
      >
        <Text style={styles.ctaText}>
          Open WhatsApp with {counterpartyFirstName}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.card,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 14,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35, // -0.025em
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62, // 0.18em
    color: colors.inkMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 12.5 * 1.5,
    color: colors.inkMuted,
    marginTop: 12,
  },
  cta: {
    ...recipes.primaryButton,
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginTop: 14,
    alignItems: 'center',
    ...shadows.accentGlow,
  },
  ctaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.bg,
  },
});
