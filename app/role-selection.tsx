import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join the Mission</Text>
        <Text style={styles.subtitle}>How would you like to continue today?</Text>
      </View>

      <View style={styles.cardsContainer}>
        
        {/* === Card 1: Continue as User === */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={() => router.push('/(user)/dashboard')}
        >
          <View style={styles.iconContainerDefault}>
            <Text style={styles.iconText}>🔍</Text>
          </View>
          <Text style={styles.cardTitle}>Continue as User</Text>
          <Text style={styles.cardDescription}>Find nearby blood donors and request blood for emergencies.</Text>
        </TouchableOpacity>

        {/* === Card 2: Register as Donor === */}
        <TouchableOpacity 
          style={[styles.card, styles.donorCard]} 
          activeOpacity={0.8}
          onPress={() => router.push('/(donor)/register')}
        >
          <View style={styles.iconContainerRed}>
            <Text style={styles.iconText}>🩸</Text>
          </View>
          <Text style={styles.cardTitle}>Register as Donor</Text>
          <Text style={styles.cardDescription}>Sign up to donate blood and save lives in your city.</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 20, // Adds space between the two cards
  },
  card: {
    backgroundColor: '#111111',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  donorCard: {
    borderColor: 'rgba(230, 57, 70, 0.3)', // Slight red border for donor card
    backgroundColor: 'rgba(230, 57, 70, 0.05)', // Very subtle red tint
  },
  iconContainerDefault: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainerRed: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
  }
});