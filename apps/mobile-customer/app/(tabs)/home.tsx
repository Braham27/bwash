import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AnimatedCar from "../components/AnimatedCar";
import { FadeInStagger, ScaleIn, usePressAnimation } from "../components/Animations";

const GOLD = "#C9A84C";
const { width: SCREEN_W } = Dimensions.get("window");

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function PressableCard({
  children,
  onPress,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScaleIn delay={delay}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 15, stiffness: 200 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        }}
        activeOpacity={1}
        style={[animStyle, style]}
      >
        {children}
      </AnimatedTouchable>
    </ScaleIn>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const quickActions = [
    { icon: "calendar" as const, label: "Book Wash", route: "/(tabs)/book" },
    { icon: "list" as const, label: "My Bookings", route: "/(tabs)/bookings" },
    { icon: "car" as const, label: "Vehicles", route: "/(tabs)/profile" },
  ];

  const features = [
    { icon: "water" as const, label: "Premium Products", desc: "Eco-friendly" },
    { icon: "shield-checkmark" as const, label: "Insured", desc: "Full coverage" },
    { icon: "time" as const, label: "On Time", desc: "Always punctual" },
    { icon: "star" as const, label: "5-Star Rated", desc: "500+ reviews" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section with Animated Car */}
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
          WELCOME BACK
        </Text>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#fff", marginTop: 4 }}>
          {user?.firstName || "Guest"}
        </Text>
      </Animated.View>

      {/* Animated Car Wash Hero */}
      <Animated.View entering={ZoomIn.delay(200).duration(600).springify()}>
        <AnimatedCar />
      </Animated.View>

      {/* Quick Actions with press feedback */}
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 8 }}>
        {quickActions.map((action, i) => (
          <PressableCard
            key={action.label}
            onPress={() => router.push(action.route)}
            delay={300 + i * 100}
            style={{
              flex: 1,
              backgroundColor: "#111111",
              borderRadius: 20,
              padding: 18,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "rgba(201,168,76,0.12)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons name={action.icon} size={22} color={GOLD} />
            </View>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" }}>
              {action.label}
            </Text>
          </PressableCard>
        ))}
      </View>

      {/* Premium CTA Banner */}
      <FadeInStagger index={4} delay={100}>
        <PressableCard
          onPress={() => router.push("/(tabs)/book")}
          delay={600}
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              padding: 28,
              backgroundColor: GOLD,
              borderRadius: 24,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "rgba(0,0,0,0.5)", letterSpacing: 2 }}>
              PREMIUM
            </Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0A0A0A", marginTop: 4 }}>
              Mobile Car Wash
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.55)", marginTop: 6, lineHeight: 20 }}>
              We come to you. Professional detailing at your doorstep.
            </Text>
            <View
              style={{
                marginTop: 20,
                backgroundColor: "#0A0A0A",
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Book Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
            <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 12 }}>
              Starting at $35
            </Text>
          </View>
        </PressableCard>
      </FadeInStagger>

      {/* Features Grid */}
      <FadeInStagger index={5} delay={100}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 2,
            paddingHorizontal: 20,
            marginTop: 32,
            marginBottom: 14,
          }}
        >
          WHY BWASH
        </Text>
      </FadeInStagger>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 20,
          gap: 10,
        }}
      >
        {features.map((f, i) => (
          <FadeInStagger key={f.label} index={6 + i} delay={100}>
            <View
              style={{
                width: (SCREEN_W - 50) / 2,
                backgroundColor: "#111111",
                borderRadius: 18,
                padding: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.04)",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "rgba(201,168,76,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name={f.icon} size={18} color={GOLD} />
              </View>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{f.label}</Text>
              <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>
                {f.desc}
              </Text>
            </View>
          </FadeInStagger>
        ))}
      </View>
    </ScrollView>
  );
}
