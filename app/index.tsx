// app/index.tsx — Auto login check
import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // Token nahi hai — login pe jao
        router.replace('/(auth)/login');
        return;
      }

      // Token verify karo backend se
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (res.data?.success) {
        // Token valid — home pe jao
        router.replace('/(tabs)/home');
      } else {
        // Token invalid — clear karo aur login pe jao
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
      }
    } catch (e) {
      // Network error ya token expire — login pe jao
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Token hai but network nahi — home pe jao (offline mode)
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Splash Screen */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🚗</Text>
        <Text style={styles.logoText}>GaonConnect</Text>
        <Text style={styles.logoSub}>Apna Gaon, Apni Sawari</Text>
      </View>
      <ActivityIndicator size="large" color="#F5A623" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1a3a5c',
    justifyContent: 'center', alignItems: 'center',
  },
  logoContainer: { alignItems: 'center', marginBottom: 60 },
  logoEmoji: { fontSize: 80, marginBottom: 16 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  logoSub: { fontSize: 16, color: '#adc6e0', marginTop: 8 },
  loader: { position: 'absolute', bottom: 80 },
});
