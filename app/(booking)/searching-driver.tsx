// app/(booking)/searching-driver.tsx
import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SearchingDriverScreen() {
  const params = useLocalSearchParams<{
    bookingId: string;
    fare: string;
    vehicleType: string;
    pickupAddress: string;
    dropAddress: string;
  }>();

  const [status, setStatus]     = useState<'searching' | 'found' | 'failed'>('searching');
  const [timeLeft, setTimeLeft] = useState(120);
  const [dots, setDots]         = useState('');
  const pulseAnim               = useRef(new Animated.Value(1)).current;
  const pollRef                 = useRef<any>(null);
  const timerRef                = useRef<any>(null);
  const dotsRef                 = useRef<any>(null);

  const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', cab: '🚗' };

  useEffect(() => {
    startPulse();
    startDots();
    startTimer();
    startPolling();
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
      clearInterval(dotsRef.current);
    };
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const startDots = () => {
    let count = 0;
    dotsRef.current = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 500);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearAll();
          setStatus('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPolling = () => {
    if (!params.bookingId) return;
    pollRef.current = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/ride/current/customer`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8000,
        });
        const ride = res.data?.data;
        if (ride?.status === 'accepted' && ride?.provider) {
          handleRideFound(ride);
        }
      } catch (e) {}
    }, 5000);
  };

  const handleRideFound = (ride?: any) => {
    clearAll();
    setStatus('found');
    setTimeout(() => {
      router.replace({
        pathname: '/(booking)/live-tracking',
        params: {
          bookingId:     params.bookingId,
          driverName:    ride?.provider?.user?.name  || 'Driver',
          driverPhone:   ride?.provider?.user?.phone || '',
          vehicleType:   params.vehicleType,
          fare:          params.fare,
          pickupAddress: params.pickupAddress,
          dropAddress:   params.dropAddress,
        },
      });
    }, 1500);
  };

  const clearAll = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    clearInterval(dotsRef.current);
  };

  const handleCancel = () => {
    Alert.alert('Cancel?', 'Driver search band karein?', [
      { text: 'Nahi', style: 'cancel' },
      {
        text: 'Haan Cancel', style: 'destructive',
        onPress: async () => {
          clearAll();
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/ride/cancel`,
              { rideId: params.bookingId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (e) {}
          await AsyncStorage.removeItem('pickup');
          await AsyncStorage.removeItem('drop');
          router.replace('/(tabs)/home');
        },
      },
    ]);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {status === 'searching' ? 'Driver Dhundh Rahe Hain' :
           status === 'found'     ? 'Driver Mil Gaya! 🎉' :
                                    'Driver Nahi Mila 😔'}
        </Text>
      </View>

      {/* Animation */}
      <View style={styles.animContainer}>
        {status === 'searching' && (
          <>
            <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: pulseAnim }], opacity: 0.15 }]} />
            <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: pulseAnim }], opacity: 0.25 }]} />
            <Animated.View style={[styles.ring, { transform: [{ scale: pulseAnim }], opacity: 0.4 }]} />
            <View style={styles.vehicleCircle}>
              <Text style={styles.vehicleEmoji}>{VEHICLE_EMOJI[params.vehicleType] || '🚗'}</Text>
            </View>
          </>
        )}
        {status === 'found' && (
          <View style={styles.successCircle}>
            <Text style={{ fontSize: 64 }}>✅</Text>
          </View>
        )}
        {status === 'failed' && (
          <View style={styles.failCircle}>
            <Text style={{ fontSize: 64 }}>😔</Text>
          </View>
        )}
      </View>

      {status === 'searching' && (
        <>
          <Text style={styles.searchingText}>Nearby drivers dhundh rahe hain{dots}</Text>
          <Text style={styles.timerText}>⏱ {formatTime(timeLeft)} mein milega</Text>
        </>
      )}
      {status === 'found' && <Text style={styles.foundText}>Aapka driver aa raha hai!</Text>}
      {status === 'failed' && (
        <>
          <Text style={styles.failText}>Is area mein abhi koi driver nahi hai</Text>
          <Text style={styles.failSub}>Thodi der baad dobara try karein</Text>
        </>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
          <Text style={styles.infoText} numberOfLines={1}>{params.pickupAddress}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.infoText} numberOfLines={1}>{params.dropAddress}</Text>
        </View>
        <View style={styles.fareBadge}>
          <Text style={styles.fareText}>
            {VEHICLE_EMOJI[params.vehicleType] || '🚗'} ₹{params.fare}
          </Text>
        </View>
      </View>

      {status === 'searching' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel Search</Text>
        </TouchableOpacity>
      )}

      {status === 'failed' && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryBtnText}>🔄 Dobara Try</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={async () => {
            await AsyncStorage.removeItem('pickup');
            await AsyncStorage.removeItem('drop');
            router.replace('/(tabs)/home');
          }}>
            <Text style={styles.homeBtnText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  header: {
    width: '100%', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  animContainer: {
    width: 220, height: 220, justifyContent: 'center',
    alignItems: 'center', marginTop: 32, marginBottom: 20,
  },
  ring: {
    position: 'absolute', width: 160, height: 160,
    borderRadius: 80, backgroundColor: '#F5A623',
  },
  ring2: { width: 190, height: 190, borderRadius: 95 },
  ring3: { width: 220, height: 220, borderRadius: 110 },
  vehicleCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff', justifyContent: 'center',
    alignItems: 'center', elevation: 8,
  },
  vehicleEmoji: { fontSize: 48 },
  successCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#e8f8f5', justifyContent: 'center', alignItems: 'center',
  },
  failCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fef9e7', justifyContent: 'center', alignItems: 'center',
  },
  searchingText: { fontSize: 15, color: '#555', fontWeight: '600', marginBottom: 6 },
  timerText: { fontSize: 14, color: '#F5A623', fontWeight: '700' },
  foundText: { fontSize: 18, color: '#27ae60', fontWeight: '800' },
  failText: { fontSize: 15, color: '#e74c3c', fontWeight: '700', textAlign: 'center', paddingHorizontal: 30 },
  failSub: { fontSize: 13, color: '#888', marginTop: 6 },
  infoCard: {
    width: '90%', backgroundColor: '#f8f9fa', borderRadius: 16,
    padding: 16, marginTop: 24, borderWidth: 1, borderColor: '#eee',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  infoText: { flex: 1, fontSize: 14, color: '#1a1a2e', fontWeight: '600' },
  infoDivider: { height: 1, backgroundColor: '#eee', marginVertical: 4 },
  fareBadge: {
    marginTop: 10, backgroundColor: '#fff8ee', borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start',
  },
  fareText: { fontSize: 15, fontWeight: '800', color: '#F5A623' },
  cancelBtn: {
    marginTop: 24, paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 14, borderWidth: 2, borderColor: '#e74c3c',
  },
  cancelBtnText: { color: '#e74c3c', fontWeight: '800', fontSize: 15 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  retryBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, backgroundColor: '#F5A623' },
  retryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  homeBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, backgroundColor: '#f0f0f0' },
  homeBtnText: { color: '#555', fontWeight: '800', fontSize: 15 },
});
