// // // // app/(booking)/location-search.tsx
// // // import { API_BASE_URL } from '@/constants/config';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import axios from 'axios';
// // // import * as Location from 'expo-location';
// // // import { router, useLocalSearchParams } from 'expo-router';
// // // import { StatusBar } from 'expo-status-bar';
// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   FlatList,
// // //   Keyboard,
// // //   StyleSheet,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   View,
// // // } from 'react-native';

// // // // Debounce helper
// // // function useDebounce(value: string, delay: number) {
// // //   const [debouncedValue, setDebouncedValue] = useState(value);
// // //   useEffect(() => {
// // //     const handler = setTimeout(() => setDebouncedValue(value), delay);
// // //     return () => clearTimeout(handler);
// // //   }, [value, delay]);
// // //   return debouncedValue;
// // // }

// // // export default function LocationSearchScreen() {
// // //   const { type } = useLocalSearchParams<{ type: 'pickup' | 'drop' }>();
// // //   const [query, setQuery] = useState('');
// // //   const [results, setResults] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const debouncedQuery = useDebounce(query, 400);

// // //   const isPickup = type === 'pickup';

// // //   useEffect(() => {
// // //     if (debouncedQuery.length > 2) {
// // //       searchPlaces(debouncedQuery);
// // //     } else {
// // //       setResults([]);
// // //     }
// // //   }, [debouncedQuery]);

