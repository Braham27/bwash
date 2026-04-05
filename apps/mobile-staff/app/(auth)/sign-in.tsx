import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useOAuthFlow, useWarmUpBrowser } from "../../lib/oauth";

const GOLD = "#2563EB";

function SocialButton({
  icon,
  label,
  onPress,
  bgColor,
  delay,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  bgColor: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          borderRadius: 14,
          paddingVertical: 15,
          gap: 10,
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#fff"
        />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function StaffSignInScreen() {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const google = useOAuthFlow("oauth_google");
  const apple = useOAuthFlow("oauth_apple");
  const facebook = useOAuthFlow("oauth_facebook");

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={FadeInDown.delay(200).duration(500)}
          style={{
            fontSize: 32,
            fontWeight: "800",
            color: GOLD,
            textAlign: "center",
          }}
        >
          BWash
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(350).duration(500)}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 28,
          }}
        >
          Staff Portal
        </Animated.Text>

        {/* Social login buttons */}
        <View style={{ gap: 10, marginBottom: 24 }}>
          <SocialButton
            icon="logo-google"
            label="Continue with Google"
            onPress={google.onPress}
            bgColor="#4285F4"
            delay={400}
          />
          <SocialButton
            icon="logo-apple"
            label="Continue with Apple"
            onPress={apple.onPress}
            bgColor="#333333"
            delay={500}
          />
          <SocialButton
            icon="logo-facebook"
            label="Continue with Facebook"
            onPress={facebook.onPress}
            bgColor="#1877F2"
            delay={600}
          />
        </View>

        {/* Divider */}
        <Animated.View
          entering={FadeInDown.delay(650).duration(400)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <Text
            style={{
              color: "rgba(255,255,255,0.3)",
              paddingHorizontal: 16,
              fontSize: 12,
              fontWeight: "500",
            }}
          >
            OR
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
        </Animated.View>

        {error ? (
          <Text
            style={{
              color: "#EF4444",
              textAlign: "center",
              marginBottom: 16,
              fontSize: 13,
            }}
          >
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
          <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
