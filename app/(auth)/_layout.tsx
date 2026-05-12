/**
 * Auth Group Layout
 *
 * Layout for authentication screens (onboarding for now; sign-in/up later).
 */

import { Stack, type ErrorBoundaryProps } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, typography, radii } from "@/constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: "slide_from_right",
      }}
    />
  );
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Something went wrong</Text>
      <Text style={styles.title}>Let's start over.</Text>
      <Pressable
        style={styles.button}
        onPress={retry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 16,
  },
  eyebrow: {
    ...typography.monoGreeting,
    color: colors.accent,
  },
  title: {
    fontFamily: "InterTight-ExtraBold",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1.26,
    lineHeight: 30,
    color: colors.ink,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  buttonText: {
    fontFamily: "InterTight-Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.bg,
  },
});