// // //   const searchPlaces = async (text: string) => {
// // //     setLoading(true);
// // //     try {
// // //       const token = await AsyncStorage.getItem('token');
// // //       const res = await axios.get(`${API_BASE_URL}/location/search`, {
// // //         params: { query: text },
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setResults(res.data.results || []);
// // //     } catch (error) {
// // //       // Fallback: use expo-location geocoding
// // //       try {
// // //         const geocoded = await Location.geocodeAsync(text);
// // //         const mapped = geocoded.map((g, i) => ({
// // //           id: String(i),
// // //           description: text,
// // //           latitude: g.latitude,
// // //           longitude: g.longitude,
// // //         }));
// // //         setResults(mapped);
// // //       } catch {
// // //         setResults([]);
// // //       }
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleSelectPlace = (place: any) => {
// // //     Keyboard.dismiss();
// // //     // Store in global state or pass back via router params
// // //     const key = isPickup ? 'pickup' : 'drop';
// // //     AsyncStorage.setItem(key, JSON.stringify({
// // //       latitude: place.latitude,
// // //       longitude: place.longitude,
// // //       address: place.description,
// // //     }));
// // //     router.back();
// // //   };

// // //   const handleCurrentLocation = async () => {
// // //     const { status } = await Location.requestForegroundPermissionsAsync();
// // //     if (status !== 'granted') return;
// // //     const loc = await Location.getCurrentPositionAsync({});
// // //     const [address] = await Location.reverseGeocodeAsync({
// // //       latitude: loc.coords.latitude,
// // //       longitude: loc.coords.longitude,
// // //     });
// // //     const addressStr = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}`.trim();
// // //     const key = isPickup ? 'pickup' : 'drop';
// // //     await AsyncStorage.setItem(key, JSON.stringify({
// // //       latitude: loc.coords.latitude,
// // //       longitude: loc.coords.longitude,
// // //       address: addressStr || 'Current Location',
// // //     }));
// // //     router.back();
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar style="dark" />

// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
// // //           <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>
// // //           {isPickup ? '📍 Pickup Location' : '🎯 Drop Location'}
// // //         </Text>
// // //       </View>

// // //       {/* Search Input */}
// // //       <View style={styles.searchContainer}>
// // //         <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 10 }} />
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder={isPickup ? 'Pickup kahan se lena hai?' : 'Kahan jaana hai?'}
// // //           placeholderTextColor="#aaa"
// // //           value={query}
// // //           onChangeText={setQuery}
// // //           autoFocus
// // //           returnKeyType="search"
// // //         />
// // //         {loading && <ActivityIndicator size="small" color="#F5A623" />}
// // //         {query.length > 0 && !loading && (
// // //           <TouchableOpacity onPress={() => setQuery('')}>
// // //             <Ionicons name="close-circle" size={18} color="#aaa" />
// // //           </TouchableOpacity>
// // //         )}
// // //       </View>

// // //       <FlatList
// // //         data={results}
// // //         keyExtractor={item => item.id}
// // //         keyboardShouldPersistTaps="handled"
// // //         ListHeaderComponent={
// // //           <>
// // //             {/* Current Location Quick Pick */}
// // //             {isPickup && (
// // //               <TouchableOpacity style={styles.currentLocationBtn} onPress={handleCurrentLocation}>
// // //                 <View style={styles.currentLocationIcon}>
// // //                   <Ionicons name="locate" size={18} color="#1a3a5c" />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.currentLocationText}>Current Location Use Karo</Text>
// // //                   <Text style={styles.currentLocationSubtext}>GPS se apni jagah detect karo</Text>
// // //                 </View>
// // //               </TouchableOpacity>
// // //             )}

// // //             {/* Recent Searches Header */}
// // //             {results.length === 0 && query.length === 0 && (
// // //               <Text style={styles.sectionHeader}>🕐 Recent Searches</Text>
// // //             )}

// // //             {results.length > 0 && (
// // //               <Text style={styles.sectionHeader}>📍 Results</Text>
// // //             )}
// // //           </>
// // //         }
// // //         renderItem={({ item }) => (
// // //           <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectPlace(item)}>
// // //             <View style={styles.resultIcon}>
// // //               <Ionicons name="location-outline" size={18} color="#F5A623" />
// // //             </View>
// // //             <View style={styles.resultText}>
// // //               <Text style={styles.resultMain} numberOfLines={1}>{item.description}</Text>
// // //               {item.secondary_text && (
// // //                 <Text style={styles.resultSub} numberOfLines={1}>{item.secondary_text}</Text>
// // //               )}
// // //             </View>
// // //           </TouchableOpacity>
// // //         )}
// // //         ListEmptyComponent={
// // //           query.length > 2 && !loading ? (
// // //             <View style={styles.emptyState}>
// // //               <Text style={styles.emptyEmoji}>🔍</Text>
// // //               <Text style={styles.emptyText}>Koi jagah nahi mili</Text>
// // //               <Text style={styles.emptySubtext}>Doosra naam try karo</Text>
// // //             </View>
// // //           ) : null
// // //         }
// // //       />
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#fff' },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingTop: 55,
// // //     paddingBottom: 16,
// // //     paddingHorizontal: 16,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f0',
// // //   },
// // //   backBtn: { marginRight: 12, padding: 4 },
// // //   headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     margin: 16,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     backgroundColor: '#f5f5f5',
// // //     borderRadius: 14,
// // //     borderWidth: 1.5,
// // //     borderColor: '#F5A623',
// // //   },
// // //   searchInput: { flex: 1, fontSize: 15, color: '#1a1a2e' },
// // //   currentLocationBtn: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f5f5f5',
// // //   },
// // //   currentLocationIcon: {
// // //     width: 38,
// // //     height: 38,
// // //     borderRadius: 19,
// // //     backgroundColor: '#eef2f7',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   currentLocationText: { fontSize: 14, fontWeight: '700', color: '#1a3a5c' },
// // //   currentLocationSubtext: { fontSize: 12, color: '#888', marginTop: 2 },
// // //   sectionHeader: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //     color: '#aaa',
// // //     backgroundColor: '#fafafa',
// // //     letterSpacing: 0.5,
// // //   },
// // //   resultItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f5f5f5',
// // //   },
// // //   resultIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: '#fff8ee',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   resultText: { flex: 1 },
// // //   resultMain: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
// // //   resultSub: { fontSize: 12, color: '#888', marginTop: 2 },
// // //   emptyState: { alignItems: 'center', paddingTop: 60 },
// // //   emptyEmoji: { fontSize: 48, marginBottom: 12 },
// // //   emptyText: { fontSize: 16, fontWeight: '700', color: '#444' },
// // //   emptySubtext: { fontSize: 13, color: '#888', marginTop: 4 },
// // // });



// // // app/(booking)/location-search.tsx
// // import { API_BASE_URL } from '@/constants/config';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import * as Location from 'expo-location';
// // import { router, useLocalSearchParams } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useState } from 'react';
// // import {
// //   ActivityIndicator, FlatList, Keyboard,
// //   StyleSheet, Text, TextInput, TouchableOpacity, View,
// // } from 'react-native';

// // function useDebounce(value: string, delay: number) {
// //   const [debouncedValue, setDebouncedValue] = useState(value);
// //   useEffect(() => {
// //     const handler = setTimeout(() => setDebouncedValue(value), delay);
// //     return () => clearTimeout(handler);
// //   }, [value, delay]);
// //   return debouncedValue;
// // }

// // export default function LocationSearchScreen() {
// //   const { type } = useLocalSearchParams<{ type: 'pickup' | 'drop' }>();
// //   const [query, setQuery] = useState('');
// //   const [results, setResults] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const debouncedQuery = useDebounce(query, 400);
// //   const isPickup = type === 'pickup';

// //   useEffect(() => {
// //     if (debouncedQuery.length > 2) {
// //       searchPlaces(debouncedQuery);
// //     } else {
// //       setResults([]);
// //     }
// //   }, [debouncedQuery]);

// //   const searchPlaces = async (text: string) => {
// //     setLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem('token');
// //       const res = await axios.get(`${API_BASE_URL}/location/search`, {
// //         params: { query: text },
// //         headers: { Authorization: `Bearer ${token}` },
// //         timeout: 10000,
// //       });

// //       // Backend response: { status: "success", data: [...] }
// //       const raw: any[] = res.data?.data || [];

// //       const places = raw.map((p: any) => ({
// //         id: String(p.id),                  // ✅ String mein convert karo
// //         description: p.addressLine1 || '',
// //         secondary_text: p.addressLine2 || '',
// //         latitude: p.location?.latitude,
// //         longitude: p.location?.longitude,
// //       }));

// //       setResults(places);

// //     } catch (error: any) {
// //       // Fallback: expo-location geocoding
// //       try {
// //         const geocoded = await Location.geocodeAsync(text);
// //         const mapped = geocoded.map((g, i) => ({
// //           id: String(i),
// //           description: text,
// //           secondary_text: '',
// //           latitude: g.latitude,
// //           longitude: g.longitude,
// //         }));
// //         setResults(mapped);
// //       } catch {
// //         setResults([]);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSelectPlace = async (place: any) => {
// //     Keyboard.dismiss();
// //     const key = isPickup ? 'pickup' : 'drop';
// //     await AsyncStorage.setItem(key, JSON.stringify({
// //       latitude: place.latitude,
// //       longitude: place.longitude,
// //       address: place.description,
// //     }));
// //     router.back();
// //   };

// //   const handleCurrentLocation = async () => {
// //     setLoading(true);
// //     try {
// //       const { status } = await Location.requestForegroundPermissionsAsync();
// //       if (status !== 'granted') return;
// //       const loc = await Location.getCurrentPositionAsync({});
// //       const [addr] = await Location.reverseGeocodeAsync({
// //         latitude: loc.coords.latitude,
// //         longitude: loc.coords.longitude,
// //       });
// //       const addressStr = [addr.name, addr.street, addr.city]
// //         .filter(Boolean).join(', ');
// //       await AsyncStorage.setItem('pickup', JSON.stringify({
// //         latitude: loc.coords.latitude,
// //         longitude: loc.coords.longitude,
// //         address: addressStr || 'Current Location',
// //       }));
// //       router.back();
// //     } catch (e) {
// //       console.log(e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="dark" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
// //           <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>
// //           {isPickup ? '📍 Pickup Location' : '🎯 Drop Location'}
// //         </Text>
// //       </View>

// //       {/* Search Input */}
// //       <View style={styles.searchContainer}>
// //         <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 10 }} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder={isPickup ? 'Pickup kahan se lena hai?' : 'Kahan jaana hai?'}
// //           placeholderTextColor="#aaa"
// //           value={query}
// //           onChangeText={setQuery}
// //           autoFocus
// //           returnKeyType="search"
// //         />
// //         {loading
// //           ? <ActivityIndicator size="small" color="#F5A623" />
// //           : query.length > 0 && (
// //             <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
// //               <Ionicons name="close-circle" size={18} color="#aaa" />
// //             </TouchableOpacity>
// //           )
// //         }
// //       </View>

// //       {/* Results List */}
// //       <FlatList
// //         data={results}
// //         keyExtractor={(item) => item.id}   // ✅ Ab String hai
// //         keyboardShouldPersistTaps="handled"
// //         ListHeaderComponent={
// //           <>
// //             {/* Current Location */}
// //             {isPickup && (
// //               <TouchableOpacity style={styles.currentLocationBtn} onPress={handleCurrentLocation}>
// //                 <View style={styles.currentLocationIcon}>
// //                   <Ionicons name="locate" size={18} color="#1a3a5c" />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.currentLocationText}>Current Location Use Karo</Text>
// //                   <Text style={styles.currentLocationSubtext}>GPS se apni jagah detect karo</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             )}

// //             {/* Headers */}
// //             {results.length === 0 && query.length === 0 && (
// //               <Text style={styles.sectionHeader}>🕐 Yahan search karo</Text>
// //             )}
// //             {results.length > 0 && (
// //               <Text style={styles.sectionHeader}>📍 {results.length} Results mile</Text>
// //             )}
// //           </>
// //         }
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={styles.resultItem}
// //             onPress={() => handleSelectPlace(item)}
// //             activeOpacity={0.7}
// //           >
// //             <View style={styles.resultIcon}>
// //               <Ionicons name="location-outline" size={18} color="#F5A623" />
// //             </View>
// //             <View style={styles.resultText}>
// //               <Text style={styles.resultMain} numberOfLines={1}>
// //                 {item.description}
// //               </Text>
// //               {item.secondary_text ? (
// //                 <Text style={styles.resultSub} numberOfLines={1}>
// //                   {item.secondary_text}
// //                 </Text>
// //               ) : null}
// //             </View>
// //             <Ionicons name="chevron-forward" size={16} color="#ddd" />
// //           </TouchableOpacity>
// //         )}
// //         ListEmptyComponent={
// //           query.length > 2 && !loading ? (
// //             <View style={styles.emptyState}>
// //               <Text style={styles.emptyEmoji}>🔍</Text>
// //               <Text style={styles.emptyText}>Koi jagah nahi mili</Text>
// //               <Text style={styles.emptySubtext}>Doosra naam try karo</Text>
// //             </View>
// //           ) : null
// //         }
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#fff' },
// //   header: {
// //     flexDirection: 'row', alignItems: 'center',
// //     paddingTop: 55, paddingBottom: 16, paddingHorizontal: 16,
// //     borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
// //   },
// //   backBtn: { marginRight: 12, padding: 4 },
// //   headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
// //   searchContainer: {
// //     flexDirection: 'row', alignItems: 'center',
// //     margin: 16, paddingHorizontal: 16, paddingVertical: 12,
// //     backgroundColor: '#f5f5f5', borderRadius: 14,
// //     borderWidth: 1.5, borderColor: '#F5A623',
// //   },
// //   searchInput: { flex: 1, fontSize: 15, color: '#1a1a2e' },
// //   currentLocationBtn: {
// //     flexDirection: 'row', alignItems: 'center',
// //     paddingHorizontal: 16, paddingVertical: 14,
// //     borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
// //   },
// //   currentLocationIcon: {
// //     width: 38, height: 38, borderRadius: 19,
// //     backgroundColor: '#eef2f7', justifyContent: 'center',
// //     alignItems: 'center', marginRight: 12,
// //   },
// //   currentLocationText: { fontSize: 14, fontWeight: '700', color: '#1a3a5c' },
// //   currentLocationSubtext: { fontSize: 12, color: '#888', marginTop: 2 },
// //   sectionHeader: {
// //     paddingHorizontal: 16, paddingVertical: 10,
// //     fontSize: 12, fontWeight: '700', color: '#aaa',
// //     backgroundColor: '#fafafa', letterSpacing: 0.5,
// //   },
// //   resultItem: {
// //     flexDirection: 'row', alignItems: 'center',
// //     paddingHorizontal: 16, paddingVertical: 16,
// //     borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
// //     backgroundColor: '#fff',
// //   },
// //   resultIcon: {
// //     width: 38, height: 38, borderRadius: 19,
// //     backgroundColor: '#fff8ee', justifyContent: 'center',
// //     alignItems: 'center', marginRight: 14,
// //   },
// //   resultText: { flex: 1 },
// //   resultMain: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
// //   resultSub: { fontSize: 12, color: '#888', marginTop: 3 },
// //   emptyState: { alignItems: 'center', paddingTop: 60 },
// //   emptyEmoji: { fontSize: 48, marginBottom: 12 },
// //   emptyText: { fontSize: 16, fontWeight: '700', color: '#444' },
// //   emptySubtext: { fontSize: 13, color: '#888', marginTop: 4 },
// // });



// // app/(booking)/location-search.tsx
// import { API_BASE_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import * as Location from 'expo-location';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator, FlatList, Keyboard,
//   StyleSheet, Text, TextInput, TouchableOpacity, View,
// } from 'react-native';

// function useDebounce(value: string, delay: number) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// export default function LocationSearchScreen() {
//   const { type } = useLocalSearchParams<{ type: 'pickup' | 'drop' }>();
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const debouncedQuery = useDebounce(query, 400);
//   const isPickup = type === 'pickup';

//   useEffect(() => {
//     if (debouncedQuery.length > 2) {
//       searchPlaces(debouncedQuery);
//     } else {
//       setResults([]);
//     }
//   }, [debouncedQuery]);

//   const searchPlaces = async (text: string) => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/location/search`, {
//         params: { query: text },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       // Backend response: { status: "success", data: [...] }
//       const raw: any[] = res.data?.data || [];

//       const places = raw.map((p: any) => ({
//         id: String(p.id),                  // ✅ String mein convert karo
//         description: p.addressLine1 || '',
//         secondary_text: p.addressLine2 || '',
//         latitude: p.location?.latitude,
//         longitude: p.location?.longitude,
//       }));

//       setResults(places);

//     } catch (error: any) {
//       // Fallback: expo-location geocoding
//       try {
//         const geocoded = await Location.geocodeAsync(text);
//         const mapped = geocoded.map((g, i) => ({
//           id: String(i),
//           description: text,
//           secondary_text: '',
//           latitude: g.latitude,
//           longitude: g.longitude,
//         }));
//         setResults(mapped);
//       } catch {
//         setResults([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectPlace = async (place: any) => {
//     Keyboard.dismiss();
//     const key = isPickup ? 'pickup' : 'drop';
//     await AsyncStorage.setItem(key, JSON.stringify({
//       latitude: place.latitude,
//       longitude: place.longitude,
//       address: place.description,
//     }));
//     router.navigate("/(tabs)/home");
//   };

//   const handleCurrentLocation = async () => {
//     setLoading(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') return;
//       const loc = await Location.getCurrentPositionAsync({});
//       const [addr] = await Location.reverseGeocodeAsync({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });
//       const addressStr = [addr.name, addr.street, addr.city]
//         .filter(Boolean).join(', ');
//       await AsyncStorage.setItem('pickup', JSON.stringify({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         address: addressStr || 'Current Location',
//       }));
//       router.navigate("/(tabs)/home");
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {isPickup ? '📍 Pickup Location' : '🎯 Drop Location'}
//         </Text>
//       </View>

//       {/* Search Input */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 10 }} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder={isPickup ? 'Pickup kahan se lena hai?' : 'Kahan jaana hai?'}
//           placeholderTextColor="#aaa"
//           value={query}
//           onChangeText={setQuery}
//           autoFocus
//           returnKeyType="search"
//         />
//         {loading
//           ? <ActivityIndicator size="small" color="#F5A623" />
//           : query.length > 0 && (
//             <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
//               <Ionicons name="close-circle" size={18} color="#aaa" />
//             </TouchableOpacity>
//           )
//         }
//       </View>

//       {/* Results List */}
//       <FlatList
//         data={results}
//         keyExtractor={(item) => item.id}   // ✅ Ab String hai
//         keyboardShouldPersistTaps="handled"
//         ListHeaderComponent={
//           <>
//             {/* Current Location */}
//             {isPickup && (
//               <TouchableOpacity style={styles.currentLocationBtn} onPress={handleCurrentLocation}>
//                 <View style={styles.currentLocationIcon}>
//                   <Ionicons name="locate" size={18} color="#1a3a5c" />
//                 </View>
//                 <View>
//                   <Text style={styles.currentLocationText}>Current Location Use Karo</Text>
//                   <Text style={styles.currentLocationSubtext}>GPS se apni jagah detect karo</Text>
//                 </View>
//               </TouchableOpacity>
//             )}

//             {/* Headers */}
//             {results.length === 0 && query.length === 0 && (
//               <Text style={styles.sectionHeader}>🕐 Yahan search karo</Text>
//             )}
//             {results.length > 0 && (
//               <Text style={styles.sectionHeader}>📍 {results.length} Results mile</Text>
//             )}
//           </>
//         }
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.resultItem}
//             onPress={() => handleSelectPlace(item)}
//             activeOpacity={0.7}
//           >
//             <View style={styles.resultIcon}>
//               <Ionicons name="location-outline" size={18} color="#F5A623" />
//             </View>
//             <View style={styles.resultText}>
//               <Text style={styles.resultMain} numberOfLines={1}>
//                 {item.description}
//               </Text>
//               {item.secondary_text ? (
//                 <Text style={styles.resultSub} numberOfLines={1}>
//                   {item.secondary_text}
//                 </Text>
//               ) : null}
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#ddd" />
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           query.length > 2 && !loading ? (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>🔍</Text>
//               <Text style={styles.emptyText}>Koi jagah nahi mili</Text>
//               <Text style={styles.emptySubtext}>Doosra naam try karo</Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingTop: 55, paddingBottom: 16, paddingHorizontal: 16,
//     borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   backBtn: { marginRight: 12, padding: 4 },
//   headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
//   searchContainer: {
//     flexDirection: 'row', alignItems: 'center',
//     margin: 16, paddingHorizontal: 16, paddingVertical: 12,
//     backgroundColor: '#f5f5f5', borderRadius: 14,
//     borderWidth: 1.5, borderColor: '#F5A623',
//   },
//   searchInput: { flex: 1, fontSize: 15, color: '#1a1a2e' },
//   currentLocationBtn: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingVertical: 14,
//     borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
//   },
//   currentLocationIcon: {
//     width: 38, height: 38, borderRadius: 19,
//     backgroundColor: '#eef2f7', justifyContent: 'center',
//     alignItems: 'center', marginRight: 12,
//   },
//   currentLocationText: { fontSize: 14, fontWeight: '700', color: '#1a3a5c' },
//   currentLocationSubtext: { fontSize: 12, color: '#888', marginTop: 2 },
//   sectionHeader: {
//     paddingHorizontal: 16, paddingVertical: 10,
//     fontSize: 12, fontWeight: '700', color: '#aaa',
//     backgroundColor: '#fafafa', letterSpacing: 0.5,
//   },
//   resultItem: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingVertical: 16,
//     borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
//     backgroundColor: '#fff',
//   },
//   resultIcon: {
//     width: 38, height: 38, borderRadius: 19,
//     backgroundColor: '#fff8ee', justifyContent: 'center',
//     alignItems: 'center', marginRight: 14,
//   },
//   resultText: { flex: 1 },
//   resultMain: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
//   resultSub: { fontSize: 12, color: '#888', marginTop: 3 },
//   emptyState: { alignItems: 'center', paddingTop: 60 },
//   emptyEmoji: { fontSize: 48, marginBottom: 12 },
//   emptyText: { fontSize: 16, fontWeight: '700', color: '#444' },
//   emptySubtext: { fontSize: 13, color: '#888', marginTop: 4 },
// });



// app/(booking)/location-search.tsx
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function LocationSearchScreen() {
  const { type } = useLocalSearchParams<{ type: 'pickup' | 'drop' }>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const isPickup = type === 'pickup';

  useEffect(() => {
    if (debouncedQuery.length > 2) searchPlaces(debouncedQuery);
    else setResults([]);
  }, [debouncedQuery]);

  const searchPlaces = async (text: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/location/search`, {
        params: { query: text },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      const raw: any[] = res.data?.data || [];
      const places = raw.map((p: any) => ({
        id: String(p.id),
        description: p.addressLine1 || '',
        secondary_text: p.addressLine2 || '',
        latitude: p.location?.latitude,
        longitude: p.location?.longitude,
      }));
      setResults(places);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Location select — params ke saath home pe bhejo
  const onPlaceSelect = async (place: any) => {
    // AsyncStorage mein bhi save karo (backup)
    const key = isPickup ? 'pickup' : 'drop';
    await AsyncStorage.setItem(key, JSON.stringify({
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.description,
    }));

    // ✅ Home ko params ke saath navigate karo — seedha state update
    router.replace({
      pathname: '/(tabs)/home',
      params: {
        selectedType: key,
        selectedLat:  String(place.latitude),
        selectedLng:  String(place.longitude),
        selectedAddr: place.description,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isPickup ? 'Pickup Chuniye' : 'Drop Chuniye'}
        </Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.input}
          placeholder={isPickup ? 'Pickup kahan se?' : 'Kahan jaana hai?'}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
        />
        {loading && <ActivityIndicator size="small" color="#F5A623" />}
        {!loading && query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <Ionicons name="close" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          // ✅ TouchableHighlight — more reliable than TouchableOpacity in lists
          <TouchableHighlight
            underlayColor="#f0f0f0"
            onPress={() => onPlaceSelect(item)}
          >
            <View style={styles.item}>
              <Ionicons name="location-outline" size={20} color="#F5A623" style={styles.itemIcon} />
              <View style={styles.itemText}>
                <Text style={styles.itemMain}>{item.description}</Text>
                <Text style={styles.itemSub} numberOfLines={1}>{item.secondary_text}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        ListEmptyComponent={
          query.length > 2 && !loading ? (
            <Text style={styles.empty}>Koi jagah nahi mili</Text>
          ) : null
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, padding: 12,
    backgroundColor: '#f5f5f5', borderRadius: 12,
    borderWidth: 2, borderColor: '#F5A623', gap: 8,
  },
  input: { flex: 1, fontSize: 16, color: '#1a1a2e' },
  item: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  itemIcon: { marginRight: 12 },
  itemText: { flex: 1 },
  itemMain: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  empty: { textAlign: 'center', padding: 40, color: '#aaa', fontSize: 15 },
});
