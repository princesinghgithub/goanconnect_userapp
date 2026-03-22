// // app/(booking)/live-tracking.tsx
// import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Alert,
//     Animated,
//     Dimensions,
//     Linking,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import { io, Socket } from 'socket.io-client';

// const { height } = Dimensions.get('window');

// type Coord = { latitude: number; longitude: number };

// const RIDE_STAGES = ['driver_coming', 'arrived', 'trip_started', 'trip_completed'];

// export default function LiveTrackingScreen() {
//   const params = useLocalSearchParams<any>();
//   const mapRef = useRef<MapView>(null);
//   const socketRef = useRef<Socket | null>(null);

//   const [driverLocation, setDriverLocation] = useState<Coord>({
//     latitude: parseFloat(params.driverLat || '0'),
//     longitude: parseFloat(params.driverLng || '0'),
//   });
//   const [rideStage, setRideStage] = useState<string>('driver_coming');
//   const [polyline, setPolyline] = useState<Coord[]>([]);
//   const [eta, setEta] = useState('Calculating...');
//   const [otp, setOtp] = useState('');
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     connectSocket();
//     fetchRideDetails();
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (driverLocation.latitude && driverLocation.longitude) {
//       mapRef.current?.animateToRegion({
//         latitude: driverLocation.latitude,
//         longitude: driverLocation.longitude,
//         latitudeDelta: 0.015,
//         longitudeDelta: 0.015,
//       });
//     }
//   }, [driverLocation]);

//   const fetchRideDetails = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/rides/${params.rideId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOtp(res.data.otp || '');
//     } catch {}
//   };

//   const connectSocket = async () => {
//     const token = await AsyncStorage.getItem('token');
//     const socket = io(SOCKET_URL, {
//       auth: { token },
//       transports: ['websocket'],
//     });
//     socketRef.current = socket;

//     socket.emit('join-ride', { rideId: params.rideId });

//     socket.on('driver-location-update', (data: { latitude: number; longitude: number }) => {
//       setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
//     });

//     socket.on('driver-arrived', () => {
//       setRideStage('arrived');
//       Alert.alert('Driver Pahunch Gaya! 🎉', 'Aapka driver location pe aa gaya hai');
//     });

//     socket.on('trip-started', (data: any) => {
//       setRideStage('trip_started');
//       if (data.route) setPolyline(data.route);
//     });

//     socket.on('trip-completed', (data: any) => {
//       socketRef.current?.disconnect();
//       router.replace({
//         pathname: '/(booking)/trip-complete',
//         params: {
//           rideId: params.rideId,
//           fare: data.finalFare,
//           distance: data.distance,
//           duration: data.duration,
//           paymentMethod: data.paymentMethod,
//         },
//       });
//     });

//     socket.on('eta-update', (data: { eta: string }) => {
//       setEta(data.eta);
//     });
//   };

//   const handleCallDriver = () => {
//     Linking.openURL(`tel:${params.driverPhone}`);
//   };

//   const handleCancelRide = () => {
//     Alert.alert(
//       'Ride Cancel Karo?',
//       rideStage === 'trip_started'
//         ? 'Trip already start ho gayi hai. Cancel karne pe cancellation charge lag sakta hai.'
//         : 'Driver aa raha hai. Cancel karna chahte ho?',
//       [
//         { text: 'Nahi', style: 'cancel' },
//         {
//           text: 'Cancel Karo',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem('token');
//               await axios.post(
//                 `${API_BASE_URL}/rides/${params.rideId}/cancel`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//             } catch {}
//             socketRef.current?.disconnect();
//             router.replace('/(tabs)/home');
//           },
//         },
//       ]
//     );
//   };

//   const getStageText = () => {
//     switch (rideStage) {
//       case 'driver_coming': return `Driver aa raha hai • ${eta}`;
//       case 'arrived': return '🎉 Driver pahunch gaya hai!';
//       case 'trip_started': return '🚀 Trip chal rahi hai...';
//       default: return '';
//     }
//   };

//   const getStageColor = () => {
//     switch (rideStage) {
//       case 'arrived': return '#27ae60';
//       case 'trip_started': return '#3498db';
//       default: return '#F5A623';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Map */}
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation
//         initialRegion={{
//           latitude: driverLocation.latitude || 15.49,
//           longitude: driverLocation.longitude || 73.82,
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         }}
//       >
//         {/* Driver Marker */}
//         <Marker coordinate={driverLocation} title={params.driverName}>
//           <View style={styles.driverMarker}>
//             <Text style={styles.driverMarkerText}>🏍️</Text>
//           </View>
//         </Marker>

