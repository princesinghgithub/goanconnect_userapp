// // // app/(tabs)/home.tsx
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import * as Location from 'expo-location';
// // import { router } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   Alert,
// //   Dimensions,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View
// // } from 'react-native';
// // import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// // const { width, height } = Dimensions.get('window');

// // const VEHICLE_TYPES = [
// //   { id: 'bike', label: 'Bike', emoji: '🏍️', desc: '1 seat • Fastest' },
// //   { id: 'auto', label: 'Auto', emoji: '🛺', desc: '3 seats • Affordable' },
// //   { id: 'cab', label: 'Cab', emoji: '🚗', desc: '4 seats • Comfortable' },
// // ];

// // export default function HomeScreen() {
// //   const [userLocation, setUserLocation] = useState<any>(null);
// //   const [pickup, setPickup] = useState<any>(null);
// //   const [drop, setDrop] = useState<any>(null);
// //   const [selectedVehicle, setSelectedVehicle] = useState('auto');
// //   const [userName, setUserName] = useState('');
// //   const mapRef = useRef<MapView>(null);

// //   useEffect(() => {
// //     loadUser();
// //     getLocation();
// //   }, []);

// //   const loadUser = async () => {
// //     const userData = await AsyncStorage.getItem('user');
// //     if (userData) {
// //       const user = JSON.parse(userData);
// //       setUserName(user.name || 'Dost');
// //     }
// //   };

// //   const getLocation = async () => {
// //     const { status } = await Location.requestForegroundPermissionsAsync();
// //     if (status !== 'granted') {
// //       Alert.alert('Permission Chahiye', 'Location permission dijiye');
// //       return;
// //     }
// //     const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
// //     const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
// //     setUserLocation(coords);
// //     setPickup({ ...coords, address: 'Aapki current location' });

// //     mapRef.current?.animateToRegion({
// //       ...coords,
// //       latitudeDelta: 0.02,
// //       longitudeDelta: 0.02,
// //     });
// //   };

// //   const handlePickupPress = () => {
// //     router.push({
// //       pathname: '/(booking)/location-search',
// //       params: { type: 'pickup' },
// //     });
// //   };

// //   const handleDropPress = () => {
// //     router.push({
// //       pathname: '/(booking)/location-search',
// //       params: { type: 'drop' },
// //     });
// //   };

// //   const handleBookRide = () => {
// //     if (!pickup || !drop) {
// //       Alert.alert('Location Daalo', 'Pickup aur drop location select karo');
// //       return;
// //     }
// //     router.push({
// //       pathname: '/(booking)/fare-estimate',
// //       params: {
// //         pickupLat: pickup.latitude,
// //         pickupLng: pickup.longitude,
// //         pickupAddress: pickup.address,
// //         dropLat: drop.latitude,
// //         dropLng: drop.longitude,
// //         dropAddress: drop.address,
// //         vehicleType: selectedVehicle,
// //       },
// //     });
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="dark" />

// //       {/* MAP */}
// //       <MapView
// //         ref={mapRef}
// //         style={styles.map}
// //         provider={PROVIDER_GOOGLE}
// //         showsUserLocation
// //         showsMyLocationButton={false}
// //         initialRegion={{
// //           latitude: userLocation?.latitude || 15.4909,
// //           longitude: userLocation?.longitude || 73.8278,
// //           latitudeDelta: 0.05,
// //           longitudeDelta: 0.05,
// //         }}
// //       >
// //         {pickup && (
// //           <Marker coordinate={pickup} pinColor="#F5A623" title="Pickup" />
// //         )}
// //         {drop && (
// //           <Marker coordinate={drop} pinColor="#e74c3c" title="Drop" />
// //         )}
// //       </MapView>

// //       {/* MY LOCATION BUTTON */}
// //       <TouchableOpacity style={styles.myLocationBtn} onPress={getLocation}>
// //         <Ionicons name="locate" size={22} color="#1a3a5c" />
// //       </TouchableOpacity>

