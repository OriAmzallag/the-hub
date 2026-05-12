/**
 * ForkStep Component
 * Persona selection: Business or Influencer path.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Building2, Sparkles, Check } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { StepShell } from './StepShell';

interface ForkStepProps {
  selected: 'business' | 'influencer' | null;
  onSelect: (persona: 'business' | 'influencer') => void;
  onBack: () => void;
  onNext: () => void;
}

const PATH_OPTIONS = [
  {
    id: 'business' as const,
    title: 'Business',
    caption: 'POST PERKS · FIND INFLUENCERS',
    Icon: Building2,
  },
  {
    id: 'influencer' as const,
    title: 'Influencer',
    caption: 'CLAIM PERKS · GROW YOUR REACH',
    Icon: Sparkles,
  },
];

export function ForkStep({
  selected,
  onSelect,
  onBack,
  onNext,
}: ForkStepProps) {
  return (
    <StepShell
      title="I'm a..."
      subtitle="Choose how you want to use The Hub."
      canGoBack
      onBack={onBack}
      canContinue={selected !== null}
      onNext={onNext}
    >
      <View style={styles.cards}>
        {PATH_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.Icon;

          return (
            <Pressable
              key={option.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(option.id)}
              accessibilityRole="button"
              accessibilityLabel={`Continue as ${option.title}`}
              accessibilityState={{ selected: isSelected }}
            >
              {/* Icon tile */}
              <View style={styles.iconTile}>
                <Icon size={24} color={colors.accent} />
              </View>

              {/* Text */}
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardCaption}>{option.caption}</Text>
              </View>

              {/* Selector */}
              <View
                style={[styles.selector, isSelected && styles.selectorSelected]}
              >
                {isSelected && (
                  <Check size={13} strokeWidth={3} color={colors.bg} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
  },
  cardSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: radii.avatar,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontFamily: 'InterTight-Bold',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.57, // -0.03em
    color: colors.ink,
  },
  cardCaption: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 6,
  },
  selector: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
