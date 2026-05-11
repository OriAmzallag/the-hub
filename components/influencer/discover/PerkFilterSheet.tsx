/**
 * PerkFilterSheet Component
 * Bottom sheet with all filter options for perks.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { X, Check } from 'lucide-react-native';
import { colors, motion, radii, borderRadius as radius } from '@/constants/theme';
import { FilterSection } from './FilterSection';
import { CATEGORIES_FILTER, SORT_OPTIONS } from '@/constants/mockInfluencerPerks';
import type { PerkFilterState, PerkCategory, PerkSortOption } from '@/types/perk';
import { countActiveFilters, DEFAULT_FILTERS } from '@/lib/perkFilters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PerkFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PerkFilterState;
  setFilters: (filters: PerkFilterState) => void;
  onReset: () => void;
}

export function PerkFilterSheet({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset,
}: PerkFilterSheetProps) {
  const insets = useSafeAreaInsets();
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const activeCount = countActiveFilters(filters);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      sheetTranslateY.value = withTiming(0, {
        duration: motion.duration.slow,
        easing: Easing.bezier(...motion.easing.sheet),
      });
    } else if (isMounted) {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
        'worklet';
        if (finished) runOnJS(setIsMounted)(false);
      });
    }
  }, [isOpen, isMounted, overlayOpacity, sheetTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  // Toggle category selection
  const toggleCategory = (category: PerkCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  // Pan-down to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      'worklet';
      const shouldClose =
        event.translationY > SCREEN_HEIGHT * 0.25 || event.velocityY > 800;
      if (shouldClose) {
        sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        sheetTranslateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.bezier(...motion.easing.sheet),
        });
      }
    });

  return (
    // The filter sheet is opened from inside a tab screen. Without a
    // Modal the absolute-positioned sheet renders BELOW the bottom tab
    // bar (which sits higher in the navigator hierarchy), and the bar's
    // frosted blur lets the underlying Discover screen show through.
    // Wrapping in a native Modal hoists the sheet (and scrim) above the
    // tab bar so it can cover the whole viewport. The Modal mounts/
    // unmounts on `isOpen`; GestureHandlerRootView keeps the pan-down
    // gesture working on iOS where Modal hosts content in a separate
    // native view tree from the app's root GestureHandlerRootView.
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <BlurView
          intensity={4}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Drag handle */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.superTitle}>
                {activeCount > 0 ? `${activeCount} ACTIVE` : 'REFINE PERKS'}
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
            {/* 1. Categories */}
            <FilterSection
              title="Categories"
              hint={
                filters.categories.length > 0
                  ? `${filters.categories.length} selected`
                  : undefined
              }
            >
              <View style={styles.pillGrid}>
                {CATEGORIES_FILTER.map((category) => {
                  const isActive = filters.categories.includes(category);
                  return (
                    <Pressable
                      key={category}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text
                        style={[styles.pillText, isActive && styles.pillTextActive]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterSection>

            {/* 2. Value range */}
            <FilterSection
              title="Value range"
              hint={`₪${filters.valueMin} → ₪${filters.valueMax}`}
            >
              <View style={styles.valueInputs}>
                <View style={styles.valueCard}>
                  <Text style={styles.valueLabel}>MIN</Text>
                  <View style={styles.valueRow}>
                    <Text style={styles.valueCurrency}>₪</Text>
                    <TextInput
                      style={styles.valueInput}
                      value={String(filters.valueMin)}
                      onChangeText={(text) =>
                        setFilters({ ...filters, valueMin: Number(text) || 0 })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.valueCard}>
                  <Text style={styles.valueLabel}>MAX</Text>
                  <View style={styles.valueRow}>
                    <Text style={styles.valueCurrency}>₪</Text>
                    <TextInput
                      style={styles.valueInput}
                      value={String(filters.valueMax)}
                      onChangeText={(text) =>
                        setFilters({ ...filters, valueMax: Number(text) || 0 })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </FilterSection>

            {/* 3. Reach - Qualify only */}
            <FilterSection title="Reach">
              <Pressable
                style={[
                  styles.toggleRow,
                  filters.qualifyOnly && styles.toggleRowActive,
                ]}
                onPress={() =>
                  setFilters({ ...filters, qualifyOnly: !filters.qualifyOnly })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    filters.qualifyOnly && styles.checkboxActive,
                  ]}
                >
                  {filters.qualifyOnly && (
                    <Check size={14} strokeWidth={3} color={colors.bg} />
                  )}
                </View>
                <Text style={styles.toggleText}>
                  Show only perks I qualify for
                </Text>
              </Pressable>
            </FilterSection>

            {/* 4. Urgency - Expiring soon only */}
            <FilterSection title="Urgency">
              <Pressable
                style={[
                  styles.toggleRow,
                  filters.expiringSoonOnly && styles.toggleRowActive,
                ]}
                onPress={() =>
                  setFilters({
                    ...filters,
                    expiringSoonOnly: !filters.expiringSoonOnly,
                  })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    filters.expiringSoonOnly && styles.checkboxActive,
                  ]}
                >
                  {filters.expiringSoonOnly && (
                    <Check size={14} strokeWidth={3} color={colors.bg} />
                  )}
                </View>
                <Text style={styles.toggleText}>Expiring soon only</Text>
              </Pressable>
            </FilterSection>

            {/* 5. Sort by */}
            <FilterSection title="Sort by">
              <View style={styles.sortList}>
                {SORT_OPTIONS.map((option) => {
                  const isActive = filters.sort === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.sortCard, isActive && styles.sortCardActive]}
                      onPress={() =>
                        setFilters({ ...filters, sort: option.id as PerkSortOption })
                      }
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

          {/* Footer — only the Reset pill. Filter changes apply live;
              the sheet is dismissed via the header X or pan-down, so a
              dedicated "Apply" CTA is intentionally not shown. */}
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 22) },
            ]}
          >
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgScrim,
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
    height: '92%',
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
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
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
  // Pill grid (categories)
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
    borderRadius: radii.pill,
  },
  pillActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  pillText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.13,
    color: colors.ink,
  },
  pillTextActive: {
    color: colors.accent,
  },
  // Value inputs
  valueInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  valueCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 2,
  },
  valueLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.62,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  valueCurrency: {
    fontFamily: 'InterTight-Medium',
    fontSize: 14,
    fontWeight: '500',
    color: colors.inkMuted,
  },
  valueInput: {
    flex: 1,
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.ink,
    padding: 0,
  },
  // Toggle rows (reach, urgency)
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    marginTop: 4,
  },
  toggleRowActive: {
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
  toggleText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14.5,
    fontWeight: '600',
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
    borderRadius: radius.lg,
  },
  sortCardActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  sortText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: radii.pill,
  },
  resetButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.ink,
  },
});
