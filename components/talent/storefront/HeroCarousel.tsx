/**
 * HeroCarousel Component
 * Swipeable 4:5 portfolio gallery with pagination dots and counter.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, motion } from '@/constants/theme';

interface HeroCarouselProps {
  images: string[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  const imageCount = images.length;
  const containerHeight = screenWidth * (5 / 4); // 4:5 aspect ratio

  const updateIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = -activeIndex.value * screenWidth + event.translationX;
    })
    .onEnd((event) => {
      const threshold = screenWidth * 0.25;
      const velocity = event.velocityX;

      let nextIndex = activeIndex.value;

      // Snap logic: velocity > 500 OR distance > 25% of width
      if (velocity < -500 || (velocity >= -500 && event.translationX < -threshold)) {
        nextIndex = Math.min(activeIndex.value + 1, imageCount - 1);
      } else if (velocity > 500 || (velocity <= 500 && event.translationX > threshold)) {
        nextIndex = Math.max(activeIndex.value - 1, 0);
      }

      activeIndex.value = nextIndex;
      translateX.value = withTiming(-nextIndex * screenWidth, {
        duration: 400,
        easing: Easing.bezier(...motion.easing.smooth),
      });

      runOnJS(updateIndex)(nextIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Format number for display with leading zero (01, 02, etc.)
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Single image - no swipe needed
  if (imageCount === 1) {
    return (
      <View style={[styles.container, { height: containerHeight }]}>
        <Image
          source={{ uri: images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityLabel="Portfolio image 1 of 1"
        />
        <LinearGradient
          colors={['transparent', colors.bgOverlay85]}
          style={styles.scrim}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.imagesWrapper, animatedStyle]}>
          {images.map((uri, index) => (
            <View key={index} style={{ width: screenWidth, height: containerHeight }}>
              <Image
                source={{ uri }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                accessibilityLabel={`Portfolio image ${index + 1} of ${imageCount}`}
              />
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      {/* Gradient scrim */}
      <LinearGradient
        colors={['transparent', colors.bgOverlay85]}
        style={styles.scrim}
        pointerEvents="none"
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Image counter: "01 / 05" format */}
      <Text style={styles.counter}>
        {formatNumber(currentIndex + 1)} / {formatNumber(imageCount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  imagesWrapper: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(244,240,232,0.4)',
  },
  counter: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.ink,
  },
});
