// app/(booking)/fare-estimate.tsx
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const VEHICLE_OPTIONS = [
  { id: 'bike', label: 'Bike', emoji: '🏍️', seats: '1 Seat', perKm: 8 },
  { id: 'auto', label: 'Auto', emoji: '🛺', seats: '3 Seats', perKm: 12 },
  { id: 'cab', label: 'Cab', emoji: '🚗', seats: '4 Seats', perKm: 18 },
];

function calculateFare(distance: number, perKm: number): number {
  const base = perKm * 2; // base fare
  return Math.round(base + distance * perKm);
}

function getEstimatedTime(distance: number, vehicleId: string): string {
  const speed = vehicleId === 'bike' ? 35 : vehicleId === 'auto' ? 25 : 30;
  const minutes = Math.round((distance / speed) * 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function FareEstimateScreen() {
  const params = useLocalSearchParams<any>();
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(params.vehicleType || 'auto');
  const [fareData, setFareData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchFareEstimate();
  }, []);

  const fetchFareEstimate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/rides/fare-estimate`, {
        params: {
          pickupLat: params.pickupLat,
          pickupLng: params.pickupLng,
          dropLat: params.dropLat,
          dropLng: params.dropLng,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDistance(res.data.distance);
      setFareData(res.data.fares || {});
    } catch {
      // Fallback: calculate locally using Haversine formula
      const dist = haversineDistance(
        parseFloat(params.pickupLat),
        parseFloat(params.pickupLng),
        parseFloat(params.dropLat),
        parseFloat(params.dropLng)
      );
      setDistance(dist);
      const fares: Record<string, number> = {};
      VEHICLE_OPTIONS.forEach(v => {
        fares[v.id] = calculateFare(dist, v.perKm);
      });
      setFareData(fares);
    } finally {
      setLoading(false);
    }
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleConfirm = () => {
    const selected = VEHICLE_OPTIONS.find(v => v.id === selectedVehicle);
    router.push({
      pathname: '/(booking)/confirm-booking',
      params: {
        ...params,
        vehicleType: selectedVehicle,
        fare: fareData[selectedVehicle],
        distance: distance.toFixed(1),
        estimatedTime: getEstimatedTime(distance, selectedVehicle),
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kiraya Estimate</Text>
      </View>

      {/* Route Summary */}
      <View style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#27ae60' }]} />
          <Text style={styles.routeText} numberOfLines={1}>{params.pickupAddress}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.routeText} numberOfLines={1}>{params.dropAddress}</Text>
        </View>

        {!loading && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>📏 {distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>Kiraya calculate ho raha hai...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <Text style={styles.sectionTitle}>Sawari Chuniye</Text>

          {VEHICLE_OPTIONS.map(vehicle => (
            <TouchableOpacity
              key={vehicle.id}
              style={[styles.vehicleCard, selectedVehicle === vehicle.id && styles.vehicleCardActive]}
              onPress={() => setSelectedVehicle(vehicle.id)}
            >
              <View style={styles.vehicleLeft}>
                <Text style={styles.vehicleEmoji}>{vehicle.emoji}</Text>
                <View>
                  <Text style={styles.vehicleName}>{vehicle.label}</Text>
                  <Text style={styles.vehicleSeats}>{vehicle.seats}</Text>
                  <Text style={styles.vehicleEta}>
                    ⏱️ {getEstimatedTime(distance, vehicle.id)} • ₹{vehicle.perKm}/km
                  </Text>
                </View>
              </View>

              <View style={styles.vehicleRight}>
                <Text style={styles.fareText}>
                  ₹{fareData[vehicle.id] || calculateFare(distance, vehicle.perKm)}
                </Text>
                {selectedVehicle === vehicle.id && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Payment Note */}
          <View style={styles.paymentNote}>
            <Ionicons name="cash-outline" size={18} color="#27ae60" />
            <Text style={styles.paymentNoteText}>Cash payment • Baad mein UPI bhi</Text>
          </View>
        </ScrollView>
      )}

      {/* Confirm Button */}
      {!loading && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>
              {VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.emoji} Confirm Karo •{' '}
              ₹{fareData[selectedVehicle] || '—'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
  routeCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  routeText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 4,
    marginVertical: 4,
  },
  distanceBadge: {
    marginTop: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  distanceText: { fontSize: 13, fontWeight: '700', color: '#1a3a5c' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#888', fontSize: 14 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 12,
    marginTop: 4,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  vehicleCardActive: {
    borderColor: '#F5A623',
    backgroundColor: '#fff8ee',
  },
  vehicleLeft: { flexDirection: 'row', alignItems: 'center' },
  vehicleEmoji: { fontSize: 36, marginRight: 14 },
  vehicleName: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
  vehicleSeats: { fontSize: 12, color: '#888', marginTop: 2 },
  vehicleEta: { fontSize: 11, color: '#aaa', marginTop: 2 },
  vehicleRight: { alignItems: 'flex-end' },
  fareText: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  selectedBadgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f8ed',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  paymentNoteText: { color: '#27ae60', fontSize: 13, fontWeight: '600' },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmBtn: {
    backgroundColor: '#F5A623',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
