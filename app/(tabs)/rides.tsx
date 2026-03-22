// // app/(tabs)/rides.tsx
// import { API_BASE_URL } from '@/constants/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//     ActivityIndicator, FlatList, RefreshControl,
//     StyleSheet, Text, TouchableOpacity, View,
// } from 'react-native';

// const STATUS_COLOR: any = {
//   searching:  '#F5A623',
//   accepted:   '#3498db',
//   arrived:    '#9b59b6',
//   started:    '#2ecc71',
//   completed:  '#27ae60',
//   cancelled:  '#e74c3c',
// };

// const STATUS_LABEL: any = {
//   searching:  'Searching',
//   accepted:   'Driver Aa Raha Hai',
//   arrived:    'Driver Pahuncha',
//   started:    'Ride Chal Rahi Hai',
//   completed:  'Completed ✅',
//   cancelled:  'Cancelled ❌',
// };

// const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜' };

// export default function RidesScreen() {
//   const [rides, setRides]       = useState<any[]>([]);
//   const [loading, setLoading]   = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => { fetchRides(); }, []);

//   const fetchRides = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/ride/history/customer`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRides(res.data?.data || []);
//     } catch (e) {
//       console.log('Rides fetch error:', e);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchRides();
//   }, []);

//   const formatDate = (dateStr: string) => {
//     const d = new Date(dateStr);
//     return d.toLocaleDateString('hi-IN', {
//       day: '2-digit', month: 'short', year: 'numeric',
//       hour: '2-digit', minute: '2-digit',
//     });
//   };

//   if (loading) return (
//     <View style={styles.loader}>
//       <ActivityIndicator size="large" color="#F5A623" />
//       <Text style={styles.loaderText}>Rides load ho rahi hain...</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>🚗 Meri Rides</Text>
//       </View>

//       <FlatList
//         data={rides}
//         keyExtractor={item => item._id}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F5A623']} />
//         }
//         contentContainerStyle={{ paddingBottom: 20 }}
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Text style={styles.emptyEmoji}>🚗</Text>
//             <Text style={styles.emptyText}>Abhi tak koi ride nahi ki</Text>
//             <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/(tabs)/home')}>
//               <Text style={styles.bookBtnText}>Pehli Ride Book Karo!</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.rideCard}>
//             {/* Top Row */}
//             <View style={styles.rideTop}>
//               <Text style={styles.vehicleEmoji}>
//                 {VEHICLE_EMOJI[item.vehicleType] || '🚗'}
//               </Text>
//               <View style={styles.rideTopInfo}>
//                 <Text style={styles.vehicleType}>{item.vehicleType?.toUpperCase()}</Text>
//                 <Text style={styles.rideDate}>{formatDate(item.createdAt)}</Text>
//               </View>
//               <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '20' }]}>
//                 <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>
//                   {STATUS_LABEL[item.status] || item.status}
//                 </Text>
//               </View>
//             </View>

//             {/* Route */}
//             <View style={styles.routeContainer}>
//               <View style={styles.routeRow}>
//                 <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
//                 <Text style={styles.routeText} numberOfLines={1}>{item.pickup?.address}</Text>
//               </View>
//               <View style={styles.routeLine} />
//               <View style={styles.routeRow}>
//                 <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
//                 <Text style={styles.routeText} numberOfLines={1}>{item.drop?.address}</Text>
//               </View>
//             </View>

//             {/* Bottom Row */}
//             <View style={styles.rideBottom}>
//               <Text style={styles.rideDistance}>📍 {item.distance?.toFixed(1)} km</Text>
//               <Text style={styles.rideFare}>₹{item.fare}</Text>
//             </View>

//             {/* Active ride — Resume button */}
//             {['searching', 'accepted', 'arrived', 'started'].includes(item.status) && (
//               <TouchableOpacity
//                 style={styles.resumeBtn}
//                 onPress={() => router.push({
//                   pathname: '/(booking)/searching-driver',
//                   params: {
//                     bookingId:     item._id,
//                     fare:          String(item.fare),
//                     vehicleType:   item.vehicleType,
//                     pickupAddress: item.pickup?.address,
//                     dropAddress:   item.drop?.address,
//                   },
//                 })}
//               >
//                 <Text style={styles.resumeBtnText}>▶ Ride Resume Karo</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loaderText: { marginTop: 12, color: '#888', fontSize: 15 },
//   header: {
//     paddingTop: 55, paddingBottom: 16, paddingHorizontal: 20,
//     backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   headerTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
//   empty: { flex: 1, alignItems: 'center', paddingTop: 100 },
//   emptyEmoji: { fontSize: 64, marginBottom: 16 },
//   emptyText: { fontSize: 16, color: '#888', marginBottom: 24 },
//   bookBtn: {
//     backgroundColor: '#F5A623', paddingVertical: 14,
//     paddingHorizontal: 28, borderRadius: 14,
//   },
//   bookBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
//   rideCard: {
//     backgroundColor: '#fff', margin: 12, marginBottom: 4,
//     borderRadius: 16, padding: 16,
//     borderWidth: 1, borderColor: '#eee',
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
//   },
//   rideTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   vehicleEmoji: { fontSize: 32, marginRight: 10 },
//   rideTopInfo: { flex: 1 },
//   vehicleType: { fontSize: 14, fontWeight: '800', color: '#1a1a2e' },
//   rideDate: { fontSize: 11, color: '#aaa', marginTop: 2 },
//   statusBadge: {
//     paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
//   },
//   statusText: { fontSize: 11, fontWeight: '700' },
//   routeContainer: {
//     backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, marginBottom: 12,
//   },
//   routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
//   dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
//   routeLine: { width: 1, height: 12, backgroundColor: '#ddd', marginLeft: 3, marginVertical: 2 },
//   routeText: { flex: 1, fontSize: 13, color: '#444', fontWeight: '500' },
//   rideBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   rideDistance: { fontSize: 13, color: '#888' },
//   rideFare: { fontSize: 20, fontWeight: '900', color: '#F5A623' },
//   resumeBtn: {
//     marginTop: 12, backgroundColor: '#F5A623',
//     borderRadius: 10, padding: 10, alignItems: 'center',
//   },
//   resumeBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
// });

