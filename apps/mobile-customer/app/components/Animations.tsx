import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  ZoomIn,
} from "react-native-reanimated";

const GOLD = "#2563EB";

/**
 * Staggered fade-in from bottom (like Apple product reveals)
 */
export function FadeInStagger({
  children,
  index = 0,
  delay = 80,
}: {
  children: React.ReactNode;
  index?: number;
  delay?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const d = index * delay;
    opacity.value = withDelay(d, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(d, withSpring(0, { damping: 20, stiffness: 120 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/**
 * Scale-in with spring (like iOS app icon tap)
 */
export function ScaleIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/**
 * Shimmer loading placeholder (Apple skeleton style)
 */
export function ShimmerPlaceholder({
  width,
  height,
  borderRadius = 12,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
}) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withDelay(
      0,
      withTiming(1, { duration: 1200, easing: Easing.linear })
    );
    // Loop
    const interval = setInterval(() => {
      shimmer.value = 0;
      shimmer.value = withTiming(1, { duration: 1200, easing: Easing.linear });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        style,
      ]}
    />
  );
}

/**
 * Press-scale feedback (like iOS buttons)
 */
export function usePressAnimation() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPressIn, onPressOut, animatedStyle };
}

// Re-export reanimated's built-in entering animations for convenience
export {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  ZoomIn,
};
