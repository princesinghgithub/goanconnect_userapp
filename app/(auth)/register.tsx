// // app/(auth)/register.tsx — Naya user register karo

// import { API_BASE_URL } from '@/constants/config';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import {
//     ActivityIndicator, Alert,
//     KeyboardAvoidingView, Platform,
//     ScrollView,
//     StyleSheet,
//     Text, TextInput, TouchableOpacity,
//     View,
// } from 'react-native';

// export default function RegisterScreen() {
//   const [form, setForm] = useState({ name: '', phone: '', email: '', city: '' });
//   const [loading, setLoading] = useState(false);

//   const isValid = form.name.length > 2 && form.phone.length === 10 && form.email.includes('@');

//   const handleRegister = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/auth/register`, { ...form, role: 'customer' });
//       console.log('Register response:', res.data);

//       if (res.data.otp) {
//         Alert.alert('Registered! 🎉', `Dev OTP: ${res.data.otp}`,
//           [{ text: 'OTP Verify Karo', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email: form.email } }) }]);
//       } else {
//         Alert.alert('Registered! 🎉', 'Email check karo OTP ke liye',
//           [{ text: 'OK', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email: form.email } }) }]);
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error?.response?.data?.message || 'Registration fail hua');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { key: 'name', placeholder: 'Aapka Naam', icon: '👤', keyboard: 'default' },
//     { key: 'phone', placeholder: '10-digit Mobile Number', icon: '📱', keyboard: 'phone-pad' },
//     { key: 'email', placeholder: 'Email Address', icon: '📧', keyboard: 'email-address' },
//     { key: 'city', placeholder: 'Aapka Shehar / Gaon', icon: '📍', keyboard: 'default' },
//   ] as const;

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar style="light" />
//       <View style={styles.bgTop} />
//       <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//         <Text style={styles.backText}>← Wapas</Text>
//       </TouchableOpacity>
//       <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
//         <View style={styles.logoContainer}>
//           <View style={styles.logoCircle}><Text style={styles.logoText}>GC</Text></View>
//           <Text style={styles.appName}>Goan Connect</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.title}>Account Banao 🙏</Text>
//           <Text style={styles.subtitle}>Ek baar register karo, phir OTP se login karo</Text>
//           {fields.map(field => (
//             <View key={field.key} style={styles.inputContainer}>
//               <Text style={styles.inputIcon}>{field.icon}</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder={field.placeholder}
//                 placeholderTextColor="#aaa"
//                 keyboardType={field.keyboard as any}
//                 autoCapitalize={field.key === 'email' ? 'none' : 'words'}
//                 maxLength={field.key === 'phone' ? 10 : undefined}
//                 value={form[field.key]}
//                 onChangeText={val => setForm(prev => ({ ...prev, [field.key]: val }))}
//               />
//             </View>
//           ))}
//           <TouchableOpacity
//             style={[styles.button, !isValid && styles.buttonDisabled]}
//             onPress={handleRegister}
//             disabled={!isValid || loading}
//           >
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Karo →</Text>}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
//             <Text style={styles.loginText}>Already account hai? <Text style={styles.loginHighlight}>Login Karo</Text></Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f1b2d' },
//   bgTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '35%', backgroundColor: '#1a3a5c', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
//   backBtn: { position: 'absolute', top: 55, left: 24, zIndex: 10 },
//   backText: { color: '#a0bcd6', fontSize: 16, fontWeight: '600' },
//   scroll: { paddingBottom: 40 },
//   logoContainer: { alignItems: 'center', paddingTop: 70, paddingBottom: 20 },
//   logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 8 },
//   logoText: { fontSize: 22, fontWeight: '900', color: '#fff' },
//   appName: { fontSize: 22, fontWeight: '800', color: '#fff' },
//   card: { margin: 20, backgroundColor: '#fff', borderRadius: 24, padding: 28, elevation: 10 },
//   title: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 6 },
//   subtitle: { fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 18 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#f8f9fa' },
//   inputIcon: { fontSize: 18, marginRight: 10 },
//   input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#1a1a2e' },
//   button: { backgroundColor: '#F5A623', borderRadius: 14, paddingVertical: 16, alignItems: 'center', elevation: 6, marginTop: 8 },
//   buttonDisabled: { backgroundColor: '#ccc', elevation: 0 },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
//   loginLink: { marginTop: 16, alignItems: 'center' },
//   loginText: { fontSize: 13, color: '#888' },
//   loginHighlight: { color: '#1a3a5c', fontWeight: '700' },
// });


