// // app/(auth)/login.tsx
// import { API_BASE_URL } from '@/constants/config';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from 'react-native';

// export default function LoginScreen() {
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendOTP = async () => {
//     if (phone.length !== 10) {
//       Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.post(`${API_BASE_URL}/auth/send-otp`, { phone: `+91${phone}` });
//       router.push({ pathname: '/(auth)/otp', params: { phone } });
//     } catch (error: any) {
//       Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar style="light" />

//       {/* Background Gradient Layer */}
//       <View style={styles.bgTop} />

//       <View style={styles.logoContainer}>
//         {/* Replace with your actual logo */}
//         <View style={styles.logoCircle}>
//           <Text style={styles.logoText}>GC</Text>
//         </View>
//         <Text style={styles.appName}>Goan Connect</Text>
//         <Text style={styles.tagline}>Apne gaon ki sawari</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.title}>Welcome! 🙏</Text>
//         <Text style={styles.subtitle}>Apna mobile number daalo</Text>

//         <View style={styles.inputContainer}>
//           <View style={styles.countryCode}>
//             <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
//           </View>
//           <TextInput
//             style={styles.input}
//             placeholder="10-digit mobile number"
//             placeholderTextColor="#aaa"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={phone}
//             onChangeText={setPhone}
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.button, phone.length !== 10 && styles.buttonDisabled]}
//           onPress={handleSendOTP}
//           disabled={phone.length !== 10 || loading}
//           activeOpacity={0.85}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>OTP Bhejo →</Text>
//           )}
//         </TouchableOpacity>

//         <Text style={styles.terms}>
//           Login karke aap hamare{' '}
//           <Text style={styles.link}>Terms & Conditions</Text> se agree karte hain
//         </Text>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f1b2d',
//   },
//   bgTop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: '45%',
//     backgroundColor: '#1a3a5c',
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     paddingTop: 80,
//     paddingBottom: 30,
//   },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#F5A623',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//     shadowColor: '#F5A623',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   logoText: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: '#fff',
//   },
//   appName: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: '#fff',
//     letterSpacing: 1,
//   },
//   tagline: {
//     fontSize: 14,
//     color: '#a0bcd6',
//     marginTop: 4,
//   },
//   card: {
//     margin: 20,
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     padding: 28,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#1a1a2e',
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     borderWidth: 1.5,
//     borderColor: '#e0e0e0',
//     borderRadius: 14,
//     overflow: 'hidden',
//     marginBottom: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   countryCode: {
//     paddingHorizontal: 14,
//     justifyContent: 'center',
//     backgroundColor: '#eef2f7',
//     borderRightWidth: 1,
//     borderRightColor: '#e0e0e0',
//   },
//   countryCodeText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
//   input: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: '#1a1a2e',
//     letterSpacing: 1,
//   },
//   button: {
//     backgroundColor: '#F5A623',
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: 'center',
//     shadowColor: '#F5A623',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '800',
//     letterSpacing: 0.5,
//   },
//   terms: {
//     marginTop: 16,
//     fontSize: 11,
//     color: '#999',
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   link: {
//     color: '#1a3a5c',
//     fontWeight: '600',
//   },
// });





// app/(auth)/login.tsx
// Email se OTP bhejo — development ke liye

// import { API_BASE_URL } from '@/constants/config';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import {
//     ActivityIndicator, Alert,
//     KeyboardAvoidingView, Platform,
//     StyleSheet,
//     Text, TextInput, TouchableOpacity,
//     View,
// } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

//   const handleSendOTP = async () => {
//     if (!isValidEmail(email)) {
//       Alert.alert('Invalid Email', 'Sahi email address daalo');
//       return;
//     }
//     setLoading(true);
//     console.log('Sending OTP to:', email);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/auth/send-otp`,
//         { email },
//         { timeout: 10000 }
//       );
//       console.log('Response:', response.data);

//       if (response.data.otp) {
//         Alert.alert(
//           'Dev Mode OTP',
//           `Aapka OTP: ${response.data.otp}\n\n(Sirf development mein dikhta hai)`,
//           [{ text: 'OK', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email } }) }]
//         );
//       } else {
//         router.push({ pathname: '/(auth)/otp', params: { email } });
//       }
//     } catch (error: any) {
//       console.log('Error:', error?.code, error?.message);
//       if (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNREFUSED') {
//         Alert.alert('Server Connect Nahi Hua',
//           `URL: ${API_BASE_URL}\n\n1. Backend chal raha hai?\n2. IP sahi hai?\n3. Ek hi WiFi pe ho?`);
//       } else if (error?.response?.status === 404) {
//         Alert.alert('User Nahi Mila', 'Pehle register karo',
//           [{ text: 'Register', onPress: () => router.push('/(auth)/register') }, { text: 'Cancel' }]);
//       } else {
//         Alert.alert('Error', error?.response?.data?.message || error?.message || 'Kuch galat hua');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar style="light" />
//       <View style={styles.bgTop} />
//       <View style={styles.logoContainer}>
//         <View style={styles.logoCircle}><Text style={styles.logoText}>GC</Text></View>
//         <Text style={styles.appName}>Goan Connect</Text>
//         <Text style={styles.tagline}>Apne gaon ki sawari</Text>
//       </View>
//       <View style={styles.card}>
//         <Text style={styles.title}>Welcome! 🙏</Text>
//         <Text style={styles.subtitle}>Email daalo, OTP aayega</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputIcon}>📧</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="aapka@email.com"
//             placeholderTextColor="#aaa"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoCorrect={false}
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>
//         <View style={styles.devNote}>
//           <Text style={styles.devNoteText}>🛠️ Dev Mode: OTP backend terminal mein dikhega</Text>
//         </View>
//         <TouchableOpacity
//           style={[styles.button, !isValidEmail(email) && styles.buttonDisabled]}
//           onPress={handleSendOTP}
//           disabled={!isValidEmail(email) || loading}
//         >
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>OTP Bhejo →</Text>}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/(auth)/register')}>
//           <Text style={styles.registerText}>Naya account? <Text style={styles.registerHighlight}>Register Karo</Text></Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f1b2d' },
//   bgTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundColor: '#1a3a5c', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
//   logoContainer: { alignItems: 'center', paddingTop: 80, paddingBottom: 30 },
//   logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 8 },
//   logoText: { fontSize: 28, fontWeight: '900', color: '#fff' },
//   appName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 1 },
//   tagline: { fontSize: 14, color: '#a0bcd6', marginTop: 4 },
//   card: { margin: 20, backgroundColor: '#fff', borderRadius: 24, padding: 28, elevation: 10 },
//   title: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 6 },
//   subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#f8f9fa' },
//   inputIcon: { fontSize: 18, marginRight: 10 },
//   input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#1a1a2e' },
//   devNote: { backgroundColor: '#fff8ee', borderRadius: 10, padding: 10, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#F5A623' },
//   devNoteText: { fontSize: 11, color: '#b8860b', fontWeight: '600' },
//   button: { backgroundColor: '#F5A623', borderRadius: 14, paddingVertical: 16, alignItems: 'center', elevation: 6 },
//   buttonDisabled: { backgroundColor: '#ccc', elevation: 0 },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
//   registerLink: { marginTop: 16, alignItems: 'center' },
//   registerText: { fontSize: 13, color: '#888' },
//   registerHighlight: { color: '#1a3a5c', fontWeight: '700' },
// });


