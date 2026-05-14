/**
 * InquiriesScreen Component
 * Shared screen for Business and Influencer inbox views.
 * Role-driven: same UI, different data and behavior based on viewerRole.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { requiresAction, type ViewerRole } from '@/lib/dealLifecycle';
import { ScreenHeader } from '@/components/ui';
import { SearchBar } from './SearchBar';
import { SectionHeader } from './SectionHeader';
import { ThreadRow } from './ThreadRow';
import { EmptyState } from './EmptyState';
import { NoResultsState } from './NoResultsState';
import type { Thread } from '@/types/inquiry';

interface InquiriesScreenProps {
  viewerRole: ViewerRole;
  threads: Thread[];
  unreadTotal: number;
}

export function InquiriesScreen({
  viewerRole,
  threads,
  unreadTotal,
}: InquiriesScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  // Filter threads by search (case-insensitive name match)
  const filteredThreads = useMemo(() => {
    if (!searchValue.trim()) {
      return threads;
    }
    const query = searchValue.toLowerCase();
    return threads.filter((thread) =>
      thread.counterparty.name.toLowerCase().includes(query)
    );
  }, [threads, searchValue]);

  // Split into pinned vs other
  const { pinnedThreads, otherThreads } = useMemo(() => {
    const pinned: Thread[] = [];
    const other: Thread[] = [];

    for (const thread of filteredThreads) {
      const needsAction = requiresAction(
        {
          state: thread.state,
          hoursLeft: thread.hoursLeft,
          completedSubstate: thread.completedSubstate,
        },
        viewerRole
      );

      if (needsAction || thread.unread > 0) {
        pinned.push(thread);
      } else {
        other.push(thread);
      }
    }

    return { pinnedThreads: pinned, otherThreads: other };
  }, [filteredThreads, viewerRole]);

  // Handle Browse Discover CTA (Business empty state)
  const handleBrowseDiscover = useCallback(() => {
    router.push('/discover');
  }, [router]);

  // Handle thread press - navigate to thread screen
  const handleThreadPress = useCallback(
    (threadId: string) => {
      router.push(`/inquiries/${threadId}?viewerRole=${viewerRole}`);
    },
    [router, viewerRole]
  );

  // Determine render state
  const hasThreads = threads.length > 0;
  const hasFilteredResults = filteredThreads.length > 0;
  const isSearchActive = searchValue.trim().length > 0;

  // Tab bar padding
  const bottomPadding = Math.max(insets.bottom, 18) + 70; // Tab bar height approx

  // Render content based on state
  const renderContent = () => {
    // No threads at all
    if (!hasThreads) {
      return (
        <EmptyState
          viewerRole={viewerRole}
          onBrowseDiscover={viewerRole === 'business' ? handleBrowseDiscover : undefined}
        />
      );
    }

    // Search active but no matches
    if (isSearchActive && !hasFilteredResults) {
      return <NoResultsState searchValue={searchValue} />;
    }

    // Has content
    const entering = FadeInUp.duration(400).easing(Easing.out(Easing.ease));

    return (
      <Animated.View entering={entering}>
        {/* Pinned section */}
        {pinnedThreads.length > 0 && (
          <>
            <SectionHeader title="Needs your attention" />
            {pinnedThreads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                viewerRole={viewerRole}
                onPress={() => handleThreadPress(thread.id)}
              />
            ))}
          </>
        )}

        {/* Other section */}
        {otherThreads.length > 0 && (
          <>
            {pinnedThreads.length > 0 && <View style={styles.sectionGap} />}
            <SectionHeader title="All inquiries" />
            {otherThreads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                viewerRole={viewerRole}
                onPress={() => handleThreadPress(thread.id)}
              />
            ))}
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top bar — ScreenHeader handles its own safe-area top inset */}
      <ScreenHeader
        title="Inquiries"
        rightCaption={unreadTotal > 0 ? `${unreadTotal} unread` : undefined}
        rightCaptionAccessibilityLabel={
          unreadTotal > 0 ? `${unreadTotal} unread messages` : undefined
        }
      />

      {/* Search bar (only show if there are threads) */}
      {hasThreads && (
        <SearchBar value={searchValue} onChangeText={setSearchValue} />
      )}

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  sectionGap: {
    height: 14,
  },
});
