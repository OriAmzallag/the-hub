/**
 * PreviewScreen Component
 * Preview what influencers will see. Reuses Perk Detail primitives.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share, Heart, ArrowRight } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { PostPerkFormState } from './types';
import type { PerkDetail, ViewerReach } from '@/types/perk';

// Reuse existing Perk Detail primitives
import {
  PerkHero,
  PerkIdentity,
  PerkStatsRow,
  DeliverableTile,
  DeadlinePill,
} from '@/components/influencer/perk-detail';

// Mock business info for preview (derived from current session)
import { MOCK_BUSINESS_DASHBOARD } from '@/constants/mockBusinessDashboard';

interface PreviewScreenProps {
  formData: PostPerkFormState;
  onEdit: () => void;
  onPublish: () => void;
}

// High reach so all deliverables show as "QUALIFIED" in preview
const PREVIEW_VIEWER_REACH: ViewerReach = {
  IG: 999999999,
  TikTok: 999999999,
  YouTube: 999999999,
};

export function PreviewScreen({
  formData,
  onEdit,
  onPublish,
}: PreviewScreenProps) {
  const insets = useSafeAreaInsets();
  const business = MOCK_BUSINESS_DASHBOARD.business;
  // Derive a 2-letter monogram from the business name for the preview.
  // The dashboard mock only carries name + firstName today.
  const monogram = business.name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

  // Convert form data to PerkDetail shape for primitives
  const perkDetail: PerkDetail = {
    id: 'preview',
    title: formData.title,
    category: formData.categories[0] || 'Lifestyle',
    business: {
      name: business.name,
      monogram,
      verified: true,
      rating: 4.9,
      deals: 42,
      location: 'Tel Aviv',
    },
    value: formData.value || 0,
    cover: formData.coverImage || '',
    deliverables: formData.deliverables.map((d) => ({
      platform: d.platform,
      action: d.action,
      requiredFollowers: d.requiredFollowers,
      description: d.description,
    })),
    deadline: formData.deliveryDeadline || '7 days after claiming',
    description: formData.description,
    slotsLeft: formData.maxClaims || 10,
    slotsTotal: formData.maxClaims || 10,
    expiresOn: formData.expiresOn,
    badge: null,
    expiringSoon: false,
  };

  return (
    <View style={styles.container}>
      {/* Preview banner */}
      <View style={[styles.banner, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.bannerText}>PREVIEW · WHAT INFLUENCERS SEE</Text>
        <Pressable onPress={onEdit}>
          <Text style={styles.backToEdit}>BACK TO EDIT</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero with ghost header chrome */}
        <View style={styles.heroWrapper}>
          <PerkHero
            cover={perkDetail.cover}
            value={perkDetail.value}
            badge={perkDetail.badge}
          />
          {/* Ghost header chrome */}
          <View style={[styles.ghostHeader, { top: 0 }]}>
            <View style={styles.ghostIcon}>
              <ChevronLeft size={24} strokeWidth={2} color={colors.ink} />
            </View>
            <View style={styles.ghostHeaderRight}>
              <View style={styles.ghostIcon}>
                <Share size={20} strokeWidth={2} color={colors.ink} />
              </View>
              <View style={styles.ghostIcon}>
                <Heart size={20} strokeWidth={2} color={colors.ink} />
              </View>
            </View>
          </View>
        </View>

        {/* Identity */}
        <PerkIdentity
          category={perkDetail.category}
          title={perkDetail.title}
          business={perkDetail.business}
        />

        {/* Stats row */}
        <PerkStatsRow
          slotsLeft={perkDetail.slotsLeft}
          slotsTotal={perkDetail.slotsTotal}
          value={perkDetail.value}
          expiresOn={perkDetail.expiresOn}
        />

        {/* What you ask for */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you ask for</Text>
          <View style={styles.deliverablesList}>
            {perkDetail.deliverables.map((deliverable, index) => (
              <DeliverableTile
                key={index}
                deliverable={deliverable}
                index={index}
                viewerReach={PREVIEW_VIEWER_REACH}
              />
            ))}
          </View>
          <DeadlinePill deadline={perkDetail.deadline} />
        </View>

        {/* The offer */}
        {perkDetail.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The offer</Text>
            <Text style={styles.description}>{perkDetail.description}</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 22) },
        ]}
      >
        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.publishButton} onPress={onPublish}>
          <Text style={styles.publishButtonText}>Publish</Text>
          <ArrowRight size={16} strokeWidth={2.5} color={colors.bg} />
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accentSoft,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  bannerText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.35,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  backToEdit: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.35,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroWrapper: {
    position: 'relative',
  },
  ghostHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    pointerEvents: 'none',
  },
  ghostHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ghostIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgOverlay70,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.ink,
    marginBottom: 14,
  },
  deliverablesList: {
    gap: 8,
  },
  description: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21.75,
    letterSpacing: -0.075,
    color: colors.ink,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.bgOverlay94,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  editButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
  publishButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  publishButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
});
