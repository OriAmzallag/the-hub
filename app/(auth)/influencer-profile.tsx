import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import type { PlatformEntry, ServiceEntry } from "../../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const NICHES = [
  "Fashion", "Beauty", "Fitness", "Food", "Travel",
  "Tech", "Gaming", "Finance", "Lifestyle", "Music",
  "Art", "Education", "Sports", "Health", "Business",
];

const PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Twitter",
  "Amazon",
];

const PLATFORM_SERVICE_TYPES: Record<string, string[]> = {
  "Instagram": ["Story", "Feed Post", "Reel", "Carousel"],
  "TikTok":    ["Short Video", "Duet", "Stitch", "Live Mention"],
  "YouTube":   ["Dedicated Video", "Integration", "Short", "Community Post"],
  "Twitter":   ["Tweet/Post", "Thread", "Space Mention", "Quote Tweet"],
  "Amazon":    ["Product Review", "Storefront Feature", "Live Stream", "Influencer Post"],
};

const MAX_GALLERY = 6;

const STEP_TITLES = ["", "Bio & Tagline", "Your Platforms", "Your Services", "Gallery"];
const STEP_SUBTITLES = [
  "",
  "Introduce yourself to brands",
  "Select platforms & add your details",
  "Define your pricing menu",
  "Show your best work (up to 6 photos)",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function InfluencerProfileScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  // Step 2
  const [platformEntries, setPlatformEntries] = useState<PlatformEntry[]>([]);

  // Step 3
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);

  // Step 4
  const [galleryItems, setGalleryItems] = useState<{ uri: string; url: string | null }[]>([]);

  // ── Navigation ──────────────────────────────────────────────────

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!bio.trim()) {
        Alert.alert("Required", "Please enter your bio.");
        return false;
      }
      if (selectedNiches.length === 0) {
        Alert.alert("Required", "Select at least one niche.");
        return false;
      }
    }
    if (step === 2) {
      if (platformEntries.length === 0) {
        Alert.alert("Required", "Add at least one platform.");
        return false;
      }
      const incomplete = platformEntries.find((p) => !p.profile_url.trim());
      if (incomplete) {
        Alert.alert("Required", `Add a profile URL for ${incomplete.platform_name}.`);
        return false;
      }
    }
    if (step === 3) {
      const bad = serviceEntries.find((s) => !s.price || parseFloat(s.price) <= 0);
      if (bad) {
        Alert.alert("Invalid price", "All services must have a price greater than $0.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 4) as 1 | 2 | 3 | 4);
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3 | 4);
  };

  // ── Step 1 helpers ──────────────────────────────────────────────

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  // ── Step 2 helpers ──────────────────────────────────────────────

  const togglePlatform = (name: string) => {
    const exists = platformEntries.find((p) => p.platform_name === name);
    if (exists) {
      setPlatformEntries((prev) => prev.filter((p) => p.platform_name !== name));
    } else {
      setPlatformEntries((prev) => [
        ...prev,
        { platform_name: name, profile_url: "", followers_count: "" },
      ]);
    }
  };

  const updatePlatformField = (
    name: string,
    field: "profile_url" | "followers_count",
    value: string
  ) => {
    setPlatformEntries((prev) =>
      prev.map((p) => (p.platform_name === name ? { ...p, [field]: value } : p))
    );
  };

  // ── Step 3 helpers ──────────────────────────────────────────────

  const addService = () => {
    const defaultPlatform = platformEntries[0]?.platform_name ?? PLATFORMS[0];
    setServiceEntries((prev) => [
      ...prev,
      {
        platform: defaultPlatform,
        service_type: PLATFORM_SERVICE_TYPES[defaultPlatform]?.[0] ?? "Post",
        price: "",
      },
    ]);
  };

  const removeService = (index: number) => {
    setServiceEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceField = (index: number, field: keyof ServiceEntry, value: string) => {
    setServiceEntries((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const updated = { ...s, [field]: value };
        if (field === "platform") {
          updated.service_type = PLATFORM_SERVICE_TYPES[value]?.[0] ?? "Post";
        }
        return updated;
      })
    );
  };

  // ── Step 4 helpers ──────────────────────────────────────────────

  const pickGalleryPhoto = async () => {
    if (galleryItems.length >= MAX_GALLERY) {
      Alert.alert("Limit reached", `You can upload up to ${MAX_GALLERY} photos.`);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setGalleryItems((prev) => [...prev, { uri: result.assets[0].uri, url: null }]);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit ──────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const user = authData?.user;
      if (!user) throw new Error("Not authenticated. Please sign in again.");

      const fullName = user.user_metadata?.full_name ?? "";

      // 1. Insert base profile — core, must succeed
      const { data: savedProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          role: "influencer",
          full_name: fullName,
          bio: bio.trim() || null,
          tagline: tagline.trim() || null,
          location: location.trim() || null,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Insert influencer profile — core, must succeed
      const { error: influencerError } = await supabase
        .from("influencer_profiles")
        .insert({
          id: savedProfile.id,
          niche: selectedNiches,
          platforms: platformEntries.map((p) => p.platform_name),
          gallery_images: [],
        });

      if (influencerError) throw influencerError;

      // 3. Upload gallery images — non-fatal, skip on any failure
      const galleryUrls: string[] = [];
      if (galleryItems.length > 0) {
        try {
          for (let i = 0; i < galleryItems.length; i++) {
            const item = galleryItems[i];
            const ext = item.uri.split(".").pop()?.toLowerCase() ?? "jpg";
            const filePath = `${user.id}/${Date.now()}_${i}.${ext}`;
            const response = await fetch(item.uri);
            const blob = await response.blob();
            const { error: uploadError } = await supabase.storage
              .from("influencer-gallery")
              .upload(filePath, blob, {
                contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
                upsert: false,
              });
            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from("influencer-gallery")
                .getPublicUrl(filePath);
              galleryUrls.push(publicUrl);
            }
          }
          if (galleryUrls.length > 0) {
            await supabase
              .from("influencer_profiles")
              .update({ gallery_images: galleryUrls })
              .eq("id", savedProfile.id);
          }
        } catch (galleryErr) {
          console.warn("Gallery upload failed (non-fatal):", galleryErr);
        }
      }

      // 4. Batch insert platforms — non-fatal
      if (platformEntries.length > 0) {
        try {
          await supabase.from("influencer_platforms").insert(
            platformEntries.map((p) => ({
              influencer_id: savedProfile.id,
              platform_name: p.platform_name,
              profile_url: p.profile_url.trim() || null,
              followers_count: parseInt(p.followers_count) || 0,
            }))
          );
        } catch (platformErr) {
          console.warn("Platforms insert failed (non-fatal):", platformErr);
        }
      }

      // 5. Batch insert services — non-fatal
      if (serviceEntries.length > 0) {
        try {
          await supabase.from("services").insert(
            serviceEntries.map((s) => ({
              influencer_id: savedProfile.id,
              platform: s.platform,
              service_type: s.service_type,
              price: parseFloat(s.price),
              currency: "USD",
            }))
          );
        } catch (serviceErr) {
          console.warn("Services insert failed (non-fatal):", serviceErr);
        }
      }

      await refreshProfile();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Profile save error:", error);
      const msg =
        error?.message ||
        error?.details ||
        "Something went wrong. Please try again.";
      Alert.alert("Couldn't save profile", msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-dark">
      {/* Progress bar */}
      <View className="px-6 pt-4">
        <View className="flex-row gap-1">
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              className={`flex-1 h-1 rounded-full ${
                step <= currentStep ? "bg-primary" : "bg-dark-3"
              }`}
            />
          ))}
        </View>
        <Text className="text-gray-mid text-xs mt-2">
          Step {currentStep} of 4
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step header */}
        <View className="mt-3 mb-6">
          <Text className="text-white text-2xl font-bold">
            {STEP_TITLES[currentStep]}
          </Text>
          <Text className="text-gray-mid text-sm mt-1">
            {STEP_SUBTITLES[currentStep]}
          </Text>
        </View>

        {/* ── Step 1: Bio & Tagline ──────────────────────────────── */}
        {currentStep === 1 && (
          <>
            {/* Tagline */}
            <View className="mb-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-semibold">
                  Tagline{" "}
                  <Text className="text-gray-mid font-normal">(optional)</Text>
                </Text>
                <Text className="text-gray-mid text-xs">{tagline.length}/100</Text>
              </View>
              <TextInput
                className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-sm"
                placeholder="e.g. Lifestyle creator helping brands reach Gen Z"
                placeholderTextColor="#9CA3AF"
                value={tagline}
                onChangeText={setTagline}
                maxLength={100}
              />
            </View>

            {/* Bio */}
            <View className="mb-5">
              <Text className="text-white font-semibold mb-2">Bio</Text>
              <TextInput
                className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 text-white text-sm"
                placeholder="Tell brands about yourself..."
                placeholderTextColor="#9CA3AF"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: "top" }}
              />
            </View>

            {/* Location */}
            <View className="mb-5">
              <Text className="text-white font-semibold mb-2">
                Location{" "}
                <Text className="text-gray-mid font-normal">(optional)</Text>
              </Text>
              <TextInput
                className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-white text-sm"
                placeholder="City, Country"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Niches */}
            <View className="mb-5">
              <Text className="text-white font-semibold mb-1">Your Niches</Text>
              <Text className="text-gray-mid text-xs mb-3">Select all that apply</Text>
              <View className="flex-row flex-wrap gap-2">
                {NICHES.map((niche) => (
                  <TouchableOpacity
                    key={niche}
                    onPress={() => toggleNiche(niche)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedNiches.includes(niche)
                        ? "bg-primary border-primary"
                        : "bg-dark-2 border-dark-3"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedNiches.includes(niche) ? "text-white" : "text-gray-mid"
                      }`}
                    >
                      {niche}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* ── Step 2: Platforms ──────────────────────────────────── */}
        {currentStep === 2 && (
          <>
            {/* Platform toggle pills */}
            <View className="mb-5">
              <Text className="text-white font-semibold mb-1">Active Platforms</Text>
              <Text className="text-gray-mid text-xs mb-3">
                Select the platforms where you post
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PLATFORMS.map((label) => {
                  const selected = platformEntries.some((p) => p.platform_name === label);
                  return (
                    <TouchableOpacity
                      key={label}
                      onPress={() => togglePlatform(label)}
                      className={`px-4 py-2 rounded-full border ${
                        selected ? "bg-primary border-primary" : "bg-dark-2 border-dark-3"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selected ? "text-white" : "text-gray-mid"
                        }`}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Per-platform detail cards */}
            {platformEntries.map(({ platform_name, profile_url, followers_count }) => {
              return (
                <View
                  key={platform_name}
                  className="bg-dark-2 border border-dark-3 rounded-2xl p-4 mb-3"
                >
                  <Text className="text-white font-semibold mb-3">
                    {platform_name}
                  </Text>
                  <TextInput
                    className="bg-dark border border-dark-3 rounded-xl px-4 py-3 text-white text-sm mb-2"
                    placeholder={`https://${platform_name === "Amazon" ? "amazon.com/shop" : platform_name.toLowerCase() + ".com"}/yourhandle`}
                    placeholderTextColor="#9CA3AF"
                    value={profile_url}
                    onChangeText={(v) => updatePlatformField(platform_name, "profile_url", v)}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TextInput
                    className="bg-dark border border-dark-3 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="Followers count (e.g. 50000)"
                    placeholderTextColor="#9CA3AF"
                    value={followers_count}
                    onChangeText={(v) => updatePlatformField(platform_name, "followers_count", v)}
                    keyboardType="numeric"
                  />
                </View>
              );
            })}

            {platformEntries.length === 0 && (
              <View className="bg-dark-2 border border-dashed border-dark-3 rounded-2xl py-8 items-center">
                <Text className="text-gray-mid text-sm">
                  Select at least one platform above
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── Step 3: Services ───────────────────────────────────── */}
        {currentStep === 3 && (
          <>
            <Text className="text-gray-mid text-sm mb-4">
              Define what brands can book from you. You can update pricing later.
            </Text>

            {serviceEntries.map((service, index) => (
              <View
                key={index}
                className="bg-dark-2 border border-dark-3 rounded-2xl p-4 mb-3"
              >
                {/* Remove button */}
                <TouchableOpacity
                  onPress={() => removeService(index)}
                  className="absolute top-3 right-3 w-7 h-7 items-center justify-center"
                >
                  <Text className="text-gray-mid text-lg leading-none">×</Text>
                </TouchableOpacity>

                {/* Platform selector */}
                <Text className="text-white font-semibold text-xs uppercase tracking-wide mb-2">
                  Platform
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-3"
                  contentContainerStyle={{ gap: 8 }}
                >
                  {platformEntries.map(({ platform_name }) => (
                    <TouchableOpacity
                      key={platform_name}
                      onPress={() => updateServiceField(index, "platform", platform_name)}
                      className={`px-3 py-1.5 rounded-full border ${
                        service.platform === platform_name
                          ? "bg-primary border-primary"
                          : "bg-dark border-dark-3"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          service.platform === platform_name ? "text-white" : "text-gray-mid"
                        }`}
                      >
                        {platform_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Service type selector */}
                <Text className="text-white font-semibold text-xs uppercase tracking-wide mb-2">
                  Service Type
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-3"
                  contentContainerStyle={{ gap: 8 }}
                >
                  {(PLATFORM_SERVICE_TYPES[service.platform] ?? []).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => updateServiceField(index, "service_type", type)}
                      className={`px-3 py-1.5 rounded-full border ${
                        service.service_type === type
                          ? "bg-primary border-primary"
                          : "bg-dark border-dark-3"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          service.service_type === type ? "text-white" : "text-gray-mid"
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Price */}
                <Text className="text-white font-semibold text-xs uppercase tracking-wide mb-2">
                  Price (USD)
                </Text>
                <View className="flex-row items-center bg-dark border border-dark-3 rounded-xl px-4 py-3">
                  <Text className="text-gray-mid text-sm mr-1">$</Text>
                  <TextInput
                    className="flex-1 text-white text-sm"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={service.price}
                    onChangeText={(v) => updateServiceField(index, "price", v)}
                    keyboardType="decimal-pad"
                  />
                </View>

                {/* Preview label */}
                {service.price ? (
                  <Text className="text-gray-mid text-xs mt-2">
                    {service.platform} · {service.service_type} — ${service.price}
                  </Text>
                ) : null}
              </View>
            ))}

            {/* Add service button */}
            <TouchableOpacity
              onPress={addService}
              className="border border-dashed border-dark-3 rounded-2xl py-4 items-center bg-dark-2"
            >
              <Text className="text-primary font-semibold text-sm">+ Add Service</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Step 4: Gallery ────────────────────────────────────── */}
        {currentStep === 4 && (
          <>
            <Text className="text-gray-mid text-sm mb-4">
              Show your content style. Optional — you can add photos later from your profile.
            </Text>

            {/* 3-column photo grid */}
            <View className="flex-row flex-wrap gap-2">
              {galleryItems.map((item, index) => (
                <View key={index} style={{ width: "31%" }} className="aspect-square">
                  <Image
                    source={{ uri: item.uri }}
                    className="w-full h-full rounded-xl"
                    style={{ borderRadius: 12 }}
                  />
                  <TouchableOpacity
                    onPress={() => removeGalleryPhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-dark/80 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-xs leading-none">×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {galleryItems.length < MAX_GALLERY && (
                <TouchableOpacity
                  onPress={pickGalleryPhoto}
                  style={{ width: "31%" }}
                  className="aspect-square bg-dark-2 border border-dashed border-dark-3 rounded-xl items-center justify-center"
                >
                  <Text className="text-gray-mid text-2xl">+</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text className="text-gray-mid text-xs mt-3">
              {galleryItems.length}/{MAX_GALLERY} photos added
            </Text>
          </>
        )}

        {/* Navigation buttons */}
        <View className="flex-row gap-3 mt-8">
          {currentStep > 1 && (
            <TouchableOpacity
              className="flex-1 rounded-2xl py-4 items-center border border-dark-3"
              onPress={goBack}
              disabled={loading}
            >
              <Text className="text-gray-mid font-bold text-base">Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`flex-1 rounded-2xl py-4 items-center ${
              loading ? "opacity-50 bg-primary" : "bg-primary"
            }`}
            onPress={currentStep === 4 ? handleSubmit : goNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">
                {currentStep === 4 ? "Complete Profile" : "Next"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
