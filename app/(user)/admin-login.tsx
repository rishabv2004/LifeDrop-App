import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLoginScreen() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');

  const handleLogin = () => {
    // 🛡️ SECRET ADMIN PASSCODE: LAKSHYA
    if (passcode === 'LAKSHYA') {
      router.replace('/(user)/admin-dashboard');
    } else {
      Alert.alert('Access Denied', 'Incorrect Admin Passcode. Only authorized school staff can access this panel.');
      setPasscode('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-half" size={50} color="#09090B" />
        </View>
        <Text style={styles.title}>Admin Portal</Text>
        <Text style={styles.subtitle}>Restricted Access. Enter the master passcode to manage donors and SOS alerts.</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Enter Master Passcode" 
          placeholderTextColor="#A1A1AA"
          secureTextEntry
          autoCapitalize="characters"
          value={passcode}
          onChangeText={setPasscode}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 15 },
  backBtn: { padding: 5, width: 40 },
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F4F4F5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#09090B', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#71717A', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20, lineHeight: 20 },
  input: { width: '100%', backgroundColor: '#F4F4F5', borderRadius: 16, padding: 18, fontSize: 16, color: '#09090B', borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 20, textAlign: 'center', fontWeight: 'bold', letterSpacing: 2 },
  loginBtn: { width: '100%', backgroundColor: '#09090B', padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }
});