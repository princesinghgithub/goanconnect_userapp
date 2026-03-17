// // app/(booking)/trip-complete.tsx
// import { API_BASE_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Alert,
//     Animated,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// export default function TripCompleteScreen() {
//   const params = useLocalSearchParams<any>();
//   const [rating, setRating] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 5,
//         tension: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleSubmitRating = async () => {
//     if (rating === 0) {
//       Alert.alert('Rating Do', 'Apne experience ke baare mein rating do');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.post(
//         `${API_BASE_URL}/rides/${params.rideId}/rate`,
//         { rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch {}
//     router.replace('/(tabs)/home');
//   };

//   const formatDuration = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     if (m < 60) return `${m} min`;
//     return `${Math.floor(m / 60)}h ${m % 60}m`;
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <StatusBar style="light" />

//       {/* Success Animation */}
//       <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
//         <Text style={styles.successEmoji}>🎉</Text>
//       </Animated.View>

//       <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
//         <Text style={styles.title}>Trip Complete!</Text>
//         <Text style={styles.subtitle}>Aapki ride safal rahi. Shukriya!</Text>
//       </Animated.View>

//       {/* Bill Summary */}
//       <Animated.View style={[styles.billCard, { opacity: fadeAnim }]}>
//         <Text style={styles.billTitle}>🧾 Bill Summary</Text>

//         <View style={styles.billRow}>
//           <Text style={styles.billLabel}>Distance</Text>
//           <Text style={styles.billValue}>{params.distance} km</Text>
//         </View>
//         <View style={styles.billRow}>
//           <Text style={styles.billLabel}>Duration</Text>
//           <Text style={styles.billValue}>
//             {params.duration ? formatDuration(parseFloat(params.duration)) : '—'}
//           </Text>
//         </View>
//         <View style={styles.billDivider} />
//         <View style={styles.billRow}>
//           <Text style={styles.billLabel}>Base Fare</Text>
//           <Text style={styles.billValue}>₹{Math.round(parseFloat(params.fare || '0') * 0.3)}</Text>
//         </View>
//         <View style={styles.billRow}>
//           <Text style={styles.billLabel}>Distance Charge</Text>
//           <Text style={styles.billValue}>₹{Math.round(parseFloat(params.fare || '0') * 0.7)}</Text>
//         </View>
//         <View style={styles.billDivider} />
//         <View style={styles.billTotalRow}>
//           <Text style={styles.billTotalLabel}>Total Paid</Text>
//           <Text style={styles.billTotalValue}>₹{params.fare}</Text>
//         </View>
//         <View style={[styles.billRow, { marginTop: 8 }]}>
//           <Text style={styles.billLabel}>Payment Method</Text>
//           <Text style={[styles.billValue, { color: '#27ae60', fontWeight: '700' }]}>
//             {params.paymentMethod === 'cash' ? '💵 Cash' : '📱 UPI'} ✓ Paid
//           </Text>
//         </View>
//       </Animated.View>

//       {/* Rating */}
//       <Animated.View style={[styles.ratingCard, { opacity: fadeAnim }]}>
//         <Text style={styles.ratingTitle}>Driver ko rate karo</Text>
//         <Text style={styles.ratingSubtitle}>Aapka experience kaisa raha?</Text>

//         <View style={styles.starsRow}>
//           {[1, 2, 3, 4, 5].map(star => (
//             <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
//               <Text style={[styles.starIcon, star <= rating && styles.starFilled]}>
//                 {star <= rating ? '⭐' : '☆'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.ratingLabel}>
//           {rating === 0 ? 'Star touch karo' :
//            rating === 1 ? 'Bahut Bura 😞' :
//            rating === 2 ? 'Theek Tha 😐' :
//            rating === 3 ? 'Acha Tha 🙂' :
//            rating === 4 ? 'Bahut Acha 😊' :
//            'Zabardast! 🤩'}
//         </Text>
//       </Animated.View>

//       {/* Buttons */}
//       <TouchableOpacity
//         style={styles.submitBtn}
//         onPress={handleSubmitRating}
//         disabled={submitting}
//       >
//         <Text style={styles.submitBtnText}>
//           {submitting ? 'Submit ho raha hai...' : 'Submit & Ghar Jao 🏠'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.skipBtn}
//         onPress={() => router.replace('/(tabs)/home')}
//       >
//         <Text style={styles.skipBtnText}>Rating Skip Karo</Text>
//       </TouchableOpacity>

//       {/* Book Again */}
//       <TouchableOpacity
//         style={styles.bookAgainBtn}
//         onPress={() => router.replace('/(tabs)/home')}
//       >
//         <Ionicons name="refresh" size={16} color="#1a3a5c" />
//         <Text style={styles.bookAgainText}>Dobara Book Karo</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f1b2d' },
//   content: { alignItems: 'center', paddingTop: 80, paddingBottom: 40, paddingHorizontal: 20 },
//   successCircle: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: '#27ae60',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#27ae60',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.5,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   successEmoji: { fontSize: 50 },
//   title: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: '#fff',
//     marginBottom: 6,
//   },
//   subtitle: { fontSize: 14, color: '#a0bcd6', marginBottom: 24 },
//   billCard: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   billTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a2e', marginBottom: 14 },
//   billRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   billLabel: { color: '#888', fontSize: 14 },
//   billValue: { color: '#1a1a2e', fontSize: 14, fontWeight: '600' },
//   billDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },
//   billTotalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   billTotalLabel: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
//   billTotalValue: { fontSize: 22, fontWeight: '900', color: '#F5A623' },
//   ratingCard: {
//     width: '100%',
//     backgroundColor: '#1a3a5c',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   ratingTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
//   ratingSubtitle: { color: '#a0bcd6', fontSize: 13, marginBottom: 16 },
//   starsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
//   starBtn: { padding: 4 },
//   starIcon: { fontSize: 36, color: '#666' },
//   starFilled: { fontSize: 36 },
//   ratingLabel: { color: '#a0bcd6', fontSize: 14, fontWeight: '600' },
//   submitBtn: {
//     width: '100%',
//     backgroundColor: '#F5A623',
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//     shadowColor: '#F5A623',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
//   skipBtn: {
//     paddingVertical: 10,
//     marginBottom: 16,
//   },
//   skipBtnText: { color: '#a0bcd6', fontSize: 13 },
//   bookAgainBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   bookAgainText: { color: '#fff', fontWeight: '700', fontSize: 14 },
// });