// app/(auth)/register.tsx
import { API_BASE_URL } from '@/constants/config';
import axios from 'axios';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

const CITIES = ['Rewa', 'Mauganj', 'Hanumana', 'Sirmour', 'Teonthar', 'Mangawan', 'Naigarhi', 'Jawa'];

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.name.trim())  { Alert.alert('Error', 'Naam daalo'); return false; }
    if (!form.email.trim() || !form.email.includes('@')) {
      Alert.alert('Error', 'Sahi email daalo'); return false;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      Alert.alert('Error', '10 digit phone number daalo'); return false;
    }
    if (!form.city.trim()) { Alert.alert('Error', 'City chuniye'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name:  form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city:  form.city,
      });

      if (res.data?.success) {
        Alert.alert(
          'Registration Successful! 🎉',
          'Ab login karo OTP se',
          [{ text: 'Login Karo', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Registration fail ho gayi';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>👤</Text>
        <Text style={styles.title}>Naya Account Banao</Text>
        <Text style={styles.subtitle}>GaonConnect pe swagat hai!</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>👤 Poora Naam</Text>
          <TextInput
            style={styles.input}
            placeholder="Aapka naam"
            placeholderTextColor="#bbb"
            value={form.name}
            onChangeText={v => updateForm('name', v)}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📧 Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="aapka@email.com"
            placeholderTextColor="#bbb"
            value={form.email}
            onChangeText={v => updateForm('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📱 Mobile Number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="9876543210"
              placeholderTextColor="#bbb"
              value={form.phone}
              onChangeText={v => updateForm('phone', v.replace(/[^0-9]/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🏙️ Aapka Sheher</Text>
          <TouchableOpacity
            style={styles.citySelector}
            onPress={() => setShowCities(!showCities)}
          >
            <Text style={[styles.citySelectorText, !form.city && { color: '#bbb' }]}>
              {form.city || 'Sheher chuniye...'}
            </Text>
            <Text style={styles.citySelectorArrow}>{showCities ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showCities && (
            <View style={styles.cityDropdown}>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[styles.cityOption, form.city === city && styles.cityOptionActive]}
                  onPress={() => { updateForm('city', city); setShowCities(false); }}
                >
                  <Text style={[styles.cityOptionText, form.city === city && styles.cityOptionTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Register Karo 🚀</Text>
          }
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Pehle se account hai? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Login Karo →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  header: {
    paddingTop: 60, paddingBottom: 24,
    alignItems: 'center', paddingHorizontal: 24,
  },
  logo: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#adc6e0' },
  form: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 28,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#f5f5f5', borderRadius: 14, padding: 14,
    fontSize: 15, color: '#1a1a2e',
    borderWidth: 1.5, borderColor: '#eee', flex: 1,
  },
  phoneRow: { flexDirection: 'row', gap: 10 },
  countryCode: {
    backgroundColor: '#f5f5f5', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#eee', justifyContent: 'center',
  },
  countryCodeText: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  phoneInput: { flex: 1 },
  citySelector: {
    backgroundColor: '#f5f5f5', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#eee',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  citySelectorText: { fontSize: 15, color: '#1a1a2e', fontWeight: '500' },
  citySelectorArrow: { fontSize: 12, color: '#888' },
  cityDropdown: {
    backgroundColor: '#fff', borderRadius: 14, marginTop: 4,
    borderWidth: 1.5, borderColor: '#eee', overflow: 'hidden',
    elevation: 4,
  },
  cityOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  cityOptionActive: { backgroundColor: '#fff8ee' },
  cityOptionText: { fontSize: 15, color: '#1a1a2e' },
  cityOptionTextActive: { color: '#F5A623', fontWeight: '800' },
  btn: {
    backgroundColor: '#F5A623', borderRadius: 16,
    padding: 16, alignItems: 'center', marginTop: 8,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0, elevation: 0 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: '#888' },
  loginLink: { fontSize: 14, fontWeight: '800', color: '#F5A623' },
});
