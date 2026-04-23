import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";

interface InfluencerStats {
  platformsCount: number;
  servicesCount: number;
}


export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [influencerStats, setInfluencerStats] = useState<InfluencerStats | null>(null);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const isInfluencer = profile?.role === "influencer";

  useEffect(() => {
    if (!profile?.id || !isInfluencer) return;

    Promise.all([
      supabase
        .from("influencer_platforms")
        .select("id", { count: "exact", head: true })
        .eq("influencer_id", profile.id),
      supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .eq("influencer_id", profile.id),
    ]).then(([platforms, services]) => {
      setInfluencerStats({
        platformsCount: platforms.count ?? 0,
        servicesCount: services.count ?? 0,
      });
    });
  }, [profile?.id]);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View>
            <Text className="text-gray-mid text-sm">Welcome back 👋</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              Hey, {firstName}!
            </Text>
          </View>
          <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
            <Text className="text-white font-bold text-base">
              {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
        </View>

        {/* Role badge */}
        <View className="flex-row mb-5">
          <View
            className={`px-3 py-1 rounded-full ${
              isInfluencer ? "bg-primary/20" : "bg-accent/20"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isInfluencer ? "text-primary" : "text-accent"
              }`}
            >
              {isInfluencer ? "🎤 Influencer" : "🏢 Business"}
            </Text>
          </View>
        </View>

        {/* ── Influencer view ─────────────────────────────────────── */}
        {isInfluencer && (
          <>
            {/* Stats row */}
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Platforms</Text>
                <Text className="text-white text-2xl font-bold">
                  {influencerStats?.platformsCount ?? "—"}
                </Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Services</Text>
                <Text className="text-white text-2xl font-bold">
                  {influencerStats?.servicesCount ?? "—"}
                </Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Collabs</Text>
                <Text className="text-white text-2xl font-bold">0</Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity
              className="bg-primary rounded-2xl p-5 mb-4"
              onPress={() => router.push("/(tabs)/discover")}
            >
              <Text className="text-white font-bold text-base mb-1">
                Find Brand Deals 🏷️
              </Text>
              <Text className="text-white/70 text-sm">
                Browse businesses looking for creators like you
              </Text>
            </TouchableOpacity>

            {/* Active collabs */}
            <View className="bg-dark-2 border border-dark-3 rounded-2xl p-5 mb-4">
              <Text className="text-white font-bold text-base mb-3">
                Active Collaborations
              </Text>
              <View className="items-center py-4">
                <Text className="text-3xl mb-2">🤝</Text>
                <Text className="text-gray-mid text-sm text-center">
                  No active collaborations yet.{"\n"}Start by browsing brands.
                </Text>
              </View>
            </View>

            {/* Tips */}
            <View className="bg-dark-2 border border-dark-3 rounded-2xl p-5">
              <Text className="text-white font-bold text-base mb-3">
                Tips to get discovered
              </Text>
              {[
                "✅  Complete your profile with a photo gallery",
                "✅  Add all your services with clear pricing",
                "✅  Keep your platform URLs up to date",
              ].map((tip, i) => (
                <Text key={i} className="text-gray-mid text-sm py-1.5">
                  {tip}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* ── Business view ────────────────────────────────────────── */}
        {!isInfluencer && (
          <>
            {/* Stats row */}
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Campaigns</Text>
                <Text className="text-white text-2xl font-bold">0</Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Collabs</Text>
                <Text className="text-white text-2xl font-bold">0</Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-gray-mid text-xs mb-1">Spent</Text>
                <Text className="text-white text-2xl font-bold">$0</Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity
              className="bg-primary rounded-2xl p-5 mb-4"
              onPress={() => router.push("/(tabs)/discover")}
            >
              <Text className="text-white font-bold text-base mb-1">
                Find Influencers 🎤
              </Text>
              <Text className="text-white/70 text-sm">
                Browse creators ready to promote your brand
              </Text>
            </TouchableOpacity>

            {/* Active collabs */}
            <View className="bg-dark-2 border border-dark-3 rounded-2xl p-5 mb-4">
              <Text className="text-white font-bold text-base mb-3">
                Active Collaborations
              </Text>
              <View className="items-center py-4">
                <Text className="text-3xl mb-2">🤝</Text>
                <Text className="text-gray-mid text-sm text-center">
                  No active collaborations yet.{"\n"}Start by finding influencers.
                </Text>
              </View>
            </View>

            {/* How it works */}
            <View className="bg-dark-2 border border-dark-3 rounded-2xl p-5">
              <Text className="text-white font-bold text-base mb-3">
                How it works
              </Text>
              {[
                "🔍  Search influencers by platform & niche",
                "🛒  Browse their fixed-price service menu",
                "🤝  Send a collaboration request",
                "💰  Pay securely through the platform",
              ].map((step, i) => (
                <Text key={i} className="text-gray-mid text-sm py-1.5">
                  {step}
                </Text>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
