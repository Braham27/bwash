import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

const GOLD = "#2563EB";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface Job {
  id: string;
  customerName: string;
  packageName: string;
  vehicleType: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  status: string;
}

export default function ScheduleScreen() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSchedule = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/staff/jobs?upcoming=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch {
      // Silently fail
    } finally {
      setIsRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Group by date
  const grouped = jobs.reduce<Record<string, Job[]>>((acc, job) => {
    const date = job.preferredDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(job);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); fetchSchedule(); }} tintColor={GOLD} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 24 }}>
        Schedule
      </Text>

      {sortedDates.length === 0 && (
        <View style={{
          backgroundColor: "#111111",
          borderRadius: 16,
          padding: 40,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}>
          <Text style={{ color: "rgba(255,255,255,0.4)" }}>No upcoming jobs</Text>
        </View>
      )}

      {sortedDates.map((date) => (
        <View key={date} style={{ marginBottom: 24 }}>
          <Text style={{ color: GOLD, fontWeight: "600", fontSize: 14, marginBottom: 8 }}>
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>

          {grouped[date]
            .sort((a, b) => a.preferredTime.localeCompare(b.preferredTime))
            .map((job) => (
              <View
                key={job.id}
                style={{
                  backgroundColor: "#111111",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: GOLD,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>{job.preferredTime}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "capitalize" }}>
                    {job.vehicleType}
                  </Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>
                  {job.packageName} — {job.customerName}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 }}>
                  {job.address}
                </Text>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}
