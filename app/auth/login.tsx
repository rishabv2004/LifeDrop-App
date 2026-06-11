import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); 

  const handleAuthAction = () => {
    // Ab login hone ke baad pehle Permission page par jayega
    router.replace('/permissions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Logo Area - YAHAN APNI IMAGE CHANGE KAR LENA */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image 
                source={require('../../assets/images/blood_login.png')} // <-- Bhai, yahan apni nayi image ka path daal dena
                style={styles.heartLogo} 
              />
            </View>
            <Text style={styles.brandText}>LifeDrop</Text>
          </View>

          {/* Dynamic Header */}
          <View style={styles.welcomeHeader}>
            <Text style={styles.mainTitle}>{isSignUp ? 'Create an account' : 'Welcome back'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Join our community and start saving lives today.' : 'Enter your details to access your account.'}
            </Text>
          </View>

          {/* Modern Form Inputs */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A1A1AA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Solid Premium Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleAuthAction} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
            </TouchableOpacity>
          </View>

          {/* Clean Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Outline Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleAuthAction} activeOpacity={0.7}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>

          {/* Bottom Action Toggle */}
          <View style={styles.bottomToggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.toggleActionText}>{isSignUp ? 'Log In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(230, 57, 70, 0.08)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heartLogo: {
    width: 45,
    height: 60,
    resizeMode: 'contain',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E63946',
    letterSpacing: -0.5,
  },
  welcomeHeader: {
    width: '100%',
    marginBottom: 35,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#09090B',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#09090B',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#F4F4F5',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#09090B',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#E63946',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#E63946',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F4F4F5',
  },
  dividerText: {
    color: '#A1A1AA',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F4F4F5',
    paddingVertical: 16,
    borderRadius: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleText: {
    color: '#09090B',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomToggleContainer: {
    flexDirection: 'row',
    marginTop: 35,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    color: '#71717A',
  },
  toggleActionText: {
    color: '#E63946',
    fontSize: 15,
    fontWeight: 'bold',
  }
});