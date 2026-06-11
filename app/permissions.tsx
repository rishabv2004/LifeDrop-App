import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function PermissionsScreen() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const requestPermissions = async () => {
    setIsLocating(true);
    
    // Asli phone ka GPS trigger karna
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied. App needs it to find nearby donors.');
      setIsLocating(false);
      return;
    }

    try {
      // User ke coordinates nikalna (future calculation ke liye)
      let location = await Location.getCurrentPositionAsync({});
      console.log("Got User Coordinates:", location.coords);
      
      // Location milne ke baad automatically Dashboard par le jana
      router.replace('/(user)/dashboard');
    } catch (error) {
      setErrorMsg('Make sure your device GPS is turned ON.');
    }
    
    setIsLocating(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.container}>
        
        {/* Visual Graphic (Placeholder for map/radar icon) */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📍</Text>
        </View>

        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.subtitle}>
          LifeDrop needs your location to instantly show you active blood donors within a 10-20km radius of your area.
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={requestPermissions}
          disabled={isLocating}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isLocating ? 'Locating...' : 'Allow Location Access'}
          </Text>
        </TouchableOpacity>

        {/* Option to skip (less ideal, but good for testing) */}
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => router.replace('/(user)/dashboard')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(230, 57, 70, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#09090B',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  errorText: {
    marginTop: 20,
    color: '#E63946',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#E63946',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: '#A1A1AA',
    fontSize: 15,
    fontWeight: '600',
  }
});