import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Auth Profile with Name
      await updateProfile(user, { displayName: name });

      // 3. Save User Details in Firestore Database
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: email,
        role: 'user', // Default role
        createdAt: serverTimestamp()
      });

      setLoading(false);
      alert('Account created successfully! 🩸');
      router.replace('/(user)/dashboard'); // Navigate to dashboard
    } catch (error: any) {
      setLoading(false);
      alert('Signup Failed: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Join LifeDrop</Text>
          <Text style={styles.subtitle}>Create an account to request blood or find nearby donors.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Rahul Sharma" 
              placeholderTextColor="#A1A1AA"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
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
              placeholder="Create a strong password" 
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.signupBtn, loading && styles.signupBtnDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signupBtnText}>Create Account</Text>}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 15 },
  backButton: { padding: 5, alignSelf: 'flex-start' },
  backIcon: { fontSize: 24, color: '#09090B', fontWeight: '600' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', marginTop: -40 },
  titleSection: { marginBottom: 40 },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#E63946', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#71717A', fontWeight: '500', lineHeight: 22 },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#09090B', marginBottom: 8 },
  input: { backgroundColor: '#F4F4F5', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, color: '#09090B', borderWidth: 1, borderColor: '#E4E4E7' },
  signupBtn: { backgroundColor: '#E63946', paddingVertical: 18, borderRadius: 14, alignItems: 'center', shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginTop: 10 },
  signupBtnDisabled: { backgroundColor: '#FCA5A5', shadowOpacity: 0 },
  signupBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});