import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { FadeInStagger, usePressAnimation } from "../components/Animations";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const GOLD = "#2563EB";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const PACKAGES = [
  { name: "Basic Wash", slug: "basic-wash", sedan: 35, suv: 45, truck: 55 },
  { name: "Premium Wash", slug: "premium-wash", sedan: 55, suv: 65, truck: 75 },
  { name: "Deluxe Detail", slug: "deluxe-detail", sedan: 85, suv: 95, truck: 110 },
];

const VEHICLE_TYPES = ["sedan", "suv", "truck"] as const;

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

export default function BookScreen() {
  const { getToken } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [vehicleType, setVehicleType] = useState<(typeof VEHICLE_TYPES)[number]>("sedan");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const pkg = PACKAGES[selectedPackage];
  const price = pkg[vehicleType];

  async function handleBook() {
    if (!date || !time || !address) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }
    setIsBooking(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          packageSlug: pkg.slug,
          vehicleType,
          preferredDate: date,
          preferredTime: time,
          address,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      Alert.alert("Success", "Your wash has been booked!");
    } catch {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.Text entering={FadeInDown.duration(500).springify()} style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 24 }}>
        Book a Wash
      </Animated.Text>

      {/* Package Selection */}
      <Animated.Text entering={FadeInDown.delay(100).duration(400)} style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
        SELECT PACKAGE
      </Animated.Text>
      {PACKAGES.map((p, i) => (
        <FadeInStagger key={p.slug} index={i} delay={100}>
          <TouchableOpacity
            onPress={() => setSelectedPackage(i)}
            style={{
              backgroundColor: i === selectedPackage ? "rgba(201,168,76,0.1)" : "#111111",
              borderRadius: 12,
              padding: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: i === selectedPackage ? GOLD : "rgba(255,255,255,0.05)",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{p.name}</Text>
            <Text style={{ color: GOLD, fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
              From ${p.sedan}
            </Text>
          </TouchableOpacity>
        </FadeInStagger>
      ))}

      {/* Vehicle Type */}
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 20, marginBottom: 8 }}>
        VEHICLE TYPE
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {VEHICLE_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setVehicleType(t)}
            style={{
              flex: 1,
              backgroundColor: t === vehicleType ? "rgba(201,168,76,0.1)" : "#111111",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: t === vehicleType ? GOLD : "rgba(255,255,255,0.05)",
            }}
          >
            <Text style={{ color: t === vehicleType ? GOLD : "rgba(255,255,255,0.7)", textTransform: "capitalize" }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date */}
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 20, marginBottom: 8 }}>
        PREFERRED DATE
      </Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        placeholderTextColor="rgba(255,255,255,0.2)"
        value={date}
        onChangeText={setDate}
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: 16,
          color: "#fff",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}
      />

      {/* Time Slots */}
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 20, marginBottom: 8 }}>
        TIME SLOT
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {TIME_SLOTS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTime(t)}
            style={{
              backgroundColor: t === time ? "rgba(201,168,76,0.1)" : "#111111",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: t === time ? GOLD : "rgba(255,255,255,0.05)",
            }}
          >
            <Text style={{ color: t === time ? GOLD : "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Address */}
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 20, marginBottom: 8 }}>
        ADDRESS
      </Text>
      <TextInput
        placeholder="Enter your address"
        placeholderTextColor="rgba(255,255,255,0.2)"
        value={address}
        onChangeText={setAddress}
        multiline
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: 16,
          color: "#fff",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          minHeight: 80,
        }}
      />

      {/* Price & Book Button */}
      <Animated.View entering={ZoomIn.delay(400).springify()} style={{ marginTop: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Total</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: GOLD, marginVertical: 8 }}>
          ${price}
        </Text>
        <TouchableOpacity
          onPress={handleBook}
          disabled={isBooking}
          style={{
            backgroundColor: GOLD,
            borderRadius: 14,
            paddingVertical: 16,
            width: "100%",
            alignItems: "center",
            opacity: isBooking ? 0.6 : 1,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>
            {isBooking ? "Booking..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
