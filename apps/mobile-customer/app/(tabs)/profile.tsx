import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FadeInStagger } from "../components/Animations";
import { useThemeContext } from "../../lib/ThemeContext";

const GOLD = "#2563EB";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme, colors } = useThemeContext();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Avatar & Name */}
      <Animated.View entering={ZoomIn.duration(600).springify()} style={{ alignItems: "center", marginBottom: 32 }}>
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
        <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={{ color: colors.text, fontSize: 22, fontWeight: "bold" }}>
          {user?.firstName} {user?.lastName}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(350).duration(500)} style={{ color: colors.textFaint, fontSize: 13, marginTop: 4 }}>
          {user?.emailAddresses[0]?.emailAddress}
        </Animated.Text>
      </Animated.View>

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

      {/* Menu Items */}
      {[
        { icon: "car" as const, label: "My Vehicles", onPress: () => {} },
        { icon: "card" as const, label: "Membership", onPress: () => {} },
        { icon: "receipt" as const, label: "Invoices", onPress: () => {} },
        { icon: "settings" as const, label: "Settings", onPress: () => {} },
      ].map((item, idx) => (
        <FadeInStagger key={item.label} index={idx} delay={100}>
          <TouchableOpacity
            onPress={item.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name={item.icon} size={20} color={colors.textMuted} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text, flex: 1 }}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
          </TouchableOpacity>
        </FadeInStagger>
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
