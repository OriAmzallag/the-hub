/**
 * CustomTabBar Component
 * Frosted glass tab bar with blur effect and badge support.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';

interface TabConfig {
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  discover: { label: 'Discover', icon: Search },
  index: { label: 'Dashboard', icon: LayoutDashboard },
  inquiries: { label: 'Inquiries', icon: MessageSquare, badge: 1 },
  profile: { label: 'Profile', icon: User },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 18);

  const TabContent = (
    <View style={[styles.tabsContainer, { paddingBottom: bottomPadding }]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const isActive = state.index === index;
        const IconComponent = config.icon;
        const iconColor = isActive ? colors.accent : colors.inkMuted;
        const strokeWidth = isActive ? 2.4 : 2;

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={config.label}
          >
            <View style={styles.iconContainer}>
              <IconComponent
                size={20}
                strokeWidth={strokeWidth}
                color={iconColor}
              />
              {config.badge !== undefined && config.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{config.badge}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                isActive ? styles.labelActive : styles.label,
                { color: iconColor },
              ]}
            >
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  // Use BlurView on iOS, solid background on Android (blur not well supported)
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={40} tint="dark" style={styles.container}>
        <View style={styles.borderTop} />
        {TabContent}
      </BlurView>
    );
  }

  // Android fallback - solid semi-transparent background
  return (
    <View style={[styles.container, styles.containerAndroid]}>
      <View style={styles.borderTop} />
      {TabContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  containerAndroid: {
    backgroundColor: 'rgba(26, 24, 21, 0.94)',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    ...typography.monoBadge,
    color: colors.bg,
  },
  label: {
    ...typography.monoTab,
    color: colors.inkMuted,
  },
  labelActive: {
    ...typography.monoTabActive,
    color: colors.accent,
  },
});
