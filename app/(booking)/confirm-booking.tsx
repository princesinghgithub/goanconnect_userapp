

// app/(booking)/confirm-booking.tsx
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function ConfirmBookingScreen() {
  const params = useLocalSearchParams<{
    pickupLat: string; pickupLng: string; pickupAddress: string;
    dropLat: string;   dropLng: string;   dropAddress: string;
    vehicleType: string; fare: string;
    distance: string;  duration: string;
  }>();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [loading, setLoading] = useState(false);

  const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', cab: '🚗' };
  const VEHICLE_LABEL: any = { bike: 'Bike', auto: 'Auto', cab: 'Cab' };

  const fare     = parseFloat(params.fare || '0');
  const distance = parseFloat(params.distance || '0');
  const baseFare = Math.round(fare * 0.3);
  const distFare = Math.round(fare * 0.7);

  const handleBookRide = async () => {
    if (loading) return; // double press prevent
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      // ✅ Ride model exact enum values
      const vehicleTypeMap: any = { bike: 'bike', auto: 'auto', cab: 'car' };
      const paymentMap: any     = { cash: 'cash', upi: 'online' }; // model: cash|online|wallet

      const duration = parseFloat(params.duration || '0');
      const fare     = parseFloat(params.fare || '0');

      const body = {
        vehicleType:       vehicleTypeMap[params.vehicleType] || params.vehicleType,
        pickup: {
          address:   params.pickupAddress,
          latitude:  parseFloat(params.pickupLat),
          longitude: parseFloat(params.pickupLng),
        },
        dropoff: {
          address:   params.dropAddress,
          latitude:  parseFloat(params.dropLat),
          longitude: parseFloat(params.dropLng),
        },
        distance:          parseFloat(params.distance || '0'),
        estimatedFare:     fare,
        fare:              fare,        // ← model mein 'fare' required hai
        estimatedDuration: duration > 0 ? duration : 30,
        paymentMethod:     paymentMap[paymentMethod] || 'cash',
      };

      const res = await axios.post(`${API_BASE_URL}/ride/create`, body, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      const { success, data } = res.data;
      const ride = data?.ride;

      if (!success || !ride) {
        Alert.alert('Error', 'Booking fail ho gayi. Dobara try karo.');
        return;
      }

      // ✅ Searching screen pe jao — driver dhundhega
      router.replace({
        pathname: '/(booking)/searching-driver',
        params: {
          bookingId:     ride._id,
          fare:          String(Math.round(ride.fare || parseFloat(params.fare))),
          vehicleType:   params.vehicleType,
          pickupAddress: params.pickupAddress,
          dropAddress:   params.dropAddress,
        },
      });

    } catch (error: any) {
      console.log('Booking error:', error?.response?.data || error?.message);
      Alert.alert(
        'Booking Failed',
        error?.response?.data?.message || 'Network error. Check connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirm Karo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Vehicle + Fare Banner */}
        <View style={styles.fareBanner}>
          <Text style={styles.fareEmoji}>{VEHICLE_EMOJI[params.vehicleType] || '🚗'}</Text>
          <View style={styles.fareInfo}>
            <Text style={styles.fareVehicle}>{VEHICLE_LABEL[params.vehicleType] || 'Cab'}</Text>
            <Text style={styles.fareDistance}>
              {parseFloat(params.distance || '0').toFixed(1)} km • {Math.round(parseFloat(params.duration || '0'))} min
            </Text>
          </View>
          <Text style={styles.fareAmount}>₹{Math.round(fare)}</Text>
          <Text style={styles.fareLabel}>Est. fare</Text>
        </View>

        {/* Route */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ Route Details</Text>
          <View style={styles.routeCard}>
            <View style={styles.routeRow}>
              <View style={styles.pickupDot} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>{params.pickupAddress}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={styles.dropDot} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>DROP</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>{params.dropAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>
          <View style={styles.paymentRow}>
            <TouchableOpacity
              style={[styles.paymentBtn, paymentMethod === 'cash' && styles.paymentBtnActive]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={styles.paymentEmoji}>💵</Text>
              <Text style={[styles.paymentLabel, paymentMethod === 'cash' && styles.paymentLabelActive]}>
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentBtn, paymentMethod === 'upi' && styles.paymentBtnActive]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Text style={styles.paymentEmoji}>📱</Text>
              <Text style={[styles.paymentLabel, paymentMethod === 'upi' && styles.paymentLabelActive]}>
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fare Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧾 Fare Breakdown</Text>
          <View style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareRowLabel}>Base Fare</Text>
              <Text style={styles.fareRowValue}>₹{baseFare}</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareRowLabel}>Distance ({distance.toFixed(1)} km)</Text>
              <Text style={styles.fareRowValue}>₹{distFare}</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareTotalLabel}>Total</Text>
              <Text style={styles.fareTotalValue}>₹{Math.round(fare)}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookBtn, loading && styles.bookBtnLoading]}
          onPress={handleBookRide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.bookBtnText}>Driver Dhundo 🔍</Text>
              <Text style={styles.bookBtnSub}>₹{Math.round(fare)} • {paymentMethod === 'cash' ? 'Cash' : 'UPI'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 55, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  fareBanner: {
    backgroundColor: '#1a3a5c', margin: 16, borderRadius: 20,
    padding: 20, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
  },
  fareEmoji: { fontSize: 44, marginRight: 14 },
  fareInfo: { flex: 1 },
  fareVehicle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  fareDistance: { fontSize: 13, color: '#adc6e0', marginTop: 2 },
  fareAmount: { fontSize: 28, fontWeight: '900', color: '#F5A623' },
  fareLabel: { fontSize: 11, color: '#adc6e0', width: '100%', textAlign: 'right', marginTop: -4 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
  routeCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#eee',
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  pickupDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#27ae60', marginRight: 12, marginTop: 4,
  },
  dropDot: {
    width: 14, height: 14, borderRadius: 3,
    backgroundColor: '#e74c3c', marginRight: 12, marginTop: 4,
  },
  routeLine: {
    width: 2, height: 20, backgroundColor: '#ddd',
    marginLeft: 6, marginVertical: 4,
  },
  routeTextContainer: { flex: 1 },
  routeLabel: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 1 },
  routeAddress: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginTop: 2 },
  paymentRow: { flexDirection: 'row', gap: 12 },
  paymentBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 14, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 2, borderColor: '#eee', gap: 8,
  },
  paymentBtnActive: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
  paymentEmoji: { fontSize: 20 },
  paymentLabel: { fontSize: 15, fontWeight: '700', color: '#555' },
  paymentLabelActive: { color: '#F5A623' },
  fareCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#eee',
  },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  fareRowLabel: { fontSize: 14, color: '#666' },
  fareRowValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  fareDivider: { height: 1, backgroundColor: '#eee', marginVertical: 4 },
  fareTotalLabel: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
  fareTotalValue: { fontSize: 18, fontWeight: '900', color: '#F5A623' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 16, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  bookBtn: {
    backgroundColor: '#F5A623', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', elevation: 4,
  },
  bookBtnLoading: { backgroundColor: '#ccc' },
  bookBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  bookBtnSub: { color: '#fff9', fontSize: 12, marginTop: 2 },
});
