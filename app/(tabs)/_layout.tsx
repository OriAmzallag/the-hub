import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Colors } from "../../constants/theme";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View className="items-center justify-center pt-2">
      <Text
        style={{
          fontSize: 11,
          fontWeight: focused ? "700" : "400",
          color: focused ? Colors.primary : Colors.grayMid,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.dark2,
          borderTopColor: Colors.dark3,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grayMid,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="collabs"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Collabs" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{ href: null }}
      />
    </Tabs>
  );
}
