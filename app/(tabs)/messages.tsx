import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark items-center justify-center">
      <Text className="text-4xl mb-4">💬</Text>
      <Text className="text-white text-xl font-bold">Messages</Text>
      <Text className="text-gray-mid text-sm mt-2">Coming soon</Text>
    </SafeAreaView>
  );
}
