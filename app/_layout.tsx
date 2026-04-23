import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../lib/AuthContext";
import { useRouter, useSegments } from "expo-router";

function RootLayoutNav() {
  const { session, loading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    // Profile setup screens are part of the auth group but must not be interrupted
    const inProfileSetup =
      segments[1] === "influencer-profile" || segments[1] === "business-profile";

    if (!session && !inAuthGroup) {
      // Logged out and on a protected screen → send to welcome
      router.replace("/(auth)/welcome");
    } else if (session && profile && inAuthGroup && !inProfileSetup) {
      // Logged in with a complete profile and on an auth screen (e.g. login/register) → go to app
      router.replace("/(tabs)/home");
    }
    // session && !profile && inAuthGroup → new user completing profile setup, do nothing
  }, [session, loading, profile, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
