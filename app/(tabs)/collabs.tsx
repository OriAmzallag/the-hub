import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/AuthContext";

type TabType = "active" | "requests";

export default function CollabsScreen() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const isInfluencer = profile?.role === "influencer";

  return (
    <SafeAreaView className="flex-1 bg-dark">
      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Collaborations</Text>
        <Text className="text-gray-mid text-sm mt-1">
          {isInfluencer
            ? "Manage your brand deals"
            : "Manage your influencer campaigns"}
        </Text>
      </View>

      {/* Tab toggle */}
      <View className="flex-row mx-6 mb-4 bg-dark-2 rounded-xl p-1">
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          className={`flex-1 py-2.5 rounded-lg items-center ${
            activeTab === "active" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === "active" ? "text-white" : "text-gray-mid"
            }`}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("requests")}
          className={`flex-1 py-2.5 rounded-lg items-center ${
            activeTab === "requests" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === "requests" ? "text-white" : "text-gray-mid"
            }`}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {activeTab === "active" && (
          <View className="items-center py-16">
            <Text className="text-white font-bold text-lg mb-2">
              No active collaborations
            </Text>
            <Text className="text-gray-mid text-sm text-center leading-5">
              {isInfluencer
                ? "Once a brand books one of your services,\nit will appear here."
                : "Once you book an influencer's service,\nit will appear here."}
            </Text>
          </View>
        )}

        {activeTab === "requests" && (
          <View className="items-center py-16">
            <Text className="text-white font-bold text-lg mb-2">
              No pending requests
            </Text>
            <Text className="text-gray-mid text-sm text-center leading-5">
              {isInfluencer
                ? "Collaboration requests from brands\nwill appear here."
                : "Your outgoing collaboration requests\nwill appear here."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
