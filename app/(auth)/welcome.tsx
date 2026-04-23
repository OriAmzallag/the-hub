import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark">
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-dark">
        <View
          className="absolute w-80 h-80 rounded-full opacity-20"
          style={{
            backgroundColor: "#6C47FF",
            top: -60,
            right: -60,
            transform: [{ scale: 1.5 }],
          }}
        />
        <View
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            backgroundColor: "#FF6B6B",
            bottom: 100,
            left: -40,
          }}
        />
      </View>

      <View className="flex-1 px-6 justify-between">
        {/* Logo */}
        <View className="mt-16 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">H</Text>
          </View>
          <Text className="text-white text-4xl font-bold tracking-widest">
            THE HUB
          </Text>
          <Text className="text-gray-mid text-base mt-2 text-center">
            Where Influence Meets Opportunity
          </Text>
        </View>

        {/* Tagline */}
        <View className="items-center px-4">
          <Text className="text-white text-3xl font-bold text-center leading-tight">
            Connect.{"\n"}Collaborate.{"\n"}Grow.
          </Text>
          <Text className="text-gray-mid text-base text-center mt-4 leading-relaxed">
            The platform where influencers and businesses discover each other and build powerful partnerships.
          </Text>
        </View>

        {/* Role cards */}
        <View className="gap-3 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-dark-2 rounded-2xl p-4 border border-dark-3">
              <Text className="text-2xl mb-2">🎤</Text>
              <Text className="text-white font-semibold text-sm">Influencers</Text>
              <Text className="text-gray-mid text-xs mt-1">Find brand deals & grow your income</Text>
            </View>
            <View className="flex-1 bg-dark-2 rounded-2xl p-4 border border-dark-3">
              <Text className="text-2xl mb-2">🏢</Text>
              <Text className="text-white font-semibold text-sm">Businesses</Text>
              <Text className="text-gray-mid text-xs mt-1">Discover creators for your campaigns</Text>
            </View>
          </View>

          {/* CTAs */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center"
            onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-white font-bold text-base">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-dark-3 rounded-2xl py-4 items-center"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
