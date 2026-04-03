import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { TextInput } from "react-native";
import { Link } from "expo-router";
import AnimatedCar from "../components/AnimatedCar";

const GOLD = "#C9A84C";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", padding: 24 }}>
      <Animated.View entering={ZoomIn.duration(600).springify()} style={{ marginBottom: -10 }}>
        <AnimatedCar />
      </Animated.View>
      <Animated.Text
        entering={FadeInDown.delay(200).duration(500)}
        style={{ fontSize: 32, fontWeight: "800", color: GOLD, textAlign: "center" }}
      >
        BWash
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(350).duration(500)}
        style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 4, marginBottom: 32 }}
      >
        Sign in to your account
      </Animated.Text>

      {error ? (
        <Text style={{ color: "#EF4444", textAlign: "center", marginBottom: 16, fontSize: 13 }}>
          {error}
        </Text>
      ) : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor="rgba(255,255,255,0.2)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: 16,
          color: "#fff",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="rgba(255,255,255,0.2)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: 16,
          color: "#fff",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={{
          backgroundColor: GOLD,
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#0A0A0A", fontWeight: "bold", fontSize: 16 }}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/sign-up" asChild>
        <TouchableOpacity style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.4)" }}>
            Don&apos;t have an account? <Text style={{ color: GOLD }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
