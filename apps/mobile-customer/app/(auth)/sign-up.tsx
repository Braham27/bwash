import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AnimatedCar from "../components/AnimatedCar";
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

export default function SignUpScreen() {
  useWarmUpBrowser();
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const google = useOAuthFlow("oauth_google");
  const apple = useOAuthFlow("oauth_apple");
  const facebook = useOAuthFlow("oauth_facebook");

  async function handleSignUp() {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (pendingVerification) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A0A0A",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Animated.View entering={ZoomIn.duration(500)} style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(201,168,76,0.1)",
              borderWidth: 1,
              borderColor: "rgba(201,168,76,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="mail-open" size={36} color={GOLD} />
          </View>
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(500)}
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Check your email
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          We sent a verification code to {email}
        </Animated.Text>

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
          placeholder="Enter verification code"
          placeholderTextColor="rgba(255,255,255,0.2)"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={{
            backgroundColor: "#111111",
            borderRadius: 12,
            padding: 16,
            color: "#fff",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
            marginBottom: 24,
            textAlign: "center",
            fontSize: 24,
            letterSpacing: 8,
          }}
        />

        <TouchableOpacity
          onPress={handleVerify}
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
            {isLoading ? "Verifying..." : "Verify Email"}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
        <Animated.View
          entering={ZoomIn.duration(600).springify()}
          style={{ alignItems: "center", marginBottom: 8 }}
        >
          <AnimatedCar />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(500).springify()}
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: GOLD,
            textAlign: "center",
          }}
        >
          BWash
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(350).duration(500).springify()}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 28,
          }}
        >
          Create your account
        </Animated.Text>

        {/* Social sign-up buttons */}
        <View style={{ gap: 10, marginBottom: 24 }}>
          <SocialButton
            icon="logo-google"
            label="Sign up with Google"
            onPress={google.onPress}
            bgColor="#4285F4"
            delay={400}
          />
          <SocialButton
            icon="logo-apple"
            label="Sign up with Apple"
            onPress={apple.onPress}
            bgColor="#333333"
            delay={500}
          />
          <SocialButton
            icon="logo-facebook"
            label="Sign up with Facebook"
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

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={firstName}
            onChangeText={setFirstName}
            style={{
              flex: 1,
              backgroundColor: "#111111",
              borderRadius: 12,
              padding: 16,
              color: "#fff",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={lastName}
            onChangeText={setLastName}
            style={{
              flex: 1,
              backgroundColor: "#111111",
              borderRadius: 12,
              padding: 16,
              color: "#fff",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          />
        </View>

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
          onPress={handleSignUp}
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
            {isLoading ? "Creating account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={{ marginTop: 16, alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>
              Already have an account?{" "}
              <Text style={{ color: GOLD }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
