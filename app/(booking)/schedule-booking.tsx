import { API_BASE_URL } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const VEHICLES = [
  { id: "bike", label: "Bike", emoji: "🏍️", desc: "1 seat • Fast" },
  { id: "auto", label: "Auto", emoji: "🛺", desc: "3 seats" },
  { id: "car", label: "Cab/Car", emoji: "🚗", desc: "4 seats" },
  { id: "tractor", label: "Tractor", emoji: "🚜", desc: "Khet ka kaam" },
  { id: "jcb", label: "JCB", emoji: "🚧", desc: "Construction" },
  { id: "tempo", label: "Tempo", emoji: "🚐", desc: "Saman dhona" },
  { id: "truck", label: "Truck", emoji: "🚛", desc: "Bhari saman" },
];

const TIMES = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export default function ScheduleBookingScreen() {
  const params = useLocalSearchParams<{
    pickupLat: string;
    pickupLng: string;
    pickupAddress: string;
    dropLat: string;
    dropLng: string;
    dropAddress: string;
  }>();

  const [selectedVehicle, setVehicle] = useState("auto");
  const [selectedDate, setDate] = useState<string>("");
  const [selectedTime, setTime] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate next 7 days
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label =
        i === 0
          ? "Aaj"
          : i === 1
            ? "Kal"
            : d.toLocaleDateString("hi-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
      const value = d.toISOString().split("T")[0];
      dates.push({ label, value });
    }
    return dates;
  };

  const handleBook = async () => {
    if (!selectedDate) {
      Alert.alert("Date Chuniye", "Kaunsi date pe booking karni hai?");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Time Chuniye", "Kaunsa time chahiye?");
      return;
    }

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);
    if (scheduledAt < new Date()) {
      Alert.alert("Galat Time", "Future time select karo");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Fare calculate locally
      const lat1 = parseFloat(params.pickupLat),
        lon1 = parseFloat(params.pickupLng);
      const lat2 = parseFloat(params.dropLat),
        lon2 = parseFloat(params.dropLng);
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const dist =
        Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) /
        10;

      const fareMap: any = {
        bike: 8,
        auto: 12,
        car: 15,
        tractor: 25,
        jcb: 40,
        tempo: 20,
        truck: 30,
      };
      const base: any = {
        bike: 20,
        auto: 25,
        car: 30,
        tractor: 100,
        jcb: 200,
        tempo: 80,
        truck: 150,
      };
      const fare =
        Math.ceil(
          (base[selectedVehicle] + dist * fareMap[selectedVehicle]) / 5,
        ) * 5;

      const res = await axios.post(
        `${API_BASE_URL}/ride/create`,
        {
          vehicleType: selectedVehicle,
          bookingType: "scheduled",
          scheduledAt: scheduledAt.toISOString(),
          scheduledNote: note,
          pickup: {
            address: params.pickupAddress,
            latitude: parseFloat(params.pickupLat),
            longitude: parseFloat(params.pickupLng),
          },
          drop: {
            address: params.dropAddress,
            latitude: parseFloat(params.dropLat),
            longitude: parseFloat(params.dropLng),
          },
          distance: dist,
          fare,
          estimatedFare: fare,
          estimatedDuration: Math.round(dist * 2.5),
          paymentMethod: "cash",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data?.success) {
        Alert.alert(
          "✅ Booking Ho Gayi!",
          `Aapki ${selectedDate} ko ${selectedTime} baje ke liye booking confirm ho gayi!\n\nDriver ko ${selectedTime} se 15 minute pehle request jayegi.`,
          [
            {
              text: "Theek Hai",
              onPress: () => router.replace("/(tabs)/home"),
            },
          ],
        );
      }
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Booking nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const dates = getDates();
  const vehicle = VEHICLES.find((v) => v.id === selectedVehicle);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 Pre-Booking</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: "#27ae60" }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {params.pickupAddress}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: "#e74c3c" }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {params.dropAddress}
            </Text>
          </View>
        </View>

        {/* Vehicle Selection */}
        <Text style={styles.sectionTitle}>🚗 Kaunsi Gaadi Chahiye?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
        >
          {VEHICLES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.vehicleChip,
                selectedVehicle === v.id && styles.vehicleChipActive,
              ]}
              onPress={() => setVehicle(v.id)}
            >
              <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
              <Text
                style={[
                  styles.vehicleLabel,
                  selectedVehicle === v.id && { color: "#F5A623" },
                ]}
              >
                {v.label}
              </Text>
              <Text style={styles.vehicleDesc}>{v.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>📅 Kaunsi Date?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
        >
          {dates.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[
                styles.dateChip,
                selectedDate === d.value && styles.dateChipActive,
              ]}
              onPress={() => setDate(d.value)}
            >
              <Text
                style={[
                  styles.dateLabel,
                  selectedDate === d.value && { color: "#fff" },
                ]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Selection */}
        <Text style={styles.sectionTitle}>⏰ Kaunsa Time?</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeChip,
                selectedTime === t && styles.timeChipActive,
              ]}
              onPress={() => setTime(t)}
            >
              <Text
                style={[
                  styles.timeLabel,
                  selectedTime === t && { color: "#fff" },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.sectionTitle}>📝 Koi Note? (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Jaise: 2 log honge, shaadi hai, khet ka kaam hai..."
          placeholderTextColor="#bbb"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        {/* Summary */}
        {selectedDate && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>
                {vehicle?.emoji} {vehicle?.label}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedTime} baje</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Driver milega</Text>
              <Text style={[styles.summaryValue, { color: "#27ae60" }]}>
                15 min pehle
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookBtn, loading && { opacity: 0.6 }]}
          onPress={handleBook}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookBtnText}>📅 Pre-Booking Confirm Karo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1a1a2e" },
  routeCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  routeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  routeText: { flex: 1, fontSize: 14, fontWeight: "600", color: "#1a1a2e" },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: "#eee",
    marginLeft: 4,
    marginVertical: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a2e",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  hScroll: { paddingLeft: 16, marginBottom: 8 },
  vehicleChip: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#eee",
    minWidth: 90,
    elevation: 1,
  },
  vehicleChipActive: { borderColor: "#F5A623", backgroundColor: "#fff8ee" },
  vehicleEmoji: { fontSize: 30, marginBottom: 6 },
  vehicleLabel: { fontSize: 13, fontWeight: "800", color: "#1a1a2e" },
  vehicleDesc: { fontSize: 11, color: "#aaa", marginTop: 2 },
  dateChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#eee",
    elevation: 1,
  },
  dateChipActive: { backgroundColor: "#1a3a5c", borderColor: "#1a3a5c" },
  dateLabel: { fontSize: 13, fontWeight: "700", color: "#1a1a2e" },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    elevation: 1,
  },
  timeChipActive: { backgroundColor: "#F5A623", borderColor: "#F5A623" },
  timeLabel: { fontSize: 13, fontWeight: "700", color: "#1a1a2e" },
  noteInput: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: "#1a1a2e",
    borderWidth: 1.5,
    borderColor: "#eee",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "#27ae60",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#27ae60",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: { fontSize: 14, color: "#888" },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#1a1a2e" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  bookBtn: {
    backgroundColor: "#1a3a5c",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 4,
  },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