//         {/* Route Polyline */}
//         {polyline.length > 0 && (
//           <Polyline
//             coordinates={polyline}
//             strokeColor="#F5A623"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>

//       {/* Status Badge */}
//       <View style={[styles.statusBadge, { backgroundColor: getStageColor() }]}>
//         <Text style={styles.statusBadgeText}>{getStageText()}</Text>
//       </View>

//       {/* Bottom Driver Card */}
//       <View style={styles.driverCard}>
//         {/* OTP (shown before trip starts) */}
//         {rideStage !== 'trip_started' && otp !== '' && (
//           <View style={styles.otpContainer}>
//             <Text style={styles.otpLabel}>DRIVER KO YEH OTP BATAO</Text>
//             <Text style={styles.otpCode}>{otp}</Text>
//           </View>
//         )}

//         {/* Driver Info */}
//         <View style={styles.driverInfo}>
//           <View style={styles.driverAvatar}>
//             <Text style={styles.driverAvatarText}>
//               {params.driverName?.charAt(0) || 'D'}
//             </Text>
//           </View>
//           <View style={styles.driverDetails}>
//             <Text style={styles.driverName}>{params.driverName || 'Driver'}</Text>
//             <Text style={styles.vehicleNumber}>🚗 {params.vehicleNumber || 'GK XX 1234'}</Text>
//             <View style={styles.ratingRow}>
//               <Text style={styles.star}>⭐</Text>
//               <Text style={styles.rating}>4.8</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.callBtn} onPress={handleCallDriver}>
//             <Ionicons name="call" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Cancel (only before trip starts) */}
//         {rideStage !== 'trip_started' && (
//           <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelRide}>
//             <Text style={styles.cancelBtnText}>Ride Cancel Karo</Text>
//           </TouchableOpacity>
//         )}

//         {/* SOS Button */}
//         <TouchableOpacity
//           style={styles.sosBtn}
//           onPress={() => Linking.openURL('tel:112')}
//         >
//           <Ionicons name="warning" size={14} color="#e74c3c" />
//           <Text style={styles.sosBtnText}>SOS Emergency</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   map: { flex: 1 },
//   driverMarker: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   driverMarkerText: { fontSize: 22 },
//   statusBadge: {
//     position: 'absolute',
//     top: 60,
//     alignSelf: 'center',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   statusBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
//   driverCard: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 20,
//   },
//   otpContainer: {
//     backgroundColor: '#1a3a5c',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   otpLabel: {
//     fontSize: 10,
//     fontWeight: '800',
//     color: '#a0bcd6',
//     letterSpacing: 1,
//     marginBottom: 6,
//   },
//   otpCode: {
//     fontSize: 36,
//     fontWeight: '900',
//     color: '#F5A623',
//     letterSpacing: 8,
//   },
//   driverInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   driverAvatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#1a3a5c',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   driverAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
//   driverDetails: { flex: 1 },
//   driverName: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
//   vehicleNumber: { fontSize: 13, color: '#888', marginTop: 2 },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
//   star: { fontSize: 12 },
//   rating: { fontSize: 12, fontWeight: '700', color: '#555', marginLeft: 3 },
//   callBtn: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: '#27ae60',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#27ae60',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   cancelBtn: {
//     borderWidth: 1.5,
//     borderColor: '#e74c3c',
//     borderRadius: 14,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelBtnText: { color: '#e74c3c', fontWeight: '700', fontSize: 14 },
//   sosBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   sosBtnText: { color: '#e74c3c', fontSize: 12, fontWeight: '600' },
// });

