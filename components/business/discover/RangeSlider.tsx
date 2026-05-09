/**
 * RangeSlider Component
 * Custom range slider built with Reanimated and Gesture Handler.
 */

import React from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
}

const THUMB_SIZE = 20;

export function RangeSlider({ min, max, value, onValueChange }: RangeSliderProps) {
  const trackWidth = useSharedValue(0);
  const thumbX = useSharedValue(0);

  const normalizedValue = (value - min) / (max - min);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidth.value = width;
    thumbX.value = normalizedValue * (width - THUMB_SIZE);
  };

  const updateValue = (newValue: number) => {
    onValueChange(newValue);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const clampedX = Math.max(0, Math.min(event.x - THUMB_SIZE / 2, trackWidth.value - THUMB_SIZE));
      thumbX.value = clampedX;

      const newNormalized = clampedX / (trackWidth.value - THUMB_SIZE);
      const newValue = Math.round(min + newNormalized * (max - min));
      runOnJS(updateValue)(newValue);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbX.value + THUMB_SIZE / 2,
  }));

  // Update thumb position when value changes externally
  React.useEffect(() => {
    if (trackWidth.value > 0) {
      thumbX.value = normalizedValue * (trackWidth.value - THUMB_SIZE);
    }
  }, [value, normalizedValue, thumbX, trackWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.track} onLayout={handleLayout}>
            <Animated.View style={[styles.fill, fillStyle]} />
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </View>
        </GestureDetector>
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{min} KM</Text>
        <Text style={styles.label}>{max} KM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  sliderContainer: {
    height: 24,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: 2,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -8,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.accent,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    letterSpacing: 1.14,
    color: colors.inkMuted,
  },
});
