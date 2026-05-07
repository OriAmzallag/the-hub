/**
 * Root Layout
 *
 * This is the entry point for the Expo Router navigation.
 * Sets up global providers and navigation structure.
 */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

// Import global CSS for NativeWind
import "../global.css";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after app is ready
    // In Phase 1, this will be tied to auth initialization
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        {/* Route groups will be added here */}
        {/* (auth) - Authentication screens */}
        {/* (talent) - Talent dashboard */}
        {/* (hunter) - Hunter dashboard */}
      </Stack>
    </>
  );
}
