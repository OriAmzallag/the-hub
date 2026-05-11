/**
 * DeliverableSheet Component
 * Bottom sheet for adding/editing a deliverable.
 * Uses canonical Modal + GestureHandlerRootView + isMounted + requestAnimationFrame pattern.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
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
import { X, Instagram, Youtube } from 'lucide-react-native';
import { Music2 } from 'lucide-react-native';
import { colors, motion, radii, typography, shadows } from '@/constants/theme';
import type { PerkPlatform } from '@/types/perk';
import type { FormDeliverable } from './types';
import { PLATFORM_OPTIONS, ACTION_PRESETS } from './types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_BRIEF = 200;

interface DeliverableSheetProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: FormDeliverable;
  onClose: () => void;
  onSave: (deliverable: Omit<FormDeliverable, 'id'>) => void;
  onRemove?: () => void;
}

const PlatformIcon = ({
  icon,
  color,
}: {
  icon: 'Instagram' | 'Music2' | 'Youtube';
  color: string;
}) => {
  const props = { size: 28, strokeWidth: 1.8, color };
  switch (icon) {
    case 'Instagram':
      return <Instagram {...props} />;
    case 'Music2':
      return <Music2 {...props} />;
    case 'Youtube':
      return <Youtube {...props} />;
  }
};

export function DeliverableSheet({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  onRemove,
}: DeliverableSheetProps) {
  const insets = useSafeAreaInsets();
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const [isMounted, setIsMounted] = useState(false);

  // Form state
  const [platform, setPlatform] = useState<PerkPlatform>(
    initialData?.platform || 'IG'
  );
  const [action, setAction] = useState(initialData?.action || '');
  const [requiredFollowers, setRequiredFollowers] = useState<number | null>(
    initialData?.requiredFollowers ?? null
  );
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setPlatform(initialData?.platform || 'IG');
      setAction(initialData?.action || '');
      setRequiredFollowers(initialData?.requiredFollowers ?? null);
      setDescription(initialData?.description || '');
    }
  }, [isOpen, initialData]);

  // Mount lifecycle + exit animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else if (isMounted) {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 300 },
        (finished) => {
          'worklet';
          if (finished) runOnJS(setIsMounted)(false);
        }
      );
    }
  }, [isOpen, isMounted, overlayOpacity, sheetTranslateY]);

  // Entrance animation - deferred one frame
  useEffect(() => {
    if (!isMounted || !isOpen) return;
    const raf = requestAnimationFrame(() => {
      overlayOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      sheetTranslateY.value = withTiming(0, {
        duration: motion.duration.slow,
        easing: Easing.bezier(...motion.easing.sheet),
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [isMounted, isOpen, overlayOpacity, sheetTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

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

  const handleFollowersChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    if (numeric === '') {
      setRequiredFollowers(null);
    } else {
      setRequiredFollowers(parseInt(numeric, 10));
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      platform,
      action,
      requiredFollowers: requiredFollowers!,
      description,
    });
  };

  const isValid =
    action.length > 0 &&
    requiredFollowers !== null &&
    requiredFollowers > 0 &&
    description.length > 0;

  const presets = ACTION_PRESETS[platform];

  const formatReachHint = () => {
    if (requiredFollowers === null) return '';
    const formatted =
      requiredFollowers >= 1000
        ? `${(requiredFollowers / 1000).toFixed(0)}K`
        : String(requiredFollowers);
    return `${formatted}+ on ${platform}`;
  };

  return (
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
          {/* Drag handle */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.superTitle}>
              {mode === 'add' ? 'NEW DELIVERABLE' : 'EDIT DELIVERABLE'}
            </Text>
            <Text style={styles.title}>What & where</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} strokeWidth={2} color={colors.inkMuted} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Platform selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PLATFORM</Text>
              <View style={styles.platformGrid}>
                {PLATFORM_OPTIONS.map((option) => {
                  const isSelected = platform === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.platformTile,
                        isSelected && styles.platformTileSelected,
                      ]}
                      onPress={() => setPlatform(option.id)}
                    >
                      <PlatformIcon
                        icon={option.icon}
                        color={isSelected ? colors.accent : colors.inkMuted}
                      />
                      <Text
                        style={[
                          styles.platformLabel,
                          isSelected && styles.platformLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Action selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ACTION</Text>
              <View style={styles.presetGrid}>
                {presets.map((preset) => {
                  const isSelected = action === preset;
                  return (
                    <Pressable
                      key={preset}
                      style={[
                        styles.presetChip,
                        isSelected && styles.presetChipSelected,
                      ]}
                      onPress={() => setAction(preset)}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          isSelected && styles.presetTextSelected,
                        ]}
                      >
                        {preset}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.orLabel}>Or custom</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={action}
                  onChangeText={setAction}
                  placeholder="e.g., 2 Reels + 1 Story"
                  placeholderTextColor={colors.inkSubtle}
                />
              </View>
            </View>

            {/* Minimum reach */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>MINIMUM REACH</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={
                    requiredFollowers !== null ? String(requiredFollowers) : ''
                  }
                  onChangeText={handleFollowersChange}
                  placeholder="e.g., 5000"
                  placeholderTextColor={colors.inkSubtle}
                  keyboardType="number-pad"
                />
              </View>
              {requiredFollowers !== null && (
                <Text style={styles.reachHint}>{formatReachHint()}</Text>
              )}
            </View>

            {/* Brief */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.sectionLabel}>BRIEF</Text>
                <Text style={styles.counter}>
                  {description.length}/{MAX_BRIEF}
                </Text>
              </View>
              <View style={[styles.inputContainer, styles.briefContainer]}>
                <TextInput
                  style={[styles.input, styles.briefInput]}
                  value={description}
                  onChangeText={(text) =>
                    setDescription(text.slice(0, MAX_BRIEF))
                  }
                  placeholder="What to include..."
                  placeholderTextColor={colors.inkSubtle}
                  multiline
                  textAlignVertical="top"
                  maxLength={MAX_BRIEF}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 22) },
            ]}
          >
            {mode === 'add' ? (
              <>
                <Pressable style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.saveButton,
                    !isValid && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!isValid}
                >
                  <Text style={styles.saveButtonText}>Add deliverable</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={styles.removeButton} onPress={onRemove}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.saveButton,
                    !isValid && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!isValid}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </>
            )}
          </View>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    zIndex: 70,
    ...shadows.sheet,
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
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 18,
    position: 'relative',
  },
  superTitle: {
    ...typography.monoGreeting,
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
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  counter: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
  },
  platformGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  platformTile: {
    flex: 1,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
  },
  platformTileSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  platformLabel: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.11,
    color: colors.inkMuted,
  },
  platformLabelSelected: {
    color: colors.accent,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
  },
  presetChipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  presetText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.12,
    color: colors.inkMuted,
  },
  presetTextSelected: {
    color: colors.accent,
  },
  orLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
    marginTop: 12,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 14,
  },
  briefContainer: {
    minHeight: 100,
  },
  input: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: colors.ink,
    padding: 0,
  },
  briefInput: {
    minHeight: 72,
  },
  reachHint: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  cancelButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.ink,
  },
  removeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.declineBorder,
    borderRadius: radii.pill,
  },
  removeButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.decline,
  },
  saveButton: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.bg,
  },
});
