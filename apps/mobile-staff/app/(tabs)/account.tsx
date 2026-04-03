import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#C9A84C";

export default function AccountScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

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
        <Text style={{ color: GOLD, fontSize: 13, marginTop: 4 }}>Staff</Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

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
          marginTop: 12,
        }}
      >
        <Ionicons name="log-out" size={20} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={{ color: "#EF4444", fontWeight: "600" }}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
