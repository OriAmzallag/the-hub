import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { UserRole } from "../../types";

export default function RegisterScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert("Select a role", "Please choose whether you are an Influencer or a Business.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim(), role: selectedRole },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Navigate to profile setup based on role
        if (selectedRole === "influencer") {
          router.replace("/(auth)/influencer-profile");
        } else {
          router.replace("/(auth)/business-profile");
        }
      }
    } catch (error: any) {
      Alert.alert("Registration failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
          <Text className="text-gray-mid text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
        <Text className="text-gray-mid text-base mb-8">
          Join THE HUB and start connecting
        </Text>

        {/* Role Selection */}
        <Text className="text-white font-semibold text-base mb-3">I am a...</Text>
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            className={`flex-1 rounded-2xl p-4 border-2 items-center ${
              selectedRole === "influencer"
                ? "border-primary bg-primary/10"
                : "border-dark-3 bg-dark-2"
            }`}
            onPress={() => setSelectedRole("influencer")}
          >
            <Text className="text-3xl mb-2">🎤</Text>
            <Text
              className={`font-bold text-sm ${
                selectedRole === "influencer" ? "text-primary" : "text-white"
              }`}
            >
              Influencer
            </Text>
            <Text className="text-gray-mid text-xs text-center mt-1">
              Creator, blogger, or content maker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 rounded-2xl p-4 border-2 items-center ${
              selectedRole === "business"
                ? "border-primary bg-primary/10"
                : "border-dark-3 bg-dark-2"
            }`}
            onPress={() => setSelectedRole("business")}
          >
            <Text className="text-3xl mb-2">🏢</Text>
            <Text
              className={`font-bold text-sm ${
                selectedRole === "business" ? "text-primary" : "text-white"
              }`}
            >
              Business
            </Text>
            <Text className="text-gray-mid text-xs text-center mt-1">
              Brand, company, or agency
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="gap-4">
          <View>
            <Text className="text-gray-mid text-sm mb-2">Full Name</Text>
            <TextInput
              className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-base"
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="At least 6 characters"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          className={`mt-8 rounded-2xl py-4 items-center ${
            loading ? "bg-primary/50" : "bg-primary"
          }`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Continue →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="text-gray-mid text-sm">
            Already have an account?{" "}
            <Text className="text-primary font-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
