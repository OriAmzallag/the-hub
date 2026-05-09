/**
 * FilterSheet Component
 * Bottom sheet with all filter options.
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
} from 'react-native-reanimated';
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
import { RangeSlider } from './RangeSlider';
import { PLATFORMS, SORT_OPTIONS } from '@/constants/mockBusinessDiscover';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  radius: number;
  setRadius: (value: number) => void;
  priceMin: number;
  setPriceMin: (value: number) => void;
  priceMax: number;
  setPriceMax: (value: number) => void;
  platforms: string[];
  setPlatforms: (value: string[]) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  availableOnly: boolean;
  setAvailableOnly: (value: boolean) => void;
  sort: string;
  setSort: (value: string) => void;
  onReset: () => void;
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
  radius,
  setRadius,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  platforms,
  setPlatforms,
  minRating,
  setMinRating,
  availableOnly,
  setAvailableOnly,
  sort,
  setSort,
  onReset,
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

  const togglePlatform = (id: string) => {
    if (platforms.includes(id)) {
      setPlatforms(platforms.filter((p) => p !== id));
    } else {
      setPlatforms([...platforms, id]);
    }
  };

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
          {/* Drag handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.superTitle}>Refine your search</Text>
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
            {/* Location */}
            <FilterSection title="Location" hint={`${radius} km from you`}>
              <RangeSlider
                min={1}
                max={50}
                value={radius}
                onValueChange={setRadius}
              />
            </FilterSection>

            {/* Price range */}
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

            {/* Platform */}
            <FilterSection title="Platform">
              <View style={styles.platformChips}>
                {PLATFORMS.map((platform) => {
                  const isActive = platforms.includes(platform.id);
                  const Icon = PLATFORM_ICONS[platform.iconName];
                  return (
                    <Pressable
                      key={platform.id}
                      style={[styles.platformChip, isActive && styles.platformChipActive]}
                      onPress={() => togglePlatform(platform.id)}
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

            {/* Minimum rating */}
            <FilterSection
              title="Minimum rating"
              hint={minRating > 0 ? `${minRating}.0 stars or above` : 'Any rating'}
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

            {/* Availability */}
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

            {/* Sort by */}
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
