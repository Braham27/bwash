import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../../lib/ThemeContext";

const GOLD = "#2563EB";

export default function AccountScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { theme, toggleTheme, colors } = useThemeContext();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Avatar & Name */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: "rgba(37,99,235,0.1)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="person" size={32} color={GOLD} />
        </View>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "bold" }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{ color: GOLD, fontSize: 13, marginTop: 4 }}>Staff</Text>
        <Text style={{ color: colors.textFaint, fontSize: 13, marginTop: 2 }}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons
          name={theme === "dark" ? "sunny" : "moon"}
          size={20}
          color={GOLD}
          style={{ marginRight: 12 }}
        />
        <Text style={{ color: colors.text, flex: 1, fontWeight: "500" }}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Text>
        <View
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme === "dark" ? GOLD : colors.border,
            justifyContent: "center",
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
              alignSelf: theme === "dark" ? "flex-end" : "flex-start",
            }}
          />
        </View>
      </TouchableOpacity>

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
