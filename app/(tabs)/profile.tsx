import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";

interface InfluencerDetails {
  niche: string[];
  platforms: string[];
  platformsCount: number;
  servicesCount: number;
}

interface BusinessDetails {
  company_name: string;
  industry: string;
  website?: string;
  company_size?: string;
}

function SettingsRow({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-dark-3"
    >
      <Text className="text-lg w-8">{icon}</Text>
      <Text
        className={`flex-1 text-sm font-medium ${
          destructive ? "text-accent" : "text-white"
        }`}
      >
        {label}
      </Text>
      {!destructive && <Text className="text-gray-mid text-xs">›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const isInfluencer = profile?.role === "influencer";

  const [influencerDetails, setInfluencerDetails] = useState<InfluencerDetails | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    if (isInfluencer) {
      Promise.all([
        supabase
          .from("influencer_profiles")
          .select("niche, platforms")
          .eq("id", profile.id)
          .single(),
        supabase
          .from("influencer_platforms")
          .select("id", { count: "exact", head: true })
          .eq("influencer_id", profile.id),
        supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("influencer_id", profile.id),
      ]).then(([profileData, platformsData, servicesData]) => {
        setInfluencerDetails({
          niche: profileData.data?.niche ?? [],
          platforms: profileData.data?.platforms ?? [],
          platformsCount: platformsData.count ?? 0,
          servicesCount: servicesData.count ?? 0,
        });
      });
    } else {
      supabase
        .from("business_profiles")
        .select("company_name, industry, website, company_size")
        .eq("id", profile.id)
        .single()
        .then(({ data }) => {
          if (data) setBusinessDetails(data as BusinessDetails);
        });
    }
  }, [profile?.id]);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Profile header ───────────────────────────────────── */}
        <View className="items-center px-6 pt-6 pb-5">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text className="text-white text-xl font-bold">{profile?.full_name}</Text>

          {profile?.tagline ? (
            <Text className="text-gray-mid text-sm mt-1 text-center">
              {profile.tagline}
            </Text>
          ) : null}

          <View className="flex-row items-center gap-2 mt-2">
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
            {profile?.location ? (
              <Text className="text-gray-mid text-xs">📍 {profile.location}</Text>
            ) : null}
          </View>
        </View>

        {/* ── Bio ─────────────────────────────────────────────── */}
        {profile?.bio ? (
          <View className="mx-6 mb-4 bg-dark-2 border border-dark-3 rounded-2xl p-4">
            <Text className="text-gray-mid text-sm leading-5">{profile.bio}</Text>
          </View>
        ) : null}

        {/* ── Influencer details ───────────────────────────────── */}
        {isInfluencer && influencerDetails && (
          <>
            {/* Stats */}
            <View className="flex-row gap-3 mx-6 mb-4">
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4 items-center">
                <Text className="text-white text-xl font-bold">
                  {influencerDetails.platformsCount}
                </Text>
                <Text className="text-gray-mid text-xs mt-1">Platforms</Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4 items-center">
                <Text className="text-white text-xl font-bold">
                  {influencerDetails.servicesCount}
                </Text>
                <Text className="text-gray-mid text-xs mt-1">Services</Text>
              </View>
              <View className="flex-1 bg-dark-2 border border-dark-3 rounded-2xl p-4 items-center">
                <Text className="text-white text-xl font-bold">0</Text>
                <Text className="text-gray-mid text-xs mt-1">Collabs</Text>
              </View>
            </View>

            {/* Niches */}
            {influencerDetails.niche?.length > 0 && (
              <View className="mx-6 mb-4 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-white font-semibold text-sm mb-3">Niches</Text>
                <View className="flex-row flex-wrap gap-2">
                  {influencerDetails.niche.map((n) => (
                    <View key={n} className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-primary text-xs font-medium">{n}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Platforms */}
            {influencerDetails.platforms?.length > 0 && (
              <View className="mx-6 mb-4 bg-dark-2 border border-dark-3 rounded-2xl p-4">
                <Text className="text-white font-semibold text-sm mb-3">Platforms</Text>
                <View className="flex-row flex-wrap gap-2">
                  {influencerDetails.platforms.map((p) => (
                    <View key={p} className="bg-dark-3 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-medium">{p}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* ── Business details ─────────────────────────────────── */}
        {!isInfluencer && businessDetails && (
          <View className="mx-6 mb-4 bg-dark-2 border border-dark-3 rounded-2xl p-4">
            <Text className="text-white font-semibold text-sm mb-3">Company Info</Text>
            <View className="gap-2">
              <View className="flex-row">
                <Text className="text-gray-mid text-sm w-24">Company</Text>
                <Text className="text-white text-sm flex-1">
                  {businessDetails.company_name}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-gray-mid text-sm w-24">Industry</Text>
                <Text className="text-white text-sm flex-1">
                  {businessDetails.industry}
                </Text>
              </View>
              {businessDetails.website ? (
                <View className="flex-row">
                  <Text className="text-gray-mid text-sm w-24">Website</Text>
                  <Text className="text-primary text-sm flex-1" numberOfLines={1}>
                    {businessDetails.website}
                  </Text>
                </View>
              ) : null}
              {businessDetails.company_size ? (
                <View className="flex-row">
                  <Text className="text-gray-mid text-sm w-24">Size</Text>
                  <Text className="text-white text-sm flex-1">
                    {businessDetails.company_size} employees
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* ── Account ──────────────────────────────────────────── */}
        <View className="mx-6 mb-4">
          <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-2">
            Account
          </Text>
          <View className="bg-dark-2 border border-dark-3 rounded-2xl px-4">
            <View className="py-4 border-b border-dark-3">
              <Text className="text-gray-mid text-xs mb-0.5">Email</Text>
              <Text className="text-white text-sm">{profile?.user_id ? "—" : "—"}</Text>
            </View>
            <SettingsRow
              icon="✏️"
              label="Edit Profile"
              onPress={() => Alert.alert("Coming soon", "Profile editing coming soon.")}
            />
            <SettingsRow
              icon="🔒"
              label="Change Password"
              onPress={() => Alert.alert("Coming soon", "Password change coming soon.")}
            />
          </View>
        </View>

        {/* ── Preferences ──────────────────────────────────────── */}
        <View className="mx-6 mb-4">
          <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-2">
            Preferences
          </Text>
          <View className="bg-dark-2 border border-dark-3 rounded-2xl px-4">
            <SettingsRow
              icon="🔔"
              label="Notifications"
              onPress={() => Alert.alert("Coming soon", "Notification settings coming soon.")}
            />
            <SettingsRow
              icon="🔐"
              label="Privacy"
              onPress={() => Alert.alert("Coming soon", "Privacy settings coming soon.")}
            />
          </View>
        </View>

        {/* ── Sign out ─────────────────────────────────────────── */}
        <View className="mx-6">
          <View className="bg-dark-2 border border-dark-3 rounded-2xl px-4">
            <SettingsRow
              icon="🚪"
              label="Sign Out"
              onPress={handleSignOut}
              destructive
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