// app/(booking)/live-tracking.tsx
// import { API_BASE_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert, Animated, Linking, StyleSheet,
//   Text, TouchableOpacity, View,
// } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// export default function LiveTrackingScreen() {
//   const params = useLocalSearchParams<{
//     bookingId: string;
//     driverName: string;
//     driverPhone: string;
//     vehicleType: string;
//     fare: string;
//     pickupAddress: string;
//     dropAddress: string;
//   }>();

//   const mapRef = useRef<MapView>(null);
//   const [rideStatus, setRideStatus] = useState('accepted');
//   const [driverLocation, setDriverLocation] = useState<any>(null);
//   const [otp, setOtp] = useState('');
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const pollRef = useRef<any>(null);

//   const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗' };

//   const STATUS_INFO: any = {
//     accepted: { text: 'Driver aa raha hai...', color: '#3498db', icon: 'navigate' },
//     arrived:  { text: 'Driver pahunch gaya! OTP batao', color: '#9b59b6', icon: 'location' },
//     started:  { text: 'Ride chal rahi hai 🚀', color: '#27ae60', icon: 'speedometer' },
//   };

//   useEffect(() => {
//     startPolling();
//     animateCard();
//     return () => clearInterval(pollRef.current);
//   }, []);

//   const animateCard = () => {
//     Animated.spring(slideAnim, {
//       toValue: 1, tension: 65, friction: 11, useNativeDriver: true,
//     }).start();
//   };

//   const startPolling = () => {
//     pollRef.current = setInterval(async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const res = await axios.get(`${API_BASE_URL}/ride/${params.bookingId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const ride = res.data?.data;
//         if (!ride) return;

//         setRideStatus(ride.status);
//         setOtp(ride.otp || '');

//         // Driver location (agar provider populate hua ho)
//         if (ride.provider?.currentLocation) {
//           setDriverLocation({
//             latitude:  ride.provider.currentLocation.latitude,
//             longitude: ride.provider.currentLocation.longitude,
//           });
//         }

//         // Ride complete ho gayi
//         if (ride.status === 'completed') {
//           clearInterval(pollRef.current);
//           router.replace({
//             pathname: '/(booking)/trip-complete',
//             params: {
//               bookingId:     params.bookingId,
//               fare:          String(ride.fare),
//               vehicleType:   params.vehicleType,
//               pickupAddress: params.pickupAddress,
//               dropAddress:   params.dropAddress,
//               driverName:    params.driverName,
//               distance:      String(ride.distance),
//             },
//           });
//         }

//         // Ride cancel ho gayi
//         if (ride.status === 'cancelled') {
//           clearInterval(pollRef.current);
//           Alert.alert('Ride Cancel', 'Driver ne ride cancel kar di.', [
//             { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
//           ]);
//         }
//       } catch (e) {}
//     }, 5000);
//   };

//   const handleCall = () => {
//     if (params.driverPhone) {
//       Linking.openURL(`tel:${params.driverPhone}`);
//     }
//   };

//   const handleCancel = () => {
//     Alert.alert('Ride Cancel?', 'Kya aap ride cancel karna chahte hain?', [
//       { text: 'Nahi', style: 'cancel' },
//       {
//         text: 'Haan Cancel Karo', style: 'destructive',
//         onPress: async () => {
//           try {
//             const token = await AsyncStorage.getItem('token');
//             await axios.post(`${API_BASE_URL}/ride/cancel`,
//               { rideId: params.bookingId },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//           } catch (e) {}
//           clearInterval(pollRef.current);
//           await AsyncStorage.removeItem('pickup');
//           await AsyncStorage.removeItem('drop');
//           router.replace('/(tabs)/home');
//         },
//       },
//     ]);
//   };

//   const currentStatus = STATUS_INFO[rideStatus] || STATUS_INFO['accepted'];

