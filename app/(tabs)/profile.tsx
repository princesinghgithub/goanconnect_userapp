// // app/(tabs)/profile.tsx
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//     Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
// } from 'react-native';

// export default function ProfileScreen() {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     const data = await AsyncStorage.getItem('user');
//     if (data) setUser(JSON.parse(data));
//   };

//   const handleLogout = async () => {
//     Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
//       { text: 'Nahi', style: 'cancel' },
//       {
//         text: 'Haan', style: 'destructive',
//         onPress: async () => {
//           await AsyncStorage.clear(); // ✅ Sab kuch clear
//           router.replace('/(auth)/login');
//         },
//       },
//     ]);
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>
//             {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//           </Text>
//         </View>
//         <Text style={styles.name}>{user?.name || 'User'}</Text>
//         <Text style={styles.email}>{user?.email || ''}</Text>
//         <Text style={styles.phone}>{user?.phone || ''}</Text>
//       </View>

//       {/* Menu Items */}
//       <View style={styles.section}>
//         <TouchableOpacity style={styles.menuItem}
//           onPress={() => router.push('/(booking)/rides' as any)}>
//           <Text style={styles.menuEmoji}>🚗</Text>
//           <Text style={styles.menuText}>Meri Rides</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Text style={styles.menuEmoji}>💳</Text>
//           <Text style={styles.menuText}>Payment Methods</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Text style={styles.menuEmoji}>🔔</Text>
//           <Text style={styles.menuText}>Notifications</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Text style={styles.menuEmoji}>❓</Text>
//           <Text style={styles.menuText}>Help & Support</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Logout */}
//       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//         <Text style={styles.logoutText}>🚪 Logout</Text>
//       </TouchableOpacity>

//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   header: {
//     backgroundColor: '#1a3a5c', padding: 32,
//     alignItems: 'center', paddingTop: 60,
//   },
//   avatar: {
//     width: 80, height: 80, borderRadius: 40,
//     backgroundColor: '#F5A623', justifyContent: 'center',
//     alignItems: 'center', marginBottom: 12,
//   },
//   avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
//   name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
//   email: { fontSize: 14, color: '#adc6e0', marginBottom: 2 },
//   phone: { fontSize: 14, color: '#adc6e0' },
//   section: {
//     backgroundColor: '#fff', margin: 16,
//     borderRadius: 16, overflow: 'hidden',
//     borderWidth: 1, borderColor: '#eee',
//   },
//   menuItem: {
//     flexDirection: 'row', alignItems: 'center',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   menuEmoji: { fontSize: 20, marginRight: 14 },
//   menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
//   menuArrow: { fontSize: 20, color: '#aaa' },
//   logoutBtn: {
//     margin: 16, backgroundColor: '#fff', borderRadius: 16,
//     padding: 16, alignItems: 'center',
//     borderWidth: 2, borderColor: '#e74c3c',
//   },
//   logoutText: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
// });


// app/(tabs)/profile.tsx
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert, ScrollView, StyleSheet, Text,
    TouchableOpacity, View,
} from 'react-native';

export default function ProfileScreen() {
  const [user, setUser]         = useState<any>(null);
  const [stats, setStats]       = useState({ rides: 0, cancelled: 0, spent: 0 });

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) setUser(JSON.parse(data));

    // Fetch ride stats
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/ride/history/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rides = res.data?.data || [];
      const completed  = rides.filter((r: any) => r.status === 'completed');
      const cancelled  = rides.filter((r: any) => r.status === 'cancelled');
      const totalSpent = completed.reduce((sum: number, r: any) => sum + (r.fare || 0), 0);
      setStats({ rides: completed.length, cancelled: cancelled.length, spent: totalSpent });
    } catch (e) {}
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Nahi', style: 'cancel' },
      {
        text: 'Haan', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const MENU_ITEMS = [
    { icon: 'car-outline',      label: 'Meri Rides',        onPress: () => router.push('/(tabs)/rides') },
    { icon: 'wallet-outline',   label: 'Wallet & Payments', onPress: () => {} },
    { icon: 'star-outline',     label: 'Ratings & Reviews', onPress: () => {} },
    { icon: 'shield-outline',   label: 'Privacy & Safety',  onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'About App', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.contact}>{user?.email || user?.phone || ''}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.rides}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{stats.spent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
            onPress={item.onPress}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon as any} size={20} color="#1a3a5c" />
            </View>
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <Text style={styles.version}>GaonConnect v1.0.0</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#1a3a5c', paddingTop: 60,
    paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F5A623', justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
    borderWidth: 3, borderColor: '#fff',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  contact: { fontSize: 14, color: '#adc6e0', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, padding: 16, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#F5A623' },
  statLabel: { fontSize: 11, color: '#adc6e0', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#eee', overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  menuIconContainer: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#eef2f7', justifyContent: 'center',
    alignItems: 'center', marginRight: 14,
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  version: { textAlign: 'center', color: '#ccc', fontSize: 12, marginBottom: 12 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 16, marginTop: 4, backgroundColor: '#fff',
    borderRadius: 16, padding: 16, gap: 8,
    borderWidth: 2, borderColor: '#e74c3c',
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
});