// app/(booking)/trip-complete.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

export default function TripCompleteScreen() {
  const params = useLocalSearchParams<{
    bookingId: string;
    fare: string;
    vehicleType: string;
    pickupAddress: string;
    dropAddress: string;
    driverName: string;
    distance: string;
  }>();

  const [rating, setRating]   = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗' };

  useEffect(() => {
    // Entry animation
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Clear stored locations
    AsyncStorage.removeItem('pickup');
    AsyncStorage.removeItem('drop');
  }, []);

  const handleRating = async (stars: number) => {
    setRating(stars);
    setSubmitted(true);
    // Rating submit (optional — backend me API hogi toh)
  };

  const handleDone = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Success Animation */}
      <View style={styles.successSection}>
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successEmoji}>✅</Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.successTitle}>Ride Complete! 🎉</Text>
          <Text style={styles.successSub}>Aapki ride safely complete ho gayi</Text>
        </Animated.View>
      </View>

      {/* Fare Card */}
      <View style={styles.fareCard}>
        <Text style={styles.fareLabel}>Total Kiraya</Text>
        <Text style={styles.fareValue}>₹{params.fare}</Text>
        <View style={styles.fareDetails}>
          <View style={styles.fareDetailItem}>
            <Text style={styles.fareDetailEmoji}>{VEHICLE_EMOJI[params.vehicleType] || '🚗'}</Text>
            <Text style={styles.fareDetailText}>{params.vehicleType?.toUpperCase()}</Text>
          </View>
          <View style={styles.fareDetailItem}>
            <Text style={styles.fareDetailEmoji}>📍</Text>
            <Text style={styles.fareDetailText}>{parseFloat(params.distance || '0').toFixed(1)} km</Text>
          </View>
          <View style={styles.fareDetailItem}>
            <Text style={styles.fareDetailEmoji}>💵</Text>
            <Text style={styles.fareDetailText}>Cash</Text>
          </View>
        </View>
      </View>

      {/* Route Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗺️ Route</Text>
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.routeText} numberOfLines={2}>{params.pickupAddress}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.routeText} numberOfLines={2}>{params.dropAddress}</Text>
          </View>
        </View>
      </View>

      {/* Driver Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍✈️ Driver</Text>
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>
              {params.driverName?.charAt(0)?.toUpperCase() || 'D'}
            </Text>
          </View>
          <Text style={styles.driverName}>{params.driverName || 'Driver'}</Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Driver Ko Rate Karo</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => !submitted && handleRating(star)}
              style={styles.starBtn}
            >
              <Text style={[styles.star, { color: star <= rating ? '#F5A623' : '#ddd' }]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {submitted && (
          <Text style={styles.ratingThanks}>
            {rating >= 4 ? '😊 Shukriya! Aapki rating driver ke liye bahut helpful hai' :
             rating >= 3 ? '👍 Thank you for rating!' :
             '😔 Maafi chahte hain. Agle baar behtar service milegi.'}
          </Text>
        )}
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
        <Text style={styles.doneBtnText}>🏠 Home Pe Wapas Jao</Text>
      </TouchableOpacity>

      {/* Book Again */}
      <TouchableOpacity style={styles.bookAgainBtn} onPress={handleDone}>
        <Text style={styles.bookAgainText}>🚗 Dobara Book Karo</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  successSection: {
    backgroundColor: '#1a3a5c', paddingTop: 70,
    paddingBottom: 32, alignItems: 'center',
  },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: { fontSize: 52 },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  successSub: { fontSize: 14, color: '#adc6e0', textAlign: 'center', marginTop: 6 },
  fareCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 20,
    padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: '#eee',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  fareLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  fareValue: { fontSize: 48, fontWeight: '900', color: '#F5A623', marginBottom: 16 },
  fareDetails: { flexDirection: 'row', gap: 20 },
  fareDetailItem: { alignItems: 'center' },
  fareDetailEmoji: { fontSize: 20, marginBottom: 4 },
  fareDetailText: { fontSize: 12, color: '#888', fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
  routeCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: '#eee',
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10, marginTop: 4 },
  routeLine: { width: 1, height: 14, backgroundColor: '#ddd', marginLeft: 3, marginVertical: 2 },
  routeText: { flex: 1, fontSize: 13, color: '#444', fontWeight: '500' },
  driverCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#eee', gap: 14,
  },
  driverAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center',
  },
  driverAvatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  driverName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  starsRow: {
    flexDirection: 'row', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#eee', gap: 8,
  },
  starBtn: { padding: 4 },
  star: { fontSize: 40 },
  ratingThanks: {
    textAlign: 'center', fontSize: 13, color: '#888',
    marginTop: 12, fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: '#1a3a5c', margin: 16, marginBottom: 8,
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bookAgainBtn: {
    backgroundColor: '#F5A623', marginHorizontal: 16,
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  bookAgainText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