//   return (
//     <View style={styles.container}>
//       {/* MAP */}
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation
//         initialRegion={{
//           latitude:      driverLocation?.latitude  || 24.75,
//           longitude:     driverLocation?.longitude || 81.5,
//           latitudeDelta:  0.03,
//           longitudeDelta: 0.03,
//         }}
//       >
//         {driverLocation && (
//           <Marker coordinate={driverLocation} title="Driver">
//             <View style={styles.driverMarker}>
//               <Text style={{ fontSize: 24 }}>
//                 {VEHICLE_EMOJI[params.vehicleType] || '🚗'}
//               </Text>
//             </View>
//           </Marker>
//         )}
//       </MapView>

//       {/* Status Bar */}
//       <View style={[styles.statusBar, { backgroundColor: currentStatus.color }]}>
//         <Ionicons name={currentStatus.icon} size={18} color="#fff" />
//         <Text style={styles.statusBarText}>{currentStatus.text}</Text>
//       </View>

//       {/* Bottom Card */}
//       <Animated.View style={[
//         styles.bottomCard,
//         { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] }
//       ]}>
//         {/* Driver Info */}
//         <View style={styles.driverRow}>
//           <View style={styles.driverAvatar}>
//             <Text style={styles.driverAvatarText}>
//               {params.driverName?.charAt(0)?.toUpperCase() || 'D'}
//             </Text>
//           </View>
//           <View style={styles.driverInfo}>
//             <Text style={styles.driverName}>{params.driverName || 'Driver'}</Text>
//             <Text style={styles.driverVehicle}>
//               {VEHICLE_EMOJI[params.vehicleType]} {params.vehicleType?.toUpperCase()}
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
//             <Ionicons name="call" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.divider} />

//         {/* OTP — arrived status pe dikhao */}
//         {rideStatus === 'arrived' && otp ? (
//           <View style={styles.otpContainer}>
//             <Text style={styles.otpLabel}>Driver ko batao OTP:</Text>
//             <Text style={styles.otpValue}>{otp}</Text>
//           </View>
//         ) : null}

//         {/* Route */}
//         <View style={styles.routeCard}>
//           <View style={styles.routeRow}>
//             <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
//             <Text style={styles.routeText} numberOfLines={1}>{params.pickupAddress}</Text>
//           </View>
//           <View style={styles.routeLineV} />
//           <View style={styles.routeRow}>
//             <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
//             <Text style={styles.routeText} numberOfLines={1}>{params.dropAddress}</Text>
//           </View>
//         </View>

//         {/* Fare */}
//         <View style={styles.fareRow}>
//           <Text style={styles.fareLabel}>Estimated Fare</Text>
//           <Text style={styles.fareValue}>₹{params.fare}</Text>
//         </View>

