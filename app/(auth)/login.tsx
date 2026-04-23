import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      // AuthContext + _layout.tsx will handle redirect
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-6">
            <Text className="text-gray-mid text-base">← Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View className="items-center mb-10">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-4">
              <Text className="text-white text-xl font-bold">H</Text>
            </View>
            <Text className="text-white text-2xl font-bold">Welcome Back</Text>
            <Text className="text-gray-mid text-sm mt-1">Sign in to THE HUB</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-gray-mid text-sm mb-2">Email Address</Text>
              <TextInput
                className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-gray-mid text-sm mb-2">Password</Text>
              <TextInput
                className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="Your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-primary text-sm">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mt-6 rounded-2xl py-4 items-center ${
              loading ? "bg-primary/50" : "bg-primary"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.replace("/(auth)/register")}
          >
            <Text className="text-gray-mid text-sm">
              Don't have an account?{" "}
              <Text className="text-primary font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
