import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

const INFLUENCER_FAQS = [
  {
    q: "What's your typical turnaround time?",
    a: "I usually deliver within 3–5 business days after receiving the brief.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes — one round of revisions is included in each service.",
  },
  {
    q: "How do payments work?",
    a: "Payment is held in escrow and released upon delivery approval.",
  },
];

const BUSINESS_FAQS = [
  {
    q: "What kind of collaborations are you looking for?",
    a: "We're open to long-term brand ambassador relationships and one-off campaign posts.",
  },
  {
    q: "How do I get started?",
    a: "Send a collaboration request and we'll respond within 48 hours.",
  },
  {
    q: "What's the budget range for a typical campaign?",
    a: "Budgets vary by campaign size — send a request and we can discuss specifics.",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalProfile {
  id: string;
  full_name: string;
  bio?: string;
  tagline?: string;
  location?: string;
  // influencer
  niche?: string[];
  platforms?: string[];
  // business
  company_name?: string;
  industry?: string;
}

interface PlatformDetail {
  platform_name: string;
  profile_url?: string;
  followers_count: number;
}

interface ServiceDetail {
  platform: string;
  service_type: string;
  price: number;
  currency: string;
}

interface FetchedData {
  gallery_images: string[];
  platform_details: PlatformDetail[];
  services: ServiceDetail[];
  company_size?: string;
  website?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="mx-6 mb-5 bg-dark-2 border border-dark-3 rounded-2xl p-4">
      {children}
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-white font-semibold text-sm mb-3">{title}</Text>
  );
}

function FaqItem({
  item,
  expanded,
  onToggle,
}: {
  item: { q: string; a: string };
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="bg-dark-2 border border-dark-3 rounded-2xl px-4 py-3"
    >
      <View className="flex-row items-center">
        <Text className="text-white text-sm font-medium flex-1 pr-2">{item.q}</Text>
        <Text className="text-gray-mid text-xs">{expanded ? "▲" : "▼"}</Text>
      </View>
      {expanded && (
        <Text className="text-gray-mid text-sm mt-2 leading-5">{item.a}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileModal({
  visible,
  profile,
  role,
  onClose,
}: {
  visible: boolean;
  profile: ModalProfile | null;
  role: "influencer" | "business";
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FetchedData | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!visible || !profile?.id) return;
    setData(null);
    setExpandedFaq(null);
    fetchDetails(profile.id);
  }, [visible, profile?.id]);

  const fetchDetails = async (id: string) => {
    setLoading(true);
    try {
      if (role === "influencer") {
        const [galleryRes, platformsRes, servicesRes] = await Promise.all([
          supabase
            .from("influencer_profiles")
            .select("gallery_images")
            .eq("id", id)
            .single(),
          supabase
            .from("influencer_platforms")
            .select("platform_name, profile_url, followers_count")
            .eq("influencer_id", id)
            .order("followers_count", { ascending: false }),
          supabase
            .from("services")
            .select("platform, service_type, price, currency")
            .eq("influencer_id", id),
        ]);
        setData({
          gallery_images: galleryRes.data?.gallery_images ?? [],
          platform_details: platformsRes.data ?? [],
          services: servicesRes.data ?? [],
        });
      } else {
        const { data: biz } = await supabase
          .from("business_profiles")
          .select("company_size, website")
          .eq("id", id)
          .single();
        setData({
          gallery_images: [],
          platform_details: [],
          services: [],
          company_size: biz?.company_size,
          website: biz?.website,
        });
      }
    } catch {
      // show header only
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  const isInfluencer = role === "influencer";
  const displayName = isInfluencer
    ? profile.full_name
    : profile.company_name ?? profile.full_name;
  const faqs = isInfluencer ? INFLUENCER_FAQS : BUSINESS_FAQS;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-dark">
        {/* Drag handle */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 bg-dark-3 rounded-full" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* ── Header ─────────────────────────────────────────── */}
          <View className="px-6 pt-4 pb-5">
            <View className="flex-row items-start">
              {/* Avatar */}
              <View
                className={`w-20 h-20 rounded-2xl items-center justify-center mr-4 ${
                  isInfluencer ? "bg-primary/20" : "bg-accent/20"
                }`}
              >
                <Text
                  className={`text-3xl font-bold ${
                    isInfluencer ? "text-primary" : "text-accent"
                  }`}
                >
                  {displayName?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>

              {/* Name / tagline / badges */}
              <View className="flex-1">
                <Text className="text-white text-xl font-bold leading-tight">
                  {displayName}
                </Text>
                {profile.tagline ? (
                  <Text className="text-gray-mid text-sm mt-1" numberOfLines={2}>
                    {profile.tagline}
                  </Text>
                ) : null}
                {!isInfluencer && profile.industry ? (
                  <Text className="text-gray-mid text-xs mt-0.5">{profile.industry}</Text>
                ) : null}

                <View className="flex-row flex-wrap items-center gap-2 mt-2">
                  <View
                    className={`px-2 py-0.5 rounded-full ${
                      isInfluencer ? "bg-primary/20" : "bg-accent/20"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isInfluencer ? "text-primary" : "text-accent"
                      }`}
                    >
                      {isInfluencer ? "Influencer" : "Business"}
                    </Text>
                  </View>
                  {profile.location ? (
                    <Text className="text-gray-mid text-xs">{profile.location}</Text>
                  ) : null}
                </View>
              </View>

              {/* Close */}
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="w-8 h-8 items-center justify-center bg-dark-2 border border-dark-3 rounded-full ml-2"
              >
                <Text className="text-gray-mid text-sm">×</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Loading ─────────────────────────────────────────── */}
          {loading ? (
            <ActivityIndicator color="#6C47FF" size="large" className="mt-8" />
          ) : (
            <>
              {/* ── Gallery (influencer only) ──────────────────── */}
              {isInfluencer && (
                <View className="mb-5">
                  <Text className="text-white font-semibold text-sm px-6 mb-3">Photos</Text>
                  {data?.gallery_images && data.gallery_images.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
                    >
                      {data.gallery_images.map((url, i) => (
                        <Image
                          key={i}
                          source={{ uri: url }}
                          style={{
                            width: SCREEN_WIDTH * 0.45,
                            height: SCREEN_WIDTH * 0.45,
                            borderRadius: 16,
                          }}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  ) : (
                    <View className="mx-6 border border-dark-3 border-dashed rounded-2xl py-8 items-center">
                      <Text className="text-gray-mid text-sm">No photos yet</Text>
                    </View>
                  )}
                </View>
              )}

              {/* ── About / Bio ─────────────────────────────────── */}
              {profile.bio ? (
                <SectionCard>
                  <SectionTitle title="About" />
                  <Text className="text-gray-mid text-sm leading-5">{profile.bio}</Text>
                </SectionCard>
              ) : null}

              {/* ── Niches (influencer) ─────────────────────────── */}
              {isInfluencer && profile.niche && profile.niche.length > 0 && (
                <SectionCard>
                  <SectionTitle title="Niches" />
                  <View className="flex-row flex-wrap gap-2">
                    {profile.niche.map((n) => (
                      <View key={n} className="bg-primary/10 px-3 py-1 rounded-full">
                        <Text className="text-primary text-xs font-medium">{n}</Text>
                      </View>
                    ))}
                  </View>
                </SectionCard>
              )}

              {/* ── Analytics / Platforms (influencer) ─────────── */}
              {isInfluencer && data && (
                <View className="mx-6 mb-5">
                  <Text className="text-white font-semibold text-sm mb-3">
                    Platforms & Reach
                  </Text>
                  {data.platform_details.length > 0 ? (
                    <View className="gap-2">
                      {data.platform_details.map((p) => (
                        <View
                          key={p.platform_name}
                          className="bg-dark-2 border border-dark-3 rounded-2xl px-4 py-3 flex-row items-center"
                        >
                          <View className="flex-1">
                            <Text className="text-white font-semibold text-sm">
                              {p.platform_name}
                            </Text>
                            {p.profile_url ? (
                              <TouchableOpacity
                                onPress={() =>
                                  p.profile_url && Linking.openURL(p.profile_url)
                                }
                                activeOpacity={0.7}
                              >
                                <Text
                                  className="text-primary text-xs mt-0.5"
                                  numberOfLines={1}
                                >
                                  {p.profile_url}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          <View className="items-end ml-3">
                            <Text className="text-white font-bold text-base">
                              {formatFollowers(p.followers_count)}
                            </Text>
                            <Text className="text-gray-mid text-xs">followers</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="bg-dark-2 border border-dark-3 rounded-2xl py-6 items-center">
                      <Text className="text-gray-mid text-sm">No platform data yet</Text>
                    </View>
                  )}
                </View>
              )}

              {/* ── Company Info (business) ─────────────────────── */}
              {!isInfluencer && data && (
                <SectionCard>
                  <SectionTitle title="Company Info" />
                  <View className="gap-3">
                    {profile.industry ? (
                      <View className="flex-row">
                        <Text className="text-gray-mid text-sm w-24">Industry</Text>
                        <Text className="text-white text-sm flex-1">{profile.industry}</Text>
                      </View>
                    ) : null}
                    {data.company_size ? (
                      <View className="flex-row">
                        <Text className="text-gray-mid text-sm w-24">Team size</Text>
                        <Text className="text-white text-sm flex-1">
                          {data.company_size} employees
                        </Text>
                      </View>
                    ) : null}
                    {data.website ? (
                      <View className="flex-row">
                        <Text className="text-gray-mid text-sm w-24">Website</Text>
                        <TouchableOpacity
                          onPress={() => data.website && Linking.openURL(data.website!)}
                          activeOpacity={0.7}
                        >
                          <Text className="text-primary text-sm" numberOfLines={1}>
                            {data.website}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </SectionCard>
              )}

              {/* ── Services (influencer) ──────────────────────── */}
              {isInfluencer && data && (
                <View className="mx-6 mb-5">
                  <Text className="text-white font-semibold text-sm mb-3">Services</Text>
                  {data.services.length > 0 ? (
                    <View className="gap-2">
                      {data.services.map((s, i) => (
                        <View
                          key={i}
                          className="bg-dark-2 border border-dark-3 rounded-2xl px-4 py-3 flex-row items-center"
                        >
                          <View className="flex-1">
                            <Text className="text-white font-semibold text-sm">
                              {s.service_type}
                            </Text>
                            <Text className="text-gray-mid text-xs mt-0.5">{s.platform}</Text>
                          </View>
                          <View className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-primary font-bold text-sm">
                              ${Number(s.price).toFixed(0)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="bg-dark-2 border border-dark-3 rounded-2xl py-6 items-center">
                      <Text className="text-gray-mid text-sm">No services listed yet</Text>
                    </View>
                  )}
                </View>
              )}

              {/* ── FAQs ───────────────────────────────────────── */}
              <View className="mx-6 mb-6">
                <Text className="text-white font-semibold text-sm mb-3">FAQs</Text>
                <View className="gap-2">
                  {faqs.map((item, i) => (
                    <FaqItem
                      key={i}
                      item={item}
                      expanded={expandedFaq === i}
                      onToggle={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    />
                  ))}
                </View>
              </View>

              {/* ── CTA ────────────────────────────────────────── */}
              <View className="mx-6">
                <TouchableOpacity
                  className="bg-primary rounded-2xl py-4 items-center"
                  activeOpacity={0.8}
                  onPress={onClose}
                >
                  <Text className="text-white font-bold text-base">
                    Start a Collaboration
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
