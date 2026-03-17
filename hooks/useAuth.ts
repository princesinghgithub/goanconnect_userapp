import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export function useAuth() {
  const [user, setUser]       = useState<any>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const t = await AsyncStorage.getItem('token');
    const u = await AsyncStorage.getItem('user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user', 'pickup', 'drop']);
    setUser(null); setToken(null);
    router.replace('/(auth)/login');
  };

  return { user, token, loading, logout };
}
