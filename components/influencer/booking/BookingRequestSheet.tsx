/**
 * BookingRequestSheet Component
 * Bottom sheet for booking requests with form and success states.
 *
 * Follows the same animation patterns as FilterSheet:
 * - Reanimated-driven rise/fall
 * - Scrim with overlay fade
 * - Drag handle with pan-down dismiss
 * - GestureDetector + runOnJS for closing
 */

import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { colors, motion } from '@/constants/theme';
import type { TalentService } from '@/types/talent';
import type { DateChipId, RequestState, BookingSummary } from '@/types/booking';
import { RequestForm } from './RequestForm';
import { RequestSuccess } from './RequestSuccess';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BookingRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  talentFirstName: string;
  selectedServices: TalentService[];
  onRemoveService: (id: number) => void;
  requestState: RequestState;
  onSubmit: () => void;
  onViewStatus: () => void;
  // Form state
  pickedDateChip: DateChipId | null;
  onPickDateChip: (id: DateChipId) => void;
  brief: string;
  onBriefChange: (text: string) => void;
  budgetConfirmed: boolean;
  onBudgetConfirmChange: (checked: boolean) => void;
}

export function BookingRequestSheet({
  isOpen,
  onClose,
  talentName,
  talentFirstName,
  selectedServices,
  onRemoveService,
  requestState,
  onSubmit,
  onViewStatus,
  pickedDateChip,
  onPickDateChip,
  brief,
  onBriefChange,
  budgetConfirmed,
  onBudgetConfirmChange,
}: BookingRequestSheetProps) {
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  const isSuccess = requestState === 'submitted';

  // Animation timings (match FilterSheet)
  useEffect(() => {
    if (isOpen) {
      overlayOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      sheetTranslateY.value = withTiming(0, {
        duration: motion.duration.slow,
        easing: Easing.bezier(...motion.easing.sheet),
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

  // Pan-down to dismiss — enabled in both idle and success states
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

  // Handle scrim press — closes the sheet in either state
  const handleScrimPress = () => {
    onClose();
  };

  // Compute summary for success state
  const summary: BookingSummary = {
    serviceCount: selectedServices.length,
    total: selectedServices.reduce((sum, s) => sum + s.price, 0),
  };

  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay (scrim) */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleScrimPress}
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
        />
        <BlurView
          intensity={14}
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

          {/* Content: Form or Success */}
          {isSuccess ? (
            <RequestSuccess
              talentFirstName={talentFirstName}
              summary={summary}
              onViewStatus={onViewStatus}
              onBackToDiscovery={onClose}
            />
          ) : (
            <RequestForm
              talentName={talentName}
              talentFirstName={talentFirstName}
              onClose={onClose}
              selectedServices={selectedServices}
              onRemoveService={onRemoveService}
              pickedDateChip={pickedDateChip}
              onPickDateChip={onPickDateChip}
              brief={brief}
              onBriefChange={onBriefChange}
              budgetConfirmed={budgetConfirmed}
              onBudgetConfirmChange={onBudgetConfirmChange}
              onSubmit={onSubmit}
            />
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgScrimDark,
    zIndex: 200,
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
    zIndex: 210,
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
});