// app/(auth)/login.tsx
import { API_BASE_URL } from '@/constants/config';
import axios from 'axios';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Email Daalo', 'Apna email address enter karo');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Sahi email address daalo');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email: email.trim().toLowerCase() });

      if (res.data?.success) {
        // Dev mode mein OTP dikhao
        if (res.data?.otp) {
          Alert.alert('OTP (Dev Mode)', `Aapka OTP: ${res.data.otp}`, [
            { text: 'Copy & Proceed', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email } }) }
          ]);
        } else {
          Alert.alert('OTP Bheja!', `${email} pe OTP bheja gaya hai`);
          router.push({ pathname: '/(auth)/otp', params: { email } });
        }
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Network error. Backend chal raha hai?';
      if (msg.includes('not found') || msg.includes('register')) {
        Alert.alert(
          'Account Nahi Mila',
          'Pehle register karo',
          [
            { text: 'Register Karo', onPress: () => router.push('/(auth)/register') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Error', msg);
      }
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
        <Text style={styles.logo}>🚗</Text>
        <Text style={styles.appName}>GaonConnect</Text>
        <Text style={styles.tagline}>Apna Gaon, Apni Sawari</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Login Karo</Text>
        <Text style={styles.subtitle}>Apna email daalo — OTP aayega</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>📧 Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="aapka@email.com"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSendOtp}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSendOtp}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>OTP Bhejo 📲</Text>
          }
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Naya user? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Register Karo →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  header: {
    flex: 0.4, justifyContent: 'center', alignItems: 'center',
    paddingTop: 60,
  },
  logo: { fontSize: 64, marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff' },
  tagline: { fontSize: 14, color: '#adc6e0', marginTop: 6 },
  form: {
    flex: 0.6, backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 28, paddingTop: 32,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#1a1a2e', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 28 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#f5f5f5', borderRadius: 14, padding: 16,
    fontSize: 16, color: '#1a1a2e',
    borderWidth: 1.5, borderColor: '#eee',
  },
  btn: {
    backgroundColor: '#F5A623', borderRadius: 16,
    padding: 16, alignItems: 'center',
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0, elevation: 0 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 14, color: '#888' },
  registerLink: { fontSize: 14, fontWeight: '800', color: '#F5A623' },
});
