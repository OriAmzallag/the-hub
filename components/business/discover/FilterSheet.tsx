/**
 * FilterSheet Component
 * Bottom sheet with all filter options.
 * v2: New filter sections (content type, audience, language, age, gender),
 *     removed location/radius, updated header subtitle for active state.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import {
  X,
  Star,
  Check,
  Instagram,
  Music2,
  Youtube,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { FilterSection } from './FilterSection';
import {
  CONTENT_TYPES,
  AUDIENCE_TIERS,
  PLATFORMS,
  LANGUAGES,
  AGE_BRACKETS,
  GENDERS,
  SORT_OPTIONS,
} from '@/constants/mockBusinessDiscover';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // Content types
  contentTypes: string[];
  setContentTypes: (value: string[]) => void;
  // Audience tiers
  audienceTiers: string[];
  setAudienceTiers: (value: string[]) => void;
  // Platforms
  platforms: string[];
  setPlatforms: (value: string[]) => void;
  // Price
  priceMin: number;
  setPriceMin: (value: number) => void;
  priceMax: number;
  setPriceMax: (value: number) => void;
  // Availability
  availableOnly: boolean;
  setAvailableOnly: (value: boolean) => void;
  // Rating
  minRating: number;
  setMinRating: (value: number) => void;
  // Languages
  languages: string[];
  setLanguages: (value: string[]) => void;
  // Age brackets
  ageBrackets: string[];
  setAgeBrackets: (value: string[]) => void;
  // Genders
  genders: string[];
  setGenders: (value: string[]) => void;
  // Sort
  sort: string;
  setSort: (value: string) => void;
  // Actions
  onReset: () => void;
  activeCount: number;
}

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Music2,
  Youtube,
  CalendarClock,
};

export function FilterSheet({
  isOpen,
  onClose,
  contentTypes,
  setContentTypes,
  audienceTiers,
  setAudienceTiers,
  platforms,
  setPlatforms,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  availableOnly,
  setAvailableOnly,
  minRating,
  setMinRating,
  languages,
  setLanguages,
  ageBrackets,
  setAgeBrackets,
  genders,
  setGenders,
  sort,
  setSort,
  onReset,
  activeCount,
}: FilterSheetProps) {
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isOpen) {
      overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      sheetTranslateY.value = withTiming(0, {
        duration: 420,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
      });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [isOpen, overlayOpacity, sheetTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const toggleItem = <T extends string>(id: T, list: T[], setList: (value: T[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  // Pan-down to dismiss. Only tracks downward drag; upward is clamped to 0.
  // Closes when the drag passes ~25% of the sheet height OR the user flicks down hard.
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      'worklet';
      const shouldClose = event.translationY > SCREEN_HEIGHT * 0.25 || event.velocityY > 800;
      if (shouldClose) {
        sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        sheetTranslateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.bezier(0.32, 0.72, 0, 1),
        });
      }
    });

  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <BlurView intensity={4} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Drag handle (pan down to dismiss) */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.superTitle}>
                {activeCount > 0 ? `${activeCount} active` : 'Refine your search'}
              </Text>
              <Text style={styles.title}>Filters</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={18} strokeWidth={2.2} color={colors.ink} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* 1. Content type */}
            <FilterSection
              title="Content type"
              hint={contentTypes.length > 0 ? `${contentTypes.length} selected` : undefined}
            >
              <View style={styles.pillGrid}>
                {CONTENT_TYPES.map((type) => {
                  const isActive = contentTypes.includes(type.id);
                  return (
                    <Pressable
                      key={type.id}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => toggleItem(type.id, contentTypes, setContentTypes)}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {type.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 2. Audience size */}
            <FilterSection
              title="Audience size"
              hint={audienceTiers.length > 0 ? `${audienceTiers.length} selected` : undefined}
            >
              <View style={styles.audienceGrid}>
                {AUDIENCE_TIERS.map((tier) => {
                  const isActive = audienceTiers.includes(tier.id);
                  return (
                    <Pressable
                      key={tier.id}
                      style={[styles.audienceCard, isActive && styles.audienceCardActive]}
                      onPress={() => toggleItem(tier.id, audienceTiers, setAudienceTiers)}
                    >
                      <Text style={[styles.audienceLabel, isActive && styles.audienceLabelActive]}>
                        {tier.label}
                      </Text>
                      <Text style={styles.audienceHint}>{tier.hint}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 3. Platform */}
            <FilterSection
              title="Platform"
              hint={platforms.length > 0 ? `${platforms.length} selected` : undefined}
            >
              <View style={styles.platformChips}>
                {PLATFORMS.map((platform) => {
                  const isActive = platforms.includes(platform.id);
                  const Icon = PLATFORM_ICONS[platform.iconName];
                  return (
                    <Pressable
                      key={platform.id}
                      style={[styles.platformChip, isActive && styles.platformChipActive]}
                      onPress={() => toggleItem(platform.id, platforms, setPlatforms)}
                    >
                      <Icon
                        size={13}
                        strokeWidth={2.2}
                        color={isActive ? colors.accent : colors.ink}
                      />
                      <Text style={[styles.platformText, isActive && styles.platformTextActive]}>
                        {platform.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 4. Price range */}
            <FilterSection title="Price range" hint={`₪${priceMin} – ₪${priceMax}`}>
              <View style={styles.priceInputs}>
                <View style={styles.priceCard}>
                  <Text style={styles.priceLabel}>Min</Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceCurrency}>₪</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={String(priceMin)}
                      onChangeText={(text) => setPriceMin(Number(text) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.priceCard}>
                  <Text style={styles.priceLabel}>Max</Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceCurrency}>₪</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={String(priceMax)}
                      onChangeText={(text) => setPriceMax(Number(text) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </FilterSection>

            {/* 5. Availability */}
            <FilterSection title="Availability">
              <Pressable
                style={[styles.availabilityButton, availableOnly && styles.availabilityButtonActive]}
                onPress={() => setAvailableOnly(!availableOnly)}
              >
                <View style={[styles.checkbox, availableOnly && styles.checkboxActive]}>
                  {availableOnly && <Check size={14} strokeWidth={3} color={colors.bg} />}
                </View>
                <Text style={styles.availabilityText}>Available now only</Text>
              </Pressable>
            </FilterSection>

            {/* 6. Minimum rating */}
            <FilterSection
              title="Minimum rating"
              hint={minRating > 0 ? `${minRating}.0 stars or above` : undefined}
            >
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map((stars) => {
                  const isActive = minRating === stars;
                  const isLower = minRating > stars;
                  return (
                    <Pressable
                      key={stars}
                      style={[styles.ratingButton, isActive && styles.ratingButtonActive]}
                      onPress={() => setMinRating(minRating === stars ? 0 : stars)}
                    >
                      <Star
                        size={14}
                        fill={isActive || isLower ? colors.accent : 'transparent'}
                        color={isActive || isLower ? colors.accent : colors.inkMuted}
                        strokeWidth={isActive || isLower ? 0 : 2}
                      />
                      <Text style={[styles.ratingLabel, isActive && styles.ratingLabelActive]}>
                        {stars}+
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 7. Content language */}
            <FilterSection
              title="Content language"
              hint={languages.length > 0 ? `${languages.length} selected` : undefined}
            >
              <View style={styles.pillGrid}>
                {LANGUAGES.map((lang) => {
                  const isActive = languages.includes(lang.id);
                  return (
                    <Pressable
                      key={lang.id}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => toggleItem(lang.id, languages, setLanguages)}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {lang.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 8. Age bracket */}
            <FilterSection
              title="Age bracket"
              hint={ageBrackets.length > 0 ? `${ageBrackets.length} selected` : undefined}
            >
              <View style={styles.ageGrid}>
                {AGE_BRACKETS.map((bracket) => {
                  const isActive = ageBrackets.includes(bracket.id);
                  return (
                    <Pressable
                      key={bracket.id}
                      style={[styles.ageCard, isActive && styles.ageCardActive]}
                      onPress={() => toggleItem(bracket.id, ageBrackets, setAgeBrackets)}
                    >
                      <Text style={[styles.ageLabel, isActive && styles.ageLabelActive]}>
                        {bracket.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 9. Gender */}
            <FilterSection
              title="Gender"
              hint={genders.length > 0 ? `${genders.length} selected` : undefined}
            >
              <View style={styles.pillGrid}>
                {GENDERS.map((gender) => {
                  const isActive = genders.includes(gender.id);
                  return (
                    <Pressable
                      key={gender.id}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => toggleItem(gender.id, genders, setGenders)}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {gender.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 10. Sort by */}
            <FilterSection title="Sort by">
              <View style={styles.sortList}>
                {SORT_OPTIONS.map((option) => {
                  const isActive = sort === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.sortCard, isActive && styles.sortCardActive]}
                      onPress={() => setSort(option.id)}
                    >
                      <Text style={styles.sortText}>{option.label}</Text>
                      {isActive && (
                        <View style={styles.sortIndicator}>
                          <Check size={11} strokeWidth={3} color={colors.bg} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable
              style={[styles.applyButton, Platform.OS === 'ios' && styles.applyButtonShadow]}
              onPress={onClose}
            >
              <Text style={styles.applyButtonText}>Apply filters</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 60,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    maxHeight: '92%',
    zIndex: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  keyboardView: {
    flex: 1,
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  superTitle: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    letterSpacing: -1.04,
    color: colors.ink,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 8,
  },
  // Pill grid (content type, language, gender)
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
  },
  pillActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  pillText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    letterSpacing: -0.13,
    color: colors.ink,
  },
  pillTextActive: {
    color: colors.accent,
  },
  // Audience tier grid (2x2 with hint)
  audienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  audienceCard: {
    width: '48.5%',
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  audienceCardActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  audienceLabel: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
    marginBottom: 4,
  },
  audienceLabelActive: {
    color: colors.accent,
  },
  audienceHint: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    letterSpacing: 1.14, // 0.12em
    color: colors.inkMuted,
  },
  // Age bracket grid (2x2 without hint)
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  ageCard: {
    width: '48.5%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  ageCardActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  ageLabel: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  ageLabelActive: {
    color: colors.accent,
  },
  // Price inputs
  priceInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  priceCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 2,
  },
  priceLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    letterSpacing: 1.62,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceCurrency: {
    fontFamily: 'InterTight-Medium',
    fontSize: 14,
    color: colors.inkMuted,
  },
  priceInput: {
    flex: 1,
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    letterSpacing: -0.4,
    color: colors.ink,
    padding: 0,
  },
  // Platform chips
  platformChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
  },
  platformChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  platformText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    letterSpacing: -0.13,
    color: colors.ink,
  },
  platformTextActive: {
    color: colors.accent,
  },
  // Rating buttons
  ratingButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  ratingButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  ratingButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  ratingLabel: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    letterSpacing: 0.475,
    color: colors.inkMuted,
  },
  ratingLabelActive: {
    color: colors.accent,
  },
  // Availability
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginTop: 4,
  },
  availabilityButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderWidth: 0,
  },
  availabilityText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14.5,
    letterSpacing: -0.29,
    color: colors.ink,
  },
  // Sort list
  sortList: {
    gap: 6,
    marginTop: 4,
  },
  sortCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  sortCardActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  sortText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    letterSpacing: -0.28,
    color: colors.ink,
  },
  sortIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 100,
  },
  resetButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    letterSpacing: -0.22,
    color: colors.ink,
  },
  applyButton: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderRadius: 100,
  },
  applyButtonShadow: {
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  applyButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    letterSpacing: -0.22,
    color: colors.bg,
  },
});
