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
import { useAuth } from "../../lib/AuthContext";

const INDUSTRIES = [
  "Fashion & Apparel", "Beauty & Cosmetics", "Food & Beverage",
  "Technology", "Health & Wellness", "Travel & Hospitality",
  "Finance", "Entertainment", "Sports & Fitness", "Education",
  "Home & Living", "Automotive", "Gaming", "Retail", "Other",
];

const COMPANY_SIZES = [
  { label: "1–10", value: "1-10" },
  { label: "11–50", value: "11-50" },
  { label: "51–200", value: "51-200" },
  { label: "200+", value: "200+" },
];

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!companyName.trim()) {
      Alert.alert("Missing field", "Please enter your company name.");
      return;
    }
    if (!selectedIndustry) {
      Alert.alert("Select industry", "Please select your industry.");
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const user = authData?.user;
      if (!user) throw new Error("Not authenticated. Please sign in again.");

      const fullName = user.user_metadata?.full_name ?? "";

      // Insert base profile
      const { data: savedProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          role: "business",
          full_name: fullName,
          bio: bio.trim() || null,
          location: location.trim() || null,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Insert business-specific profile
      const { error: businessError } = await supabase
        .from("business_profiles")
        .insert({
          id: savedProfile.id,
          company_name: companyName.trim(),
          industry: selectedIndustry,
          website: website.trim() || null,
          company_size: selectedSize,
        });

      if (businessError) throw businessError;

      await refreshProfile();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Business profile save error:", error);
      const msg =
        error?.message ||
        error?.details ||
        "Something went wrong. Please try again.";
      Alert.alert("Couldn't save profile", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mt-4 mb-6">
          <View className="flex-row items-center mb-1">
            <View className="flex-1 h-1 bg-primary rounded-full" />
            <View className="flex-1 h-1 bg-dark-3 rounded-full mx-1" />
          </View>
          <Text className="text-gray-mid text-xs mt-2">Step 2 of 2</Text>
          <Text className="text-white text-2xl font-bold mt-3">
            Set Up Your Business Profile
          </Text>
          <Text className="text-gray-mid text-sm mt-1">
            Help influencers discover your brand
          </Text>
        </View>

        {/* Company Name */}
        <View className="mb-5">
          <Text className="text-white font-semibold mb-2">Company Name</Text>
          <TextInput
            className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-sm"
            placeholder="Your company or brand name"
            placeholderTextColor="#9CA3AF"
            value={companyName}
            onChangeText={setCompanyName}
          />
        </View>

        {/* Bio */}
        <View className="mb-5">
          <Text className="text-white font-semibold mb-2">About Your Brand</Text>
          <TextInput
            className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 text-white text-sm"
            placeholder="What does your brand do? What are you looking for?"
            placeholderTextColor="#9CA3AF"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />
        </View>

        {/* Website */}
        <View className="mb-5">
          <Text className="text-white font-semibold mb-2">
            Website{" "}
            <Text className="text-gray-mid font-normal">(optional)</Text>
          </Text>
          <TextInput
            className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-sm"
            placeholder="https://yourwebsite.com"
            placeholderTextColor="#9CA3AF"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        {/* Location */}
        <View className="mb-5">
          <Text className="text-white font-semibold mb-2">Location</Text>
          <TextInput
            className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-sm"
            placeholder="City, Country"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Company Size */}
        <View className="mb-5">
          <Text className="text-white font-semibold mb-3">Company Size</Text>
          <View className="flex-row gap-2">
            {COMPANY_SIZES.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                onPress={() => setSelectedSize(value)}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  selectedSize === value
                    ? "bg-primary border-primary"
                    : "bg-dark-2 border-dark-3"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedSize === value ? "text-white" : "text-gray-mid"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Industry */}
        <View className="mb-8">
          <Text className="text-white font-semibold mb-1">Industry</Text>
          <Text className="text-gray-mid text-xs mb-3">Select your primary industry</Text>
          <View className="flex-row flex-wrap gap-2">
            {INDUSTRIES.map((industry) => (
              <TouchableOpacity
                key={industry}
                onPress={() => setSelectedIndustry(industry)}
                className={`px-4 py-2 rounded-full border ${
                  selectedIndustry === industry
                    ? "bg-primary border-primary"
                    : "bg-dark-2 border-dark-3"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedIndustry === industry ? "text-white" : "text-gray-mid"
                  }`}
                >
                  {industry}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          className={`rounded-2xl py-4 items-center ${
            loading ? "bg-primary/50" : "bg-primary"
          }`}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">
              Complete Profile
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
