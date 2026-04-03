import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Link } from "expo-router";

const GOLD = "#C9A84C";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", color: GOLD, textAlign: "center" }}>
        BWash
      </Text>
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 4, marginBottom: 40 }}>
        Create your account
      </Text>

      {error ? (
        <Text style={{ color: "#EF4444", textAlign: "center", marginBottom: 16, fontSize: 13 }}>
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
        <Text style={{ color: "#0A0A0A", fontWeight: "bold", fontSize: 16 }}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/sign-in" asChild>
        <TouchableOpacity style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.4)" }}>
            Already have an account? <Text style={{ color: GOLD }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
