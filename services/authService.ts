import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  sendOTP: (phone: string) =>
    api.post('/auth/send-otp', { phone: `+91${phone}` }),

  verifyOTP: async (phone: string, otp: string) => {
    const res = await api.post('/auth/verify-otp', { phone: `+91${phone}`, otp });
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },
};
