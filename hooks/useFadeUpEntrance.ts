/**
 * useFadeUpEntrance Hook
 *
 * Runs a one-shot fade-up entrance on mount: opacity 0 → 1, translateY
 * 8 → 0 over 400ms ease-out. Returns a Reanimated animated style ready
 * to be spread into an `<Animated.View>`.
 *
 * Used by onboarding step shells (and the bespoke Welcome / Done
 * screens) to mirror the `.fade-up` CSS class from the reference —
 * content slides in softly when each step mounts instead of snapping
 * into place.
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const ENTRANCE_DURATION = 400;
// Reference uses 8px translateY which reads clearly on web but feels
// subtle on phone screens. 16px keeps the same character (a brief
// upward glide) while staying visible at iPhone pixel densities.
const ENTRANCE_TRANSLATE = 16;

export function useFadeUpEntrance() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(ENTRANCE_TRANSLATE);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.ease),
    });
  }, [opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}