import { API_BASE_URL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STATUS_COLOR: any = {
  scheduled: "#9b59b6",
  searching: "#3498db",
  accepted: "#F5A623",
  arrived: "#e67e22",
  started: "#27ae60",
  completed: "#27ae60",
  cancelled: "#e74c3c",
};

const STATUS_LABEL: any = {
  scheduled: "📅 Scheduled",
  searching: "🔍 Driver Dhundh Raha",
  accepted: "✅ Driver Mila",
  arrived: "📍 Driver Pahuncha",
  started: "🚗 Chal Raha",
  completed: "✅ Complete",
  cancelled: "❌ Cancel",
};

const VEMOJI: any = {
  bike: "🏍️",
  auto: "🛺",
  car: "🚗",
  tractor: "🚜",
  jcb: "🚧",
  tempo: "🚐",
  truck: "🚛",
};

export default function RidesScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/ride/history/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data?.data || []);
    } catch (e) {
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  const cancelScheduled = async (rideId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/ride/cancel`,
        { rideId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchRides();
    } catch (e) {}
  };

  const filtered = rides.filter((r) => {
    if (filter === "all") return true;
    if (filter === "scheduled")
      return r.bookingType === "scheduled" && r.status === "scheduled";
    if (filter === "completed") return r.status === "completed";
    if (filter === "cancelled") return r.status === "cancelled";
    return true;
  });

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meri Rides</Text>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {[
            { key: "all", label: "Sab" },
            { key: "scheduled", label: "📅 Scheduled" },
            { key: "completed", label: "✅ Complete" },
            { key: "cancelled", label: "❌ Cancel" },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                filter === f.key && styles.filterActive,
              ]}
              onPress={() => setFilter(f.key as any)}
            >
              <Text
                style={[
                  styles.filterTxt,
                  filter === f.key && styles.filterTxtActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefresh(true);
              fetchRides();
            }}
            colors={["#F5A623"]}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🚗</Text>
            <Text style={styles.emptyTxt}>Koi ride nahi mili</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Top row */}
            <View style={styles.cardTop}>
              <Text style={styles.vehicleEmoji}>
                {VEMOJI[item.vehicleType] || "🚗"}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleType}>
                  {item.vehicleType?.toUpperCase()}
                </Text>
                <Text style={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleDateString("hi-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_COLOR[item.status] + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    { color: STATUS_COLOR[item.status] },
                  ]}
                >
                  {STATUS_LABEL[item.status] || item.status}
                </Text>
              </View>
            </View>

            {/* Scheduled badge */}
            {item.bookingType === "scheduled" && item.scheduledAt && (
              <View style={styles.scheduledBadge}>
                <Text style={styles.scheduledTxt}>
                  📅{" "}
                  {new Date(item.scheduledAt).toLocaleString("hi-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  baje ke liye scheduled
                </Text>
              </View>
            )}

            {/* Route */}
            <View style={styles.route}>
              <View style={styles.routeRow}>
                <View style={[styles.dot, { backgroundColor: "#27ae60" }]} />
                <Text style={styles.routeTxt} numberOfLines={1}>
                  {item.pickup?.address || "—"}
                </Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <View style={[styles.dot, { backgroundColor: "#e74c3c" }]} />
                <Text style={styles.routeTxt} numberOfLines={1}>
                  {item.drop?.address || "—"}
                </Text>
              </View>
            </View>

            {/* Fare */}
            <View style={styles.cardBottom}>
              <Text style={styles.fare}>₹{item.fare || 0}</Text>
              <Text style={styles.dist}>{item.distance?.toFixed(1)} km</Text>
              {item.status === "scheduled" && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => cancelScheduled(item._id)}
                >
                  <Text style={styles.cancelTxt}>Cancel Karo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#1a3a5c",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row", gap: 8 },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  filterActive: { backgroundColor: "#F5A623" },
  filterTxt: { fontSize: 12, color: "#adc6e0", fontWeight: "700" },
  filterTxtActive: { color: "#fff" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTxt: { fontSize: 16, color: "#aaa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  vehicleEmoji: { fontSize: 28, marginRight: 10 },
  vehicleType: { fontSize: 14, fontWeight: "800", color: "#1a1a2e" },
  cardDate: { fontSize: 11, color: "#aaa", marginTop: 2 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt: { fontSize: 11, fontWeight: "700" },
  scheduledBadge: {
    backgroundColor: "#f0ebff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  scheduledTxt: { fontSize: 12, color: "#9b59b6", fontWeight: "700" },
  route: { marginBottom: 10 },
  routeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 3 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  routeTxt: { flex: 1, fontSize: 13, color: "#444", fontWeight: "500" },
  routeLine: {
    width: 1,
    height: 12,
    backgroundColor: "#eee",
    marginLeft: 3,
    marginVertical: 1,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  fare: { fontSize: 20, fontWeight: "900", color: "#F5A623", marginRight: 12 },
  dist: { fontSize: 13, color: "#888", flex: 1 },
  cancelBtn: {
    backgroundColor: "#fef0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  cancelTxt: { fontSize: 12, color: "#e74c3c", fontWeight: "700" },
});
