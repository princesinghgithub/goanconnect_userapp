// app/(auth)/otp.tsx
import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) inputs.current[index + 1]?.focus();
    // Auto submit when all filled
    if (value && index === 5) {
      const fullOtp = [...newOtp].join('');
      if (fullOtp.length === 6) verifyOtp(fullOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpValue?: string) => {
    const finalOtp = otpValue || otp.join('');
    if (finalOtp.length !== 6) {
      Alert.alert('OTP Daalo', '6 digit OTP enter karo');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp: finalOtp,
      });

      if (res.data?.success) {
        const { token, user } = res.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'OTP galat hai';
      Alert.alert('Error', msg);
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
      setResendTimer(30);
      if (res.data?.otp) {
        Alert.alert('New OTP', `Aapka naya OTP: ${res.data.otp}`);
      } else {
        Alert.alert('OTP Bheja!', 'Naya OTP bheja gaya');
      }
    } catch (e) {
      Alert.alert('Error', 'OTP nahi bheja ja saka');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.logo}>📲</Text>
        <Text style={styles.title}>OTP Verify Karo</Text>
        <Text style={styles.subtitle}>
          {email} pe 6 digit OTP bheja gaya hai
        </Text>
      </View>

      <View style={styles.form}>
        {/* OTP Inputs */}
      <View style={styles.otpRow}>
  {otp.map((digit, index) => (
    <TextInput
      key={index}
      ref={(ref) => {
        inputs.current[index] = ref;
      }}
      style={[styles.otpInput, digit && styles.otpInputFilled]}
      value={digit}
      onChangeText={(val) => handleOtpChange(val.slice(-1), index)}
      onKeyPress={(e) => handleKeyPress(e, index)}
      keyboardType="number-pad"
      maxLength={1}
      textAlign="center"
      autoFocus={index === 0}
    />
  ))}
</View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={() => verifyOtp()}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Verify Karo ✅</Text>
          }
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity
          style={styles.resendBtn}
          onPress={handleResend}
          disabled={resendTimer > 0}
        >
          <Text style={[styles.resendText, resendTimer > 0 && styles.resendDisabled]}>
            {resendTimer > 0
              ? `OTP Resend karo (${resendTimer}s)`
              : 'OTP Dobara Bhejo 🔄'
            }
          </Text>
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Email Badlo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  header: {
    flex: 0.35, justifyContent: 'center', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 24,
  },
  logo: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#adc6e0', textAlign: 'center' },
  form: {
    flex: 0.65, backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 28, paddingTop: 36,
  },
  otpRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48, height: 56, borderRadius: 14,
    borderWidth: 2, borderColor: '#eee',
    fontSize: 24, fontWeight: '800', color: '#1a1a2e',
    backgroundColor: '#f5f5f5',
  },
  otpInputFilled: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
  btn: {
    backgroundColor: '#F5A623', borderRadius: 16,
    padding: 16, alignItems: 'center',
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
    marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0, elevation: 0 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  resendBtn: { alignItems: 'center', padding: 12 },
  resendText: { fontSize: 14, fontWeight: '700', color: '#F5A623' },
  resendDisabled: { color: '#aaa' },
  backBtn: { alignItems: 'center', padding: 12 },
  backText: { fontSize: 14, color: '#888' },
});
