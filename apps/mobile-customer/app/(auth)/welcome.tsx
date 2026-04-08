import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../lib/ThemeContext";

const { width, height } = Dimensions.get("window");
const GOLD = "#2563EB";

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    icon: "car-sport",
    title: "The Art of\nPristine",
    subtitle: "Miami's Premium Mobile Detailing",
    description:
      "Luxury car wash and detailing, delivered right to your door. No drive-throughs, no waiting — just pristine results.",
  },
  {
    id: "2",
    icon: "location",
    title: "We Come\nTo You",
    subtitle: "Home, Office, Anywhere",
    description:
      "Book a wash in under 60 seconds. Our professional team arrives at your location — fully equipped and ready to shine.",
  },
  {
    id: "3",
    icon: "shield-checkmark",
    title: "Premium\nResults",
    subtitle: "Professional Grade Products",
    description:
      "Eco-friendly, professional-grade products. Every wash is insured, every vehicle treated with care. 500+ happy clients and counting.",
  },
  {
    id: "4",
    icon: "sparkles",
    title: "Choose Your\nPackage",
    subtitle: "Starting at just $35",
    description:
      "From a quick exterior wash to a full deluxe detail — pick the package that fits your ride. Transparent pricing, no hidden fees.",
  },
];

function Dot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP),
      backgroundColor: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP) > 0.5
        ? GOLD
        : "rgba(255,255,255,0.3)",
    };
  });
  return <Animated.View style={[styles.dot, animStyle]} />;
}

function SlideItem({
  item,
  index,
  scrollX,
}: {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const { colors } = useThemeContext();
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.iconContainer, animStyle]}>
        <View style={styles.iconGlow}>
          <Ionicons name={item.icon} size={80} color={GOLD} />
        </View>
      </Animated.View>
      <Animated.View style={animStyle}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{item.subtitle}</Text>
        </View>
        <Text style={[styles.description, { color: colors.textMuted }]}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { colors } = useThemeContext();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLastSlide = currentIndex === slides.length - 1;

  function handleNext() {
    if (isLastSlide) {
      router.replace("/(auth)/sign-in");
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  }

  function handleSkip() {
    router.replace("/(auth)/sign-in");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <Animated.View entering={FadeIn.delay(500)} style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom: dots + CTA */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.bottomContainer}>
        {/* Pagination dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.ctaButton, isLastSlide && styles.ctaButtonFull]}
          activeOpacity={0.8}
        >
          {isLastSlide ? (
            <Text style={styles.ctaTextFull}>Get Started</Text>
          ) : (
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={{ color: GOLD, fontWeight: "600" }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: "rgba(128,128,128,0.7)",
    fontSize: 16,
    fontWeight: "500",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(37,99,235,0.08)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 48,
    letterSpacing: -1,
  },
  badgeContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  badge: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaButtonFull: {
    width: width - 48,
    borderRadius: 16,
    height: 56,
  },
  ctaTextFull: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: "rgba(128,128,128,0.6)",
    fontSize: 14,
  },
});
