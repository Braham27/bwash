import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

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

const STATUS_ICON: Record<string, string> = {
  assigned: "arrow-forward-circle",
  in_progress: "play-circle",
  completed: "checkmark-circle",
};

export default function JobsScreen() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/staff/jobs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateJobStatus = useCallback(async (jobId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/staff/jobs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookingId: jobId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchJobs();
    } catch {
      Alert.alert("Error", "Failed to update job status.");
    }
  }, [getToken, fetchJobs]);

  const activeJobs = jobs.filter((j) => j.status !== "completed");
  const completedToday = jobs.filter((j) => j.status === "completed");

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "rgba(255,255,255,0.4)" }}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); fetchJobs(); }} tintColor={GOLD} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
        My Jobs
      </Text>
      <Text style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
        {activeJobs.length} active · {completedToday.length} completed today
      </Text>

      {activeJobs.length === 0 && (
        <View style={{
          backgroundColor: "#111111",
          borderRadius: 16,
          padding: 40,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          marginBottom: 24,
        }}>
          <Ionicons name="checkmark-done-circle" size={48} color="rgba(255,255,255,0.1)" />
          <Text style={{ color: "rgba(255,255,255,0.4)", marginTop: 12 }}>No active jobs</Text>
        </View>
      )}

      {activeJobs.map((job) => (
        <View
          key={job.id}
          style={{
            backgroundColor: "#111111",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: job.status === "in_progress" ? GOLD : "rgba(255,255,255,0.05)",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>{job.packageName}</Text>
            <Text style={{ color: GOLD, fontSize: 11, textTransform: "capitalize" }}>
              {job.status.replace("_", " ")}
            </Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>
            {job.customerName}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 }}>
            {job.preferredDate} at {job.preferredTime}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 }}>
            {job.address}
          </Text>

          {/* Status action button */}
          {job.status === "assigned" && (
            <TouchableOpacity
              onPress={() => updateJobStatus(job.id, "in_progress")}
              style={{
                backgroundColor: "rgba(201,168,76,0.1)",
                borderRadius: 10,
                paddingVertical: 10,
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="play" size={16} color={GOLD} />
              <Text style={{ color: GOLD, fontWeight: "600" }}>Start Job</Text>
            </TouchableOpacity>
          )}
          {job.status === "in_progress" && (
            <TouchableOpacity
              onPress={() => updateJobStatus(job.id, "completed")}
              style={{
                backgroundColor: "rgba(34,197,94,0.1)",
                borderRadius: 10,
                paddingVertical: 10,
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
              <Text style={{ color: "#22C55E", fontWeight: "600" }}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {completedToday.length > 0 && (
        <>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "rgba(255,255,255,0.5)", marginTop: 16, marginBottom: 12 }}>
            Completed Today
          </Text>
          {completedToday.map((job) => (
            <View
              key={job.id}
              style={{
                backgroundColor: "#111111",
                borderRadius: 12,
                padding: 14,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
                opacity: 0.6,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff" }}>{job.packageName}</Text>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                {job.customerName} · {job.preferredTime}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
