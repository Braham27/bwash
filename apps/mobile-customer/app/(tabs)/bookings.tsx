import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

const GOLD = "#C9A84C";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface Booking {
  id: string;
  packageName: string;
  vehicleType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  price: number;
  address: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#3B82F6",
  confirmed: "#22C55E",
  assigned: GOLD,
  in_progress: "#F59E0B",
  completed: "#10B981",
  cancelled: "#EF4444",
};

export default function BookingsScreen() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchBookings();
  }, [fetchBookings]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={GOLD} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 24 }}>
        My Bookings
      </Text>

      {bookings.length === 0 ? (
        <View style={{
          backgroundColor: "#111111",
          borderRadius: 16,
          padding: 40,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>No bookings yet</Text>
          <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 4 }}>
            Book your first wash to get started
          </Text>
        </View>
      ) : (
        bookings.map((b) => (
          <View
            key={b.id}
            style={{
              backgroundColor: "#111111",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>{b.packageName}</Text>
              <View style={{
                backgroundColor: `${STATUS_COLORS[b.status] || "#666"}20`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Text style={{ color: STATUS_COLORS[b.status] || "#666", fontSize: 11, fontWeight: "600", textTransform: "capitalize" }}>
                  {b.status.replace("_", " ")}
                </Text>
              </View>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>
              {b.preferredDate} at {b.preferredTime}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "capitalize" }}>
                {b.vehicleType}
              </Text>
              <Text style={{ color: GOLD, fontWeight: "bold" }}>${b.price}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
