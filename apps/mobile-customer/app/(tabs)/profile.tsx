import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#C9A84C";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Avatar & Name */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: "rgba(201,168,76,0.1)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="person" size={32} color={GOLD} />
        </View>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      {[
        { icon: "car" as const, label: "My Vehicles", onPress: () => {} },
        { icon: "card" as const, label: "Membership", onPress: () => {} },
        { icon: "receipt" as const, label: "Invoices", onPress: () => {} },
        { icon: "settings" as const, label: "Settings", onPress: () => {} },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={item.onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#111111",
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <Ionicons name={item.icon} size={20} color="rgba(255,255,255,0.5)" style={{ marginRight: 12 }} />
          <Text style={{ color: "rgba(255,255,255,0.7)", flex: 1 }}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>
      ))}

      {/* Sign Out */}
      <TouchableOpacity
        onPress={() => signOut()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(239,68,68,0.1)",
          borderRadius: 12,
          padding: 16,
          marginTop: 24,
        }}
      >
        <Ionicons name="log-out" size={20} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={{ color: "#EF4444", fontWeight: "600" }}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
