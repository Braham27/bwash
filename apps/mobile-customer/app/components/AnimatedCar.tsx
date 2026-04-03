import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#C9A84C";

/**
 * Water droplet that falls and fades
 */
function WaterDrop({ delay, x }: { delay: number; x: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [-8, 60]) }],
    opacity: interpolate(progress.value, [0, 0.2, 0.8, 1], [0, 0.9, 0.5, 0]),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: 0,
          width: 3,
          height: 12,
          borderRadius: 6,
          backgroundColor: "rgba(100,180,255,0.6)",
        },
        style,
      ]}
    />
  );
}

/**
 * Sparkle / shine particle
 */
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 800, easing: Easing.in(Easing.cubic) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0, 1.2]) }],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 1, 0]),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.9)",
        },
        style,
      ]}
    />
  );
}

/**
 * Foam/bubble
 */
function Bubble({ delay, x, size }: { delay: number; x: number; size: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [24, -40]) },
      { translateX: interpolate(progress.value, [0, 0.5, 1], [0, 6, -4]) },
      { scale: interpolate(progress.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]) },
    ],
    opacity: interpolate(progress.value, [0, 0.15, 0.75, 1], [0, 0.7, 0.4, 0]),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          bottom: 10,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.35)",
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        style,
      ]}
    />
  );
}

export default function AnimatedCar() {
  const carFloat = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    // Gentle floating motion (Apple-style)
    carFloat.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.bezier(0.45, 0, 0.55, 1) }),
        withTiming(0, { duration: 2000, easing: Easing.bezier(0.45, 0, 0.55, 1) })
      ),
      -1,
      false
    );

    // Shimmer sweep
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withDelay(500, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );

    // Gold glow pulse
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 1500, easing: Easing.in(Easing.cubic) })
      ),
      -1,
      false
    );
  }, []);

  const carStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(carFloat.value, [0, 1], [0, -8]) },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-180, 180]) },
    ],
    opacity: interpolate(shimmer.value, [0, 0.3, 0.5, 0.7, 1], [0, 0.6, 1, 0.6, 0]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.95, 1.05]) }],
  }));

  // Reflection / shadow style
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(carFloat.value, [0, 1], [0.4, 0.2]),
    transform: [
      { scaleX: interpolate(carFloat.value, [0, 1], [1, 0.9]) },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Water drops */}
      <View style={styles.dropsContainer}>
        <WaterDrop delay={0} x={30} />
        <WaterDrop delay={300} x={60} />
        <WaterDrop delay={600} x={90} />
        <WaterDrop delay={150} x={120} />
        <WaterDrop delay={450} x={150} />
        <WaterDrop delay={750} x={45} />
        <WaterDrop delay={500} x={105} />
        <WaterDrop delay={200} x={135} />
      </View>

      {/* Car icon with float animation */}
      <Animated.View style={[styles.carContainer, carStyle]}>
        {/* Shimmer sweep overlay */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
        <Ionicons name="car-sport" size={72} color={GOLD} />
      </Animated.View>

      {/* Ground reflection */}
      <Animated.View style={[styles.shadow, shadowStyle]} />

      {/* Sparkles */}
      <Sparkle delay={200} x={20} y={30} />
      <Sparkle delay={800} x={140} y={20} />
      <Sparkle delay={1400} x={80} y={10} />
      <Sparkle delay={500} x={50} y={50} />
      <Sparkle delay={1100} x={120} y={45} />

      {/* Bubbles */}
      <View style={styles.bubblesContainer}>
        <Bubble delay={0} x={25} size={8} />
        <Bubble delay={400} x={55} size={6} />
        <Bubble delay={800} x={85} size={10} />
        <Bubble delay={600} x={115} size={7} />
        <Bubble delay={1000} x={140} size={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GOLD,
    opacity: 0.15,
  },
  dropsContainer: {
    position: "absolute",
    top: 10,
    width: 180,
    height: 70,
  },
  carContainer: {
    overflow: "hidden",
    borderRadius: 20,
    padding: 16,
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  shadow: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOLD,
    marginTop: 8,
    opacity: 0.3,
  },
  bubblesContainer: {
    position: "absolute",
    bottom: 20,
    width: 180,
    height: 60,
  },
});
