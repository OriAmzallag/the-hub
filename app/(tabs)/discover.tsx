import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";
import { ProfileModal, type ModalProfile } from "../../components/ProfileModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter", "Amazon"];

const NICHES = [
  "Fashion", "Beauty", "Fitness", "Food", "Travel",
  "Tech", "Gaming", "Finance", "Lifestyle", "Music",
  "Art", "Education", "Sports", "Health", "Business",
];

const FOLLOWER_RANGES = [
  { label: "Nano", sublabel: "<10K", min: 0, max: 9999 },
  { label: "Micro", sublabel: "10K–50K", min: 10000, max: 49999 },
  { label: "Mid", sublabel: "50K–500K", min: 50000, max: 499999 },
  { label: "Macro", sublabel: "500K+", min: 500000, max: null },
];

const INDUSTRIES = [
  "Fashion & Apparel", "Beauty & Cosmetics", "Food & Beverage",
  "Technology", "Health & Wellness", "Travel & Hospitality",
  "Finance", "Entertainment", "Sports & Fitness",
  "Education", "Home & Living", "Automotive", "Gaming", "Retail", "Other",
];

const BUDGET_RANGES = [
  { label: "Under $500", max: 500 },
  { label: "$500–$2K", max: 2000 },
  { label: "$2K–$10K", max: 10000 },
  { label: "$10K+", max: null },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface InfluencerResult {
  id: string;
  full_name: string;
  bio?: string;
  tagline?: string;
  location?: string;
  niche: string[];
  platforms: string[];
  top_followers?: number;
}

interface BusinessResult {
  id: string;
  full_name: string;
  company_name: string;
  industry: string;
  website?: string;
  location?: string;
  bio?: string;
}

// ─── Filter pill component ────────────────────────────────────────────────────

function FilterPill({
  label,
  sublabel,
  selected,
  onPress,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-3 py-1.5 rounded-full border mr-2 ${
        selected ? "bg-primary border-primary" : "bg-dark-2 border-dark-3"
      }`}
    >
      <Text className={`text-xs font-medium ${selected ? "text-white" : "text-gray-mid"}`}>
        {label}
        {sublabel ? (
          <Text className={`text-xs ${selected ? "text-white/70" : "text-gray-mid/70"}`}>
            {" "}{sublabel}
          </Text>
        ) : null}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Result cards ─────────────────────────────────────────────────────────────

function InfluencerCard({ item, onPress }: { item: InfluencerResult; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-dark-2 border border-dark-3 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-full bg-primary/30 items-center justify-center mr-3">
          <Text className="text-primary font-bold">
            {item.full_name?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold">{item.full_name}</Text>
          {item.tagline ? (
            <Text className="text-gray-mid text-xs mt-0.5" numberOfLines={1}>
              {item.tagline}
            </Text>
          ) : null}
        </View>
        {item.location ? (
          <Text className="text-gray-mid text-xs">{item.location}</Text>
        ) : null}
      </View>

      {item.niche?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
          className="mb-2"
        >
          {item.niche.slice(0, 4).map((n) => (
            <View key={n} className="bg-dark-3 rounded-full px-2 py-0.5">
              <Text className="text-gray-mid text-xs">{n}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View className="flex-row flex-wrap gap-1">
        {item.platforms?.map((p) => (
          <View key={p} className="bg-primary/10 rounded-full px-2 py-0.5">
            <Text className="text-primary text-xs">{p}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

function BusinessCard({ item, onPress }: { item: BusinessResult; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-dark-2 border border-dark-3 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Text className="text-accent font-bold">
            {item.company_name?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold">{item.company_name}</Text>
          <Text className="text-gray-mid text-xs mt-0.5">{item.industry}</Text>
        </View>
        {item.location ? (
          <Text className="text-gray-mid text-xs">{item.location}</Text>
        ) : null}
      </View>
      {item.bio ? (
        <Text className="text-gray-mid text-sm" numberOfLines={2}>
          {item.bio}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function DiscoverScreen() {
  const { profile } = useAuth();
  const isInfluencer = profile?.role === "influencer";

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<InfluencerResult[] | BusinessResult[]>([]);

  const [modalProfile, setModalProfile] = useState<ModalProfile | null>(null);

  // Business filters (searching influencers)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [selectedFollowerRange, setSelectedFollowerRange] = useState<number | null>(null);

  // Influencer filters (searching businesses)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      if (!isInfluencer) {
        // Business → search influencers
        let query = supabase
          .from("profiles")
          .select(`
            id, full_name, bio, tagline, location,
            influencer_profiles!inner (
              niche,
              platforms
            )
          `)
          .eq("role", "influencer")
          .neq("user_id", profile?.user_id ?? "");

        if (searchText.trim()) {
          query = query.ilike("full_name", `%${searchText.trim()}%`);
        }
        if (selectedPlatform) {
          query = query.contains("influencer_profiles.platforms", [selectedPlatform]);
        }
        if (selectedNiche) {
          query = query.contains("influencer_profiles.niche", [selectedNiche]);
        }

        const { data, error } = await query.limit(30);
        if (error) throw error;

        const mapped: InfluencerResult[] = (data ?? []).map((row: any) => ({
          id: row.id,
          full_name: row.full_name,
          bio: row.bio,
          tagline: row.tagline,
          location: row.location,
          niche: row.influencer_profiles?.niche ?? [],
          platforms: row.influencer_profiles?.platforms ?? [],
        }));
        setResults(mapped);
      } else {
        // Influencer → search businesses
        let query = supabase
          .from("profiles")
          .select(`
            id, full_name, bio, location,
            business_profiles!inner (
              company_name,
              industry,
              website
            )
          `)
          .eq("role", "business")
          .neq("user_id", profile?.user_id ?? "");

        if (searchText.trim()) {
          query = query.ilike("business_profiles.company_name", `%${searchText.trim()}%`);
        }
        if (selectedIndustry) {
          query = query.eq("business_profiles.industry", selectedIndustry);
        }

        const { data, error } = await query.limit(30);
        if (error) throw error;

        const mapped: BusinessResult[] = (data ?? []).map((row: any) => ({
          id: row.id,
          full_name: row.full_name,
          bio: row.bio,
          location: row.location,
          company_name: row.business_profiles?.company_name ?? "",
          industry: row.business_profiles?.industry ?? "",
          website: row.business_profiles?.website,
        }));
        setResults(mapped);
      }
    } catch {
      // silent — empty state handles it
    } finally {
      setLoading(false);
    }
  }, [isInfluencer, searchText, selectedPlatform, selectedNiche, selectedFollowerRange, selectedIndustry, selectedBudget, profile]);

  useEffect(() => {
    if (profile) search();
  }, [profile, selectedPlatform, selectedNiche, selectedFollowerRange, selectedIndustry, selectedBudget]);

  const clearFilters = () => {
    setSelectedPlatform(null);
    setSelectedNiche(null);
    setSelectedFollowerRange(null);
    setSelectedIndustry(null);
    setSelectedBudget(null);
    setSearchText("");
  };

  const hasActiveFilters =
    selectedPlatform || selectedNiche || selectedFollowerRange !== null ||
    selectedIndustry || selectedBudget !== null;

  return (
    <SafeAreaView className="flex-1 bg-dark">
      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold mb-4">
          {isInfluencer ? "Find Brands" : "Find Influencers"}
        </Text>

        {/* Search bar */}
        <View className="flex-row items-center bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 gap-2">
          <TextInput
            className="flex-1 text-white text-sm"
            placeholder={isInfluencer ? "Search brands..." : "Search influencers..."}
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={search}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(""); search(); }}>
              <Text className="text-gray-mid text-sm">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Business filters (searching influencers) ─────────── */}
        {!isInfluencer && (
          <View className="mb-2">
            {/* Platform filter */}
            <View className="mb-3">
              <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide px-6 mb-2">
                Platform
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {PLATFORMS.map((p) => (
                  <FilterPill
                    key={p}
                    label={p}
                    selected={selectedPlatform === p}
                    onPress={() => setSelectedPlatform(selectedPlatform === p ? null : p)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Niche filter */}
            <View className="mb-3">
              <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide px-6 mb-2">
                Niche
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {NICHES.map((n) => (
                  <FilterPill
                    key={n}
                    label={n}
                    selected={selectedNiche === n}
                    onPress={() => setSelectedNiche(selectedNiche === n ? null : n)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Follower range filter */}
            <View className="mb-3">
              <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide px-6 mb-2">
                Audience Size
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {FOLLOWER_RANGES.map((r, i) => (
                  <FilterPill
                    key={r.label}
                    label={r.label}
                    sublabel={r.sublabel}
                    selected={selectedFollowerRange === i}
                    onPress={() => setSelectedFollowerRange(selectedFollowerRange === i ? null : i)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* ── Influencer filters (searching businesses) ─────────── */}
        {isInfluencer && (
          <View className="mb-2">
            {/* Industry filter */}
            <View className="mb-3">
              <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide px-6 mb-2">
                Industry
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {INDUSTRIES.map((ind) => (
                  <FilterPill
                    key={ind}
                    label={ind}
                    selected={selectedIndustry === ind}
                    onPress={() => setSelectedIndustry(selectedIndustry === ind ? null : ind)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Budget filter */}
            <View className="mb-3">
              <Text className="text-gray-mid text-xs font-semibold uppercase tracking-wide px-6 mb-2">
                Budget
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {BUDGET_RANGES.map((b, i) => (
                  <FilterPill
                    key={b.label}
                    label={b.label}
                    selected={selectedBudget === i}
                    onPress={() => setSelectedBudget(selectedBudget === i ? null : i)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={clearFilters}
            className="mx-6 mb-3 flex-row items-center gap-1"
          >
            <Text className="text-primary text-sm font-semibold">✕ Clear filters</Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View className="h-px bg-dark-3 mx-6 mb-4" />

        {/* Results */}
        <View className="px-6">
          {loading ? (
            <ActivityIndicator color="#6C47FF" className="mt-8" />
          ) : results.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-white font-semibold text-base mb-1">
                {hasActiveFilters ? "No results for these filters" : "No one here yet"}
              </Text>
              <Text className="text-gray-mid text-sm text-center">
                {hasActiveFilters
                  ? "Try adjusting or clearing your filters"
                  : "Be the first to invite others to THE HUB"}
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-gray-mid text-xs mb-3">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </Text>
              {isInfluencer
                ? (results as BusinessResult[]).map((item) => (
                    <BusinessCard
                      key={item.id}
                      item={item}
                      onPress={() =>
                        setModalProfile({
                          id: item.id,
                          full_name: item.full_name,
                          bio: item.bio,
                          location: item.location,
                          company_name: item.company_name,
                          industry: item.industry,
                        })
                      }
                    />
                  ))
                : (results as InfluencerResult[]).map((item) => (
                    <InfluencerCard
                      key={item.id}
                      item={item}
                      onPress={() =>
                        setModalProfile({
                          id: item.id,
                          full_name: item.full_name,
                          bio: item.bio,
                          tagline: item.tagline,
                          location: item.location,
                          niche: item.niche,
                          platforms: item.platforms,
                        })
                      }
                    />
                  ))}
            </>
          )}
        </View>
      </ScrollView>

      <ProfileModal
        visible={modalProfile !== null}
        profile={modalProfile}
        role={isInfluencer ? "business" : "influencer"}
        onClose={() => setModalProfile(null)}
      />
    </SafeAreaView>
  );
}
