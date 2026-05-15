/**
 * MarkDoneSheet Component
 * Bottom-sheet modal for confirming Mark Done action.
 *
 * Uses canonical Modal + Reanimated + GestureHandler pattern from ConfirmSheet.tsx.
 *
 * Visual spec (from mark-done.reference.jsx):
 * - Sheet: top radius 22, drag handle 36x4, paddingTop 8, paddingBottom 20
 * - Hero: 56x56 radius 16 accentSoft container, check 26/2.6
 * - Title: display 24/800/-0.04em
 * - Body: 14/0.75-opacity, max-width 32ch
 * - Textarea: 3 rows, 200 char limit, counter turns accent at 180+
 * - Buttons: flex 1 / 1.5, pill radius, padding 15/22
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
  Keyboard,
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
import { Check } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MarkDoneSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalMessage: string | null) => void;
  businessName: string;
}

export function MarkDoneSheet({
  isOpen,
  onClose,
  onConfirm,
  businessName,
}: MarkDoneSheetProps) {
  const insets = useSafeAreaInsets();
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const [isMounted, setIsMounted] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');

  // Reset message when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setFinalMessage('');
    }
  }, [isOpen]);

  // Mount lifecycle + exit animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else if (isMounted) {
      Keyboard.dismiss();
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

  // Entrance animation — deferred one frame
  useEffect(() => {
    if (!isMounted || !isOpen) return;
    const raf = requestAnimationFrame(() => {
      overlayOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.ease),
      });
      sheetTranslateY.value = withTiming(0, {
        duration: 320,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
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
          easing: Easing.bezier(0.32, 0.72, 0, 1),
        });
      }
    });

  const handleConfirm = () => {
    const message = finalMessage.trim();
    onConfirm(message.length > 0 ? message : null);
  };

  const charCountColor =
    finalMessage.length > 180 ? colors.accent : colors.inkSubtle;

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

          {/* Hero section */}
          <View style={styles.heroSection}>
            {/* Icon container */}
            <View style={styles.heroIconContainer}>
              <Check size={26} strokeWidth={2.6} color={colors.accent} />
            </View>

            {/* Title */}
            <Text style={styles.title} accessibilityRole="header">
              Mark deal as done?
            </Text>

            {/* Body */}
            <Text style={styles.body}>
              This tells {businessName} you've delivered the work. They'll be
              able to rate the deal.
            </Text>
          </View>

          {/* Optional message section */}
          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>
              ADD A FINAL MESSAGE · OPTIONAL
            </Text>
            <View style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                value={finalMessage}
                onChangeText={(text) => setFinalMessage(text.slice(0, 200))}
                placeholder="e.g. Reel is live, story set going up tonight. Let me know if you need anything else!"
                placeholderTextColor={colors.inkSubtle}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
                accessibilityLabel="Optional final message"
              />
              <Text style={[styles.charCounter, { color: charCountColor }]}>
                {finalMessage.length}/200
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View
            style={[
              styles.actionsContainer,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Not yet"
            >
              <Text style={styles.cancelButtonText}>Not yet</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel="Mark done"
            >
              <Text style={styles.confirmButtonText}>Mark done</Text>
              <Check size={15} strokeWidth={3} color={colors.bg} />
            </Pressable>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 60,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    paddingTop: 8,
    paddingBottom: 20,
    zIndex: 70,
    // Sheet shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  handleContainer: {
    paddingTop: 0,
    paddingBottom: 18,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  heroSection: {
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 18,
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.96, // -0.04em
    lineHeight: 26.4, // 1.1
    color: colors.ink,
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21, // 1.5
    color: colors.ink,
    opacity: 0.75,
    textAlign: 'center',
    maxWidth: 280, // ~32ch
  },
  messageSection: {
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  messageLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.71, // 0.18em
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 8,
  },
  textareaContainer: {
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  textarea: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13.5,
    fontWeight: '400',
    lineHeight: 20.25, // 1.5
    color: colors.ink,
    minHeight: 60, // ~3 lines
    padding: 0,
  },
  charCounter: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9, // 0.1em
    textAlign: 'right',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 22,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 100,
  },
  cancelButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.21, // -0.015em
    color: colors.ink,
  },
  confirmButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 15,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderRadius: 100,
    // Accent shadow
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  confirmButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.21, // -0.015em
    color: colors.bg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  confirmButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
});
