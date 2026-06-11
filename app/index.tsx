import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useThemeColors } from './hooks/useThemeColor';
export default function LoginScreen() {
  const { background, text, inputBg } = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. LOGIN LOGIC
  const handleLogin = async () => {
    const cleanEmail = email.trim(); 
    if (!cleanEmail || !password) {
      Alert.alert('Error', 'Please enter both email and password!');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      setLoading(false);
      router.replace('/(user)/dashboard');
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid Email or Password. Please try again!');
    }
  };

  // 2. FORGOT PASSWORD LOGIC
  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert("Input Required", "Please enter your email address above to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      Alert.alert("Check Email", "Password reset link has been sent to your email address.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
   <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🩸</Text>
          </View>
          <Text style={styles.appName}>LifeDrop</Text>
          <Text style={styles.tagline}>Every drop counts. Save a life today.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: inputBg, color: text }]}
              placeholder="e.g. user@example.com" 
              placeholderTextColor="#A1A1AA"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password" 
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {/* FORGOT PASSWORD BUTTON */}
          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginBtnText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.createAccountBtn} 
            onPress={() => router.push('/signup')}
            disabled={loading}
          >
            <Text style={styles.createAccountBtnText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50, marginTop: -40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  iconText: { fontSize: 40 },
  appName: { fontSize: 32, fontWeight: '800', color: '#E63946', marginBottom: 8, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: '#71717A', fontWeight: '500' },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#09090B', marginBottom: 8 },
  input: { backgroundColor: '#F4F4F5', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, color: '#09090B', borderWidth: 1, borderColor: '#E4E4E7' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#E63946', fontSize: 14, fontWeight: '600' },
  loginBtn: { backgroundColor: '#E63946', paddingVertical: 18, borderRadius: 14, alignItems: 'center', shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginBtnDisabled: { backgroundColor: '#FCA5A5', shadowOpacity: 0 },
  loginBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  createAccountBtn: { marginTop: 15, backgroundColor: '#FFFFFF', paddingVertical: 18, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#E63946' },
  createAccountBtnText: { color: '#E63946', fontSize: 16, fontWeight: 'bold' }
});