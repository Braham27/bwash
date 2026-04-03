import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#C9A84C";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const quickActions = [
    { icon: "calendar" as const, label: "Book Wash", route: "/(tabs)/book" },
    { icon: "list" as const, label: "My Bookings", route: "/(tabs)/bookings" },
    { icon: "car" as const, label: "Vehicles", route: "/(tabs)/profile" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Welcome */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Welcome back,</Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff", marginTop: 4 }}>
          {user?.firstName || "Guest"}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => router.push(action.route)}
            style={{
              flex: 1,
              backgroundColor: "#111111",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <Ionicons name={action.icon} size={24} color={GOLD} />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8 }}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Banner */}
      <View
        style={{
          borderRadius: 20,
          padding: 24,
          backgroundColor: GOLD,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0A0A0A" }}>
          Premium Car Wash
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", marginTop: 4 }}>
          We come to you. Starting at just $35.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/book")}
          style={{
            marginTop: 16,
            backgroundColor: "#0A0A0A",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