// //       {/* BOTTOM SHEET */}
// //       <View style={styles.bottomSheet}>
// //         {/* Greeting */}
// //         <View style={styles.greetingRow}>
// //           <View>
// //             <Text style={styles.greeting}>Namaste, {userName}! 👋</Text>
// //             <Text style={styles.greetingSubtitle}>Kahan jaana hai aaj?</Text>
// //           </View>
// //           <TouchableOpacity onPress={() => router.push('/profile')}>
// //             <View style={styles.avatar}>
// //               <Text style={styles.avatarText}>{userName.charAt(0) || 'U'}</Text>
// //             </View>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Location Inputs */}
// //         <View style={styles.locationCard}>
// //           {/* Pickup */}
// //           <TouchableOpacity style={styles.locationRow} onPress={handlePickupPress}>
// //             <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
// //             <View style={styles.locationTextContainer}>
// //               <Text style={styles.locationLabel}>PICKUP</Text>
// //               <Text style={styles.locationValue} numberOfLines={1}>
// //                 {pickup?.address || 'Pickup location select karo'}
// //               </Text>
// //             </View>
// //             <Ionicons name="chevron-forward" size={16} color="#aaa" />
// //           </TouchableOpacity>

// //           <View style={styles.divider} />

// //           {/* Drop */}
// //           <TouchableOpacity style={styles.locationRow} onPress={handleDropPress}>
// //             <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
// //             <View style={styles.locationTextContainer}>
// //               <Text style={styles.locationLabel}>DROP</Text>
// //               <Text style={[styles.locationValue, !drop && styles.locationPlaceholder]} numberOfLines={1}>
// //                 {drop?.address || 'Kahan jaana hai? 🔍'}
// //               </Text>
// //             </View>
// //             <Ionicons name="chevron-forward" size={16} color="#aaa" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Vehicle Selection */}
// //         <Text style={styles.sectionTitle}>Sawari Chuniye</Text>
// //         <View style={styles.vehicleRow}>
// //           {VEHICLE_TYPES.map(v => (
// //             <TouchableOpacity
// //               key={v.id}
// //               style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
// //               onPress={() => setSelectedVehicle(v.id)}
// //             >
// //               <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
// //               <Text style={[styles.vehicleLabel, selectedVehicle === v.id && styles.vehicleLabelActive]}>
// //                 {v.label}
// //               </Text>
// //               <Text style={styles.vehicleDesc}>{v.desc}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Book Button */}
// //         <TouchableOpacity
// //           style={[styles.bookBtn, (!pickup || !drop) && styles.bookBtnDisabled]}
// //           onPress={handleBookRide}
// //           disabled={!pickup || !drop}
// //         >
// //           <Text style={styles.bookBtnText}>Ride Book Karo 🚀</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f5f5f5' },
// //   map: { flex: 1 },
// //   myLocationBtn: {
// //     position: 'absolute',
// //     top: 60,
// //     right: 16,
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   bottomSheet: {
// //     backgroundColor: '#fff',
// //     borderTopLeftRadius: 28,
// //     borderTopRightRadius: 28,
// //     paddingHorizontal: 20,
// //     paddingTop: 16,
// //     paddingBottom: 30,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     elevation: 20,
// //   },
// //   greetingRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   greeting: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
// //   greetingSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
// //   avatar: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#1a3a5c',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
// //   locationCard: {
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 16,
// //     paddingVertical: 4,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#eee',
// //   },
// //   locationRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 14,
// //   },
// //   dot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     marginRight: 12,
// //   },
// //   locationTextContainer: { flex: 1 },
// //   locationLabel: {
// //     fontSize: 9,
// //     fontWeight: '800',
// //     color: '#aaa',
// //     letterSpacing: 1,
// //     marginBottom: 2,
// //   },
// //   locationValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
// //   locationPlaceholder: { color: '#bbb', fontWeight: '400' },
// //   divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 14 },
// //   sectionTitle: {
// //     fontSize: 14,
// //     fontWeight: '800',
// //     color: '#1a1a2e',
// //     marginBottom: 10,
// //     letterSpacing: 0.3,
// //   },
// //   vehicleRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 16,
// //     gap: 8,
// //   },
// //   vehicleCard: {
// //     flex: 1,
// //     alignItems: 'center',
// //     padding: 12,
// //     borderRadius: 14,
// //     borderWidth: 2,
// //     borderColor: '#eee',
// //     backgroundColor: '#f8f9fa',
// //   },
// //   vehicleCardActive: {
// //     borderColor: '#F5A623',
// //     backgroundColor: '#fff8ee',
// //   },
// //   vehicleEmoji: { fontSize: 26, marginBottom: 4 },
// //   vehicleLabel: { fontSize: 13, fontWeight: '800', color: '#555' },
// //   vehicleLabelActive: { color: '#F5A623' },
// //   vehicleDesc: { fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'center' },
// //   bookBtn: {
// //     backgroundColor: '#F5A623',
// //     borderRadius: 16,
// //     paddingVertical: 16,
// //     alignItems: 'center',
// //     shadowColor: '#F5A623',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.4,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   bookBtnDisabled: {
// //     backgroundColor: '#ddd',
// //     shadowOpacity: 0,
// //     elevation: 0,
// //   },
// //   bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
// // });



// // app/(tabs)/home.tsx
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import * as Location from 'expo-location';
// // import { router } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   Alert,
// //   StyleSheet, Text, TouchableOpacity, View
// // } from 'react-native';
// // import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// // const VEHICLE_TYPES = [
// //   { id: 'bike', label: 'Bike', emoji: '🏍️', desc: '1 seat • Fast' },
// //   { id: 'auto', label: 'Auto', emoji: '🛺', desc: '3 seats • Sasta' },
// //   { id: 'cab',  label: 'Cab',  emoji: '🚗', desc: '4 seats • Comfort' },
// // ];

// // export default function HomeScreen() {
// //   const mapRef = useRef<MapView>(null);
// //   const [pickup, setPickup] = useState<any>(null);
// //   const [drop, setDrop]     = useState<any>(null);
// //   const [selectedVehicle, setSelectedVehicle] = useState('auto');
// //   const [userName, setUserName] = useState('');

// //   // ✅ Polling — har 500ms AsyncStorage check karo
// //   useEffect(() => {
// //     loadAll(); // pehli baar
// //     const interval = setInterval(() => {
// //       loadAll();
// //     }, 500);
// //     return () => clearInterval(interval);
// //   }, []);

// //   const loadAll = async () => {
// //     // User
// //     const userData = await AsyncStorage.getItem('user');
// //     if (userData) setUserName(JSON.parse(userData).name || 'Dost');

// //     // Pickup
// //     const pickupRaw = await AsyncStorage.getItem('pickup');
// //     if (pickupRaw) {
// //       const p = JSON.parse(pickupRaw);
// //       setPickup(p);
// //     }

// //     // Drop
// //     const dropRaw = await AsyncStorage.getItem('drop');
// //     if (dropRaw) {
// //       const d = JSON.parse(dropRaw);
// //       setDrop(d);
// //     }
// //   };

// //   const getLocation = async () => {
// //     const { status } = await Location.requestForegroundPermissionsAsync();
// //     if (status !== 'granted') return;
// //     const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
// //     const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

// //     const pickupRaw = await AsyncStorage.getItem('pickup');
// //     if (!pickupRaw) {
// //       const [addr] = await Location.reverseGeocodeAsync(coords);
// //       const addressStr = [addr.name, addr.street, addr.city].filter(Boolean).join(', ');
// //       const p = { ...coords, address: addressStr || 'Current Location' };
// //       await AsyncStorage.setItem('pickup', JSON.stringify(p));
// //       setPickup(p);
// //     }

// //     mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 });
// //   };

// //   const handleBookRide = () => {
// //     if (!pickup || !drop) {
// //       Alert.alert('Location Daalo', 'Pickup aur drop dono select karo');
// //       return;
// //     }
// //     router.push({
// //       pathname: '/(booking)/fare-estimate',
// //       params: {
// //         pickupLat:     String(pickup.latitude),
// //         pickupLng:     String(pickup.longitude),
// //         pickupAddress: pickup.address,
// //         dropLat:       String(drop.latitude),
// //         dropLng:       String(drop.longitude),
// //         dropAddress:   drop.address,
// //         vehicleType:   selectedVehicle,
// //       },
// //     });
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="dark" />

// //       {/* MAP */}
// //       <MapView
// //         ref={mapRef}
// //         style={styles.map}
// //         provider={PROVIDER_GOOGLE}
// //         showsUserLocation
// //         showsMyLocationButton={false}
// //         initialRegion={{
// //           latitude: pickup?.latitude || 15.4909,
// //           longitude: pickup?.longitude || 73.8278,
// //           latitudeDelta: 0.05,
// //           longitudeDelta: 0.05,
// //         }}
// //       >
// //         {pickup && (
// //           <Marker
// //             coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
// //             pinColor="#27ae60" title="Pickup"
// //           />
// //         )}
// //         {drop && (
// //           <Marker
// //             coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
// //             pinColor="#e74c3c" title="Drop"
// //           />
// //         )}
// //       </MapView>

// //       {/* My Location Button */}
// //       <TouchableOpacity style={styles.myLocationBtn} onPress={getLocation}>
// //         <Ionicons name="locate" size={22} color="#1a3a5c" />
// //       </TouchableOpacity>

// //       {/* BOTTOM SHEET */}
// //       <View style={styles.bottomSheet}>

// //         {/* Greeting */}
// //         <View style={styles.greetingRow}>
// //           <View>
// //             <Text style={styles.greeting}>Namaste, {userName || 'Dost'}! 👋</Text>
// //             <Text style={styles.greetingSub}>Kahan jaana hai aaj?</Text>
// //           </View>
// //           <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
// //             <View style={styles.avatar}>
// //               <Text style={styles.avatarText}>
// //                 {(userName || 'U').charAt(0).toUpperCase()}
// //               </Text>
// //             </View>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Location Card */}
// //         <View style={styles.locationCard}>
// //           {/* Pickup */}
// //           <TouchableOpacity
// //             style={styles.locationRow}
// //             onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'pickup' } })}
// //           >
// //             <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
// //             <View style={styles.locationTextContainer}>
// //               <Text style={styles.locationLabel}>PICKUP</Text>
// //               <Text style={styles.locationValue} numberOfLines={1}>
// //                 {pickup?.address || 'Pickup location chuniye...'}
// //               </Text>
// //             </View>
// //             <Ionicons name="chevron-forward" size={16} color="#aaa" />
// //           </TouchableOpacity>

// //           <View style={styles.cardDivider} />

// //           {/* Drop */}
// //           <TouchableOpacity
// //             style={styles.locationRow}
// //             onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'drop' } })}
// //           >
// //             <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
// //             <View style={styles.locationTextContainer}>
// //               <Text style={styles.locationLabel}>DROP</Text>
// //               <Text
// //                 style={[styles.locationValue, !drop && styles.locationPlaceholder]}
// //                 numberOfLines={1}
// //               >
// //                 {drop?.address || 'Kahan jaana hai? 🔍'}
// //               </Text>
// //             </View>
// //             <Ionicons name="chevron-forward" size={16} color="#aaa" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Vehicle Selection */}
// //         <Text style={styles.sectionTitle}>Sawari Chuniye</Text>
// //         <View style={styles.vehicleRow}>
// //           {VEHICLE_TYPES.map(v => (
// //             <TouchableOpacity
// //               key={v.id}
// //               style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
// //               onPress={() => setSelectedVehicle(v.id)}
// //             >
// //               <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
// //               <Text style={[styles.vehicleLabel, selectedVehicle === v.id && styles.vehicleLabelActive]}>
// //                 {v.label}
// //               </Text>
// //               <Text style={styles.vehicleDesc}>{v.desc}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Book Button */}
// //         <TouchableOpacity
// //           style={[styles.bookBtn, (!pickup || !drop) && styles.bookBtnDisabled]}
// //           onPress={handleBookRide}
// //           disabled={!pickup || !drop}
// //         >
// //           <Text style={styles.bookBtnText}>
// //             {pickup && drop ? 'Ride Book Karo 🚀' : 'Pickup & Drop chuniye'}
// //           </Text>
// //         </TouchableOpacity>

// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   map: { flex: 1 },
// //   myLocationBtn: {
// //     position: 'absolute', top: 60, right: 16,
// //     backgroundColor: '#fff', borderRadius: 12, padding: 10,
// //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
// //   },
// //   bottomSheet: {
// //     backgroundColor: '#fff',
// //     borderTopLeftRadius: 28, borderTopRightRadius: 28,
// //     paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30,
// //     shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.1, shadowRadius: 12, elevation: 20,
// //   },
// //   greetingRow: {
// //     flexDirection: 'row', justifyContent: 'space-between',
// //     alignItems: 'center', marginBottom: 16,
// //   },
// //   greeting: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
// //   greetingSub: { fontSize: 13, color: '#888', marginTop: 2 },
// //   avatar: {
// //     width: 40, height: 40, borderRadius: 20,
// //     backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center',
// //   },
// //   avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
// //   locationCard: {
// //     backgroundColor: '#f8f9fa', borderRadius: 16,
// //     marginBottom: 16, borderWidth: 1, borderColor: '#eee',
// //   },
// //   locationRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
// //   dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
// //   locationTextContainer: { flex: 1 },
// //   locationLabel: { fontSize: 9, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
// //   locationValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
// //   locationPlaceholder: { color: '#bbb', fontWeight: '400' },
// //   cardDivider: { height: 1, backgroundColor: '#eee', marginHorizontal: 14 },
// //   sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
// //   vehicleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
// //   vehicleCard: {
// //     flex: 1, alignItems: 'center', padding: 12,
// //     borderRadius: 14, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f8f9fa',
// //   },
// //   vehicleCardActive: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
// //   vehicleEmoji: { fontSize: 26, marginBottom: 4 },
// //   vehicleLabel: { fontSize: 13, fontWeight: '800', color: '#555' },
// //   vehicleLabelActive: { color: '#F5A623' },
// //   vehicleDesc: { fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'center' },
// //   bookBtn: {
// //     backgroundColor: '#F5A623', borderRadius: 16, paddingVertical: 16,
// //     alignItems: 'center', elevation: 6,
// //   },
// //   bookBtnDisabled: { backgroundColor: '#ddd', elevation: 0 },
// //   bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
// // });


// // app/(tabs)/home.tsx
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   StyleSheet, Text, TouchableOpacity, View
// } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// const VEHICLE_TYPES = [
//   { id: 'bike', label: 'Bike', emoji: '🏍️', desc: '1 seat • Fast' },
//   { id: 'auto', label: 'Auto', emoji: '🛺', desc: '3 seats • Sasta' },
//   { id: 'cab',  label: 'Cab',  emoji: '🚗', desc: '4 seats • Comfort' },
// ];

// export default function HomeScreen() {
//   const mapRef = useRef<MapView>(null);
//   const [pickup, setPickup] = useState<any>(null);
//   const [drop, setDrop]     = useState<any>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState('auto');
//   const [userName, setUserName] = useState('');

//   // ✅ Location search se aaye params directly receive karo
//   const params = useLocalSearchParams<{
//     selectedType?: string;
//     selectedLat?:  string;
//     selectedLng?:  string;
//     selectedAddr?: string;
//   }>();

//   useEffect(() => {
//     if (params.selectedType && params.selectedLat && params.selectedAddr) {
//       const loc = {
//         latitude:  parseFloat(params.selectedLat),
//         longitude: parseFloat(params.selectedLng || '0'),
//         address:   params.selectedAddr,
//       };
//       if (params.selectedType === 'pickup') {
//         setPickup(loc);
//         AsyncStorage.setItem('pickup', JSON.stringify(loc));
//       } else {
//         setDrop(loc);
//         AsyncStorage.setItem('drop', JSON.stringify(loc));
//       }
//     }
//   }, [params.selectedType, params.selectedLat, params.selectedAddr]);

//   // ✅ Polling — har 500ms AsyncStorage check karo
//   useEffect(() => {
//     loadAll(); // pehli baar
//     const interval = setInterval(() => {
//       loadAll();
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   const loadAll = async () => {
//     // User
//     const userData = await AsyncStorage.getItem('user');
//     if (userData) setUserName(JSON.parse(userData).name || 'Dost');

//     // Pickup
//     const pickupRaw = await AsyncStorage.getItem('pickup');
//     if (pickupRaw) {
//       const p = JSON.parse(pickupRaw);
//       setPickup(p);
//     }

//     // Drop
//     const dropRaw = await AsyncStorage.getItem('drop');
//     if (dropRaw) {
//       const d = JSON.parse(dropRaw);
//       setDrop(d);
//     }
//   };

//   const getLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') return;
//     const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
//     const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

//     const pickupRaw = await AsyncStorage.getItem('pickup');
//     if (!pickupRaw) {
//       const [addr] = await Location.reverseGeocodeAsync(coords);
//       const addressStr = [addr.name, addr.street, addr.city].filter(Boolean).join(', ');
//       const p = { ...coords, address: addressStr || 'Current Location' };
//       await AsyncStorage.setItem('pickup', JSON.stringify(p));
//       setPickup(p);
//     }

//     mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 });
//   };

//   const handleBookRide = () => {
//     if (!pickup || !drop) {
//       Alert.alert('Location Daalo', 'Pickup aur drop dono select karo');
//       return;
//     }
//     router.push({
//       pathname: '/(booking)/fare-estimate',
//       params: {
//         pickupLat:     String(pickup.latitude),
//         pickupLng:     String(pickup.longitude),
//         pickupAddress: pickup.address,
//         dropLat:       String(drop.latitude),
//         dropLng:       String(drop.longitude),
//         dropAddress:   drop.address,
//         vehicleType:   selectedVehicle,
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* MAP */}
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation
//         showsMyLocationButton={false}
//         initialRegion={{
//           latitude: pickup?.latitude || 15.4909,
//           longitude: pickup?.longitude || 73.8278,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {pickup && (
//           <Marker
//             coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
//             pinColor="#27ae60" title="Pickup"
//           />
//         )}
//         {drop && (
//           <Marker
//             coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
//             pinColor="#e74c3c" title="Drop"
//           />
//         )}
//       </MapView>

//       {/* My Location Button */}
//       <TouchableOpacity style={styles.myLocationBtn} onPress={getLocation}>
//         <Ionicons name="locate" size={22} color="#1a3a5c" />
//       </TouchableOpacity>

//       {/* BOTTOM SHEET */}
//       <View style={styles.bottomSheet}>

//         {/* Greeting */}
//         <View style={styles.greetingRow}>
//           <View>
//             <Text style={styles.greeting}>Namaste, {userName || 'Dost'}! 👋</Text>
//             <Text style={styles.greetingSub}>Kahan jaana hai aaj?</Text>
//           </View>
//           <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>
//                 {(userName || 'U').charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Location Card */}
//         <View style={styles.locationCard}>
//           {/* Pickup */}
//           <TouchableOpacity
//             style={styles.locationRow}
//             onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'pickup' } })}
//           >
//             <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
//             <View style={styles.locationTextContainer}>
//               <Text style={styles.locationLabel}>PICKUP</Text>
//               <Text style={styles.locationValue} numberOfLines={1}>
//                 {pickup?.address || 'Pickup location chuniye...'}
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#aaa" />
//           </TouchableOpacity>

//           <View style={styles.cardDivider} />

//           {/* Drop */}
//           <TouchableOpacity
//             style={styles.locationRow}
//             onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'drop' } })}
//           >
//             <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
//             <View style={styles.locationTextContainer}>
//               <Text style={styles.locationLabel}>DROP</Text>
//               <Text
//                 style={[styles.locationValue, !drop && styles.locationPlaceholder]}
//                 numberOfLines={1}
//               >
//                 {drop?.address || 'Kahan jaana hai? 🔍'}
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#aaa" />
//           </TouchableOpacity>
//         </View>

//         {/* Vehicle Selection */}
//         <Text style={styles.sectionTitle}>Sawari Chuniye</Text>
//         <View style={styles.vehicleRow}>
//           {VEHICLE_TYPES.map(v => (
//             <TouchableOpacity
//               key={v.id}
//               style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
//               onPress={() => setSelectedVehicle(v.id)}
//             >
//               <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
//               <Text style={[styles.vehicleLabel, selectedVehicle === v.id && styles.vehicleLabelActive]}>
//                 {v.label}
//               </Text>
//               <Text style={styles.vehicleDesc}>{v.desc}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Book Button */}
//         <TouchableOpacity
//           style={[styles.bookBtn, (!pickup || !drop) && styles.bookBtnDisabled]}
//           onPress={handleBookRide}
//           disabled={!pickup || !drop}
//         >
//           <Text style={styles.bookBtnText}>
//             {pickup && drop ? 'Ride Book Karo 🚀' : 'Pickup & Drop chuniye'}
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   myLocationBtn: {
//     position: 'absolute', top: 60, right: 16,
//     backgroundColor: '#fff', borderRadius: 12, padding: 10,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
//   },
//   bottomSheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1, shadowRadius: 12, elevation: 20,
//   },
//   greetingRow: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     alignItems: 'center', marginBottom: 16,
//   },
//   greeting: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
//   greetingSub: { fontSize: 13, color: '#888', marginTop: 2 },
//   avatar: {
//     width: 40, height: 40, borderRadius: 20,
//     backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center',
//   },
//   avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
//   locationCard: {
//     backgroundColor: '#f8f9fa', borderRadius: 16,
//     marginBottom: 16, borderWidth: 1, borderColor: '#eee',
//   },
//   locationRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
//   dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
//   locationTextContainer: { flex: 1 },
//   locationLabel: { fontSize: 9, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
//   locationValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
//   locationPlaceholder: { color: '#bbb', fontWeight: '400' },
//   cardDivider: { height: 1, backgroundColor: '#eee', marginHorizontal: 14 },
//   sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
//   vehicleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
//   vehicleCard: {
//     flex: 1, alignItems: 'center', padding: 12,
//     borderRadius: 14, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f8f9fa',
//   },
//   vehicleCardActive: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
//   vehicleEmoji: { fontSize: 26, marginBottom: 4 },
//   vehicleLabel: { fontSize: 13, fontWeight: '800', color: '#555' },
//   vehicleLabelActive: { color: '#F5A623' },
//   vehicleDesc: { fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'center' },
//   bookBtn: {
//     backgroundColor: '#F5A623', borderRadius: 16, paddingVertical: 16,
//     alignItems: 'center', elevation: 6,
//   },
//   bookBtnDisabled: { backgroundColor: '#ddd', elevation: 0 },
//   bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
// });


// app/(tabs)/home.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Bike', emoji: '🏍️', desc: '1 seat • Fast' },
  { id: 'auto', label: 'Auto', emoji: '🛺', desc: '3 seats • Sasta' },
  { id: 'cab',  label: 'Cab',  emoji: '🚗', desc: '4 seats • Comfort' },
];

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [pickup, setPickup]   = useState<any>(null);
  const [drop, setDrop]       = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('auto');
  const [userName, setUserName] = useState('');
  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  // ✅ Params from location search
  const params = useLocalSearchParams<{
    selectedType?: string;
    selectedLat?:  string;
    selectedLng?:  string;
    selectedAddr?: string;
  }>();

  // ✅ Load from params (location search se aaya)
  useEffect(() => {
    if (params.selectedType && params.selectedLat && params.selectedAddr) {
      const loc = {
        latitude:  parseFloat(params.selectedLat),
        longitude: parseFloat(params.selectedLng || '0'),
        address:   params.selectedAddr,
      };
      if (params.selectedType === 'pickup') {
        setPickup(loc);
        AsyncStorage.setItem('pickup', JSON.stringify(loc));
      } else {
        setDrop(loc);
        AsyncStorage.setItem('drop', JSON.stringify(loc));
      }
    }
  }, [params.selectedType, params.selectedLat, params.selectedAddr]);

  // ✅ Polling — har 500ms AsyncStorage check karo
  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 500);
    return () => clearInterval(interval);
  }, []);

  // ✅ Route line — jab pickup aur drop dono ho
  useEffect(() => {
    if (pickup && drop) {
      setRouteCoords([
        { latitude: pickup.latitude, longitude: pickup.longitude },
        { latitude: drop.latitude,   longitude: drop.longitude },
      ]);
      // Map ko fit karo dono markers ke beech
      mapRef.current?.fitToCoordinates(
        [
          { latitude: pickup.latitude, longitude: pickup.longitude },
          { latitude: drop.latitude,   longitude: drop.longitude },
        ],
        { edgePadding: { top: 80, right: 50, bottom: 300, left: 50 }, animated: true }
      );
    } else {
      setRouteCoords([]);
    }
  }, [pickup, drop]);

  const loadAll = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) setUserName(JSON.parse(userData).name || 'Dost');

    const pickupRaw = await AsyncStorage.getItem('pickup');
    if (pickupRaw) setPickup(JSON.parse(pickupRaw));

    const dropRaw = await AsyncStorage.getItem('drop');
    if (dropRaw) setDrop(JSON.parse(dropRaw));
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission', 'Location permission do GPS ke liye');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      const [addr] = await Location.reverseGeocodeAsync(coords);
      const addressStr = [addr.name, addr.street, addr.city].filter(Boolean).join(', ');
      const p = { ...coords, address: addressStr || 'Current Location' };
      setPickup(p);
      await AsyncStorage.setItem('pickup', JSON.stringify(p));
      mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 });
    } catch (e) {
      Alert.alert('Error', 'Location detect nahi ho pa rahi');
    }
  };

  const handleBookRide = () => {
    if (!pickup || !drop) {
      Alert.alert('Location Daalo', 'Pickup aur drop dono select karo');
      return;
    }

    // Distance calculate karo
    const R = 6371;
    const dLat = (drop.latitude - pickup.latitude) * Math.PI / 180;
    const dLon = (drop.longitude - pickup.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(pickup.latitude * Math.PI/180) *
      Math.cos(drop.latitude * Math.PI/180) *
      Math.sin(dLon/2)**2;
    const distance = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;

    router.push({
      pathname: '/(booking)/fare-estimate',
      params: {
        pickupLat:     String(pickup.latitude),
        pickupLng:     String(pickup.longitude),
        pickupAddress: pickup.address,
        dropLat:       String(drop.latitude),
        dropLng:       String(drop.longitude),
        dropAddress:   drop.address,
        vehicleType:   selectedVehicle,
        distance:      String(distance),
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude:      pickup?.latitude  || 24.75,
          longitude:     pickup?.longitude || 81.5,
          latitudeDelta:  0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Pickup Marker */}
        {pickup && (
          <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}>
            <View style={styles.pickupMarker}>
              <Ionicons name="location" size={28} color="#27ae60" />
            </View>
          </Marker>
        )}

        {/* Drop Marker */}
        {drop && (
          <Marker coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}>
            <View style={styles.dropMarker}>
              <Ionicons name="flag" size={24} color="#e74c3c" />
            </View>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoords.length === 2 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#F5A623"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* My Location Button */}
      <TouchableOpacity style={styles.myLocationBtn} onPress={getLocation}>
        <Ionicons name="locate" size={22} color="#1a3a5c" />
      </TouchableOpacity>

      {/* BOTTOM SHEET */}
      <View style={styles.bottomSheet}>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Namaste, {userName || 'Dost'}! 👋</Text>
            <Text style={styles.greetingSub}>Kahan jaana hai aaj?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          {/* Pickup */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'pickup' } })}
          >
            <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>PICKUP</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {pickup?.address || 'Pickup location chuniye...'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Drop */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => router.push({ pathname: '/(booking)/location-search', params: { type: 'drop' } })}
          >
            <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>DROP</Text>
              <Text style={[styles.locationValue, !drop && styles.locationPlaceholder]} numberOfLines={1}>
                {drop?.address || 'Kahan jaana hai? 🔍'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Vehicle Selection */}
        <Text style={styles.sectionTitle}>Sawari Chuniye</Text>
        <View style={styles.vehicleRow}>
          {VEHICLE_TYPES.map(v => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
              onPress={() => setSelectedVehicle(v.id)}
            >
              <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
              <Text style={[styles.vehicleLabel, selectedVehicle === v.id && styles.vehicleLabelActive]}>
                {v.label}
              </Text>
              <Text style={styles.vehicleDesc}>{v.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookBtn, (!pickup || !drop) && styles.bookBtnDisabled]}
          onPress={handleBookRide}
          disabled={!pickup || !drop}
        >
          <Text style={styles.bookBtnText}>
            {pickup && drop ? 'Ride Book Karo 🚀' : 'Pickup & Drop chuniye'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pickupMarker: { alignItems: 'center' },
  dropMarker: { alignItems: 'center' },
  myLocationBtn: {
    position: 'absolute', top: 60, right: 16,
    backgroundColor: '#fff', borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 20,
  },
  greetingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  greeting: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  greetingSub: { fontSize: 13, color: '#888', marginTop: 2 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  locationCard: {
    backgroundColor: '#f8f9fa', borderRadius: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#eee',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  locationTextContainer: { flex: 1 },
  locationLabel: { fontSize: 9, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
  locationValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  locationPlaceholder: { color: '#bbb', fontWeight: '400' },
  cardDivider: { height: 1, backgroundColor: '#eee', marginHorizontal: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
  vehicleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  vehicleCard: {
    flex: 1, alignItems: 'center', padding: 10,
    borderRadius: 14, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f8f9fa',
  },
  vehicleCardActive: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
  vehicleEmoji: { fontSize: 24, marginBottom: 4 },
  vehicleLabel: { fontSize: 12, fontWeight: '800', color: '#555' },
  vehicleLabelActive: { color: '#F5A623' },
  vehicleDesc: { fontSize: 9, color: '#aaa', marginTop: 2, textAlign: 'center' },
  bookBtn: {
    backgroundColor: '#F5A623', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', elevation: 4,
  },
  bookBtnDisabled: { backgroundColor: '#ddd', elevation: 0 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