//         {/* Cancel Button — sirf accepted/arrived pe */}
//         {['accepted', 'arrived'].includes(rideStatus) && (
//           <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
//             <Text style={styles.cancelBtnText}>Ride Cancel Karo</Text>
//           </TouchableOpacity>
//         )}
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   statusBar: {
//     position: 'absolute', top: 50, left: 16, right: 16,
//     borderRadius: 12, padding: 12,
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     elevation: 5,
//   },
//   statusBarText: { color: '#fff', fontWeight: '800', fontSize: 14, flex: 1 },
//   driverMarker: {
//     backgroundColor: '#fff', borderRadius: 20, padding: 4,
//     borderWidth: 2, borderColor: '#F5A623',
//   },
//   bottomCard: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     padding: 20, paddingBottom: 34,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.12, shadowRadius: 12, elevation: 20,
//   },
//   driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   driverAvatar: {
//     width: 48, height: 48, borderRadius: 24,
//     backgroundColor: '#1a3a5c', justifyContent: 'center',
//     alignItems: 'center', marginRight: 12,
//   },
//   driverAvatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
//   driverInfo: { flex: 1 },
//   driverName: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
//   driverVehicle: { fontSize: 13, color: '#888', marginTop: 2 },
//   callBtn: {
//     width: 44, height: 44, borderRadius: 22,
//     backgroundColor: '#27ae60', justifyContent: 'center', alignItems: 'center',
//   },
//   divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 16 },
//   otpContainer: {
//     backgroundColor: '#fff8ee', borderRadius: 14, padding: 14,
//     alignItems: 'center', marginBottom: 16,
//     borderWidth: 2, borderColor: '#F5A623',
//   },
//   otpLabel: { fontSize: 13, color: '#888', marginBottom: 4 },
//   otpValue: { fontSize: 36, fontWeight: '900', color: '#F5A623', letterSpacing: 8 },
//   routeCard: {
//     backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, marginBottom: 12,
//   },
//   routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
//   dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
//   routeLineV: { width: 1, height: 12, backgroundColor: '#ddd', marginLeft: 3, marginVertical: 2 },
//   routeText: { flex: 1, fontSize: 13, color: '#444', fontWeight: '500' },
//   fareRow: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     alignItems: 'center', marginBottom: 16,
//   },
//   fareLabel: { fontSize: 14, color: '#888' },
//   fareValue: { fontSize: 22, fontWeight: '900', color: '#F5A623' },
//   cancelBtn: {
//     borderWidth: 2, borderColor: '#e74c3c', borderRadius: 14,
//     padding: 14, alignItems: 'center',
//   },
//   cancelBtnText: { color: '#e74c3c', fontWeight: '800', fontSize: 15 },
// });

import { API_BASE_URL, SOCKET_URL } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { io } from "socket.io-client";

export default function LiveTrackingScreen() {
  const params = useLocalSearchParams<{
    bookingId: string;
    driverName: string;
    driverPhone: string;
    vehicleType: string;
    fare: string;
    pickupAddress: string;
    dropAddress: string;
  }>();

  const [rideStatus, setRideStatus] = useState<
    "accepted" | "arrived" | "started" | "completed"
  >("accepted");
  const [driverLoc, setDriverLoc] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [otp, setOtp] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const socketRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const timerRef = useRef<any>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    connectSocket();
    pollRideStatus();
    slideIn();
    return () => {
      socketRef.current?.disconnect();
      clearInterval(timerRef.current);
    };
  }, []);

  const slideIn = () => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const connectSocket = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (!userData) return;
    const u = JSON.parse(userData);

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.on("connect", () => {
      socket.emit("user_join", u._id || u.id);
      socket.emit("join_booking", params.bookingId);
    });

    // Driver location update
    socket.on("location_update", (data: any) => {
      if (data?.lat && data?.lng) {
        const loc = { latitude: data.lat, longitude: data.lng };
        setDriverLoc(loc);
        mapRef.current?.animateToRegion(
          { ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          500,
        );
      }
    });

    socketRef.current = socket;
  };

  // Poll ride status every 5 seconds
  const pollRideStatus = () => {
    timerRef.current = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/ride/${params.bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const ride = res.data?.data;
        if (!ride) return;

        setRideStatus(ride.status);
        if (ride.otp) setOtp(ride.otp);

        if (ride.status === "completed") {
          clearInterval(timerRef.current);
          socketRef.current?.disconnect();
          setTimeout(() => {
            router.replace({
              pathname: "/(booking)/trip-complete",
              params: {
                bookingId: params.bookingId,
                fare: String(ride.fare),
                vehicleType: params.vehicleType,
                pickupAddress: params.pickupAddress,
                dropAddress: params.dropAddress,
                driverName: params.driverName,
                distance: String(ride.distance),
              },
            });
          }, 1000);
        }

        if (ride.status === "cancelled") {
          clearInterval(timerRef.current);
          Alert.alert("Ride Cancel", "Driver ne ride cancel kar di.", [
            { text: "OK", onPress: () => router.replace("/(tabs)/home") },
          ]);
        }
      } catch (e) {}
    }, 5000);
  };

  const callDriver = () => {
    if (params.driverPhone) Linking.openURL(`tel:${params.driverPhone}`);
  };

  const VEMOJI: any = { bike: "🏍️", auto: "🛺", car: "🚗", tractor: "🚜" };

  const STATUS_INFO = {
    accepted: {
      emoji: "🚗",
      title: "Driver Aa Raha Hai",
      sub: "Driver aapki taraf aa raha hai",
      color: "#3498db",
    },
    arrived: {
      emoji: "📍",
      title: "Driver Pahunch Gaya!",
      sub: "Driver aapke paas hai — bahar aao!",
      color: "#9b59b6",
    },
    started: {
      emoji: "🛣️",
      title: "Safar Shuru!",
      sub: "Aap apni manzil ki taraf ja rahe ho",
      color: "#F5A623",
    },
    completed: {
      emoji: "🎉",
      title: "Manzil Aa Gayi!",
      sub: "Ride complete ho gayi",
      color: "#27ae60",
    },
  };

  const info = STATUS_INFO[rideStatus];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 24.5,
          longitude: 81.3,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {driverLoc && (
          <Marker coordinate={driverLoc} title={params.driverName || "Driver"}>
            <View style={styles.driverMarker}>
              <Text style={{ fontSize: 24 }}>
                {VEMOJI[params.vehicleType] || "🚗"}
              </Text>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => Alert.alert("Ride Active", "Ride abhi chal rahi hai!")}
      >
        <Ionicons name="arrow-back" size={22} color="#1a3a5c" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Status */}
        <View style={[styles.statusBar, { backgroundColor: info.color }]}>
          <Text style={styles.statusEmoji}>{info.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>{info.title}</Text>
            <Text style={styles.statusSub}>{info.sub}</Text>
          </View>
        </View>

        {/* OTP — sirf arrived pe dikhao */}
        {rideStatus === "arrived" && otp ? (
          <View style={styles.otpBox}>
            <Text style={styles.otpLabel}>Driver ko batao OTP:</Text>
            <Text style={styles.otpValue}>{otp}</Text>
          </View>
        ) : null}

        {/* Driver Info */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarTxt}>
              {(params.driverName || "D").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>
              {params.driverName || "Driver"}
            </Text>
            <Text style={styles.driverVehicle}>
              {VEMOJI[params.vehicleType] || "🚗"}{" "}
              {(params.vehicleType || "").toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={callDriver}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: "#27ae60" }]} />
            <Text style={styles.routeAddr} numberOfLines={1}>
              {params.pickupAddress || "—"}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: "#e74c3c" }]} />
            <Text style={styles.routeAddr} numberOfLines={1}>
              {params.dropAddress || "—"}
            </Text>
          </View>
        </View>

        {/* Fare */}
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>₹{params.fare}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backBtn: {
    position: "absolute",
    top: 55,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  driverMarker: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 6,
    borderWidth: 2,
    borderColor: "#F5A623",
    elevation: 4,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    elevation: 20,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  statusEmoji: { fontSize: 28 },
  statusTitle: { fontSize: 15, fontWeight: "900", color: "#fff" },
  statusSub: { fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  otpBox: {
    backgroundColor: "#fff8ee",
    margin: 12,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F5A623",
  },
  otpLabel: { fontSize: 13, color: "#888", marginBottom: 6 },
  otpValue: {
    fontSize: 40,
    fontWeight: "900",
    color: "#F5A623",
    letterSpacing: 10,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1a3a5c",
    justifyContent: "center",
    alignItems: "center",
  },
  driverAvatarTxt: { color: "#fff", fontWeight: "900", fontSize: 20 },
  driverName: { fontSize: 16, fontWeight: "800", color: "#1a1a2e" },
  driverVehicle: { fontSize: 13, color: "#888", marginTop: 3 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  routeCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  routeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  routeLine: {
    width: 1,
    height: 14,
    backgroundColor: "#e0e0e0",
    marginLeft: 4,
    marginVertical: 2,
  },
  routeAddr: { flex: 1, fontSize: 13, color: "#1a1a2e", fontWeight: "600" },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 32,
  },
  fareLabel: { fontSize: 14, color: "#888", fontWeight: "700" },
  fareAmount: { fontSize: 24, fontWeight: "900", color: "#F5A623" },
});
