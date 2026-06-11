import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={50} color="#10B981" />
        </View>
        <Text style={styles.title}>Your Data is Secure</Text>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>

        <View style={styles.policyCard}>
          <View style={styles.policyRow}>
            <Ionicons name="location" size={20} color="#E63946" />
            <Text style={styles.policyHeading}>1. Location Data (GPS)</Text>
          </View>
          <Text style={styles.policyText}>
            LifeDrop requires high-accuracy GPS permissions strictly to calculate the distance between a patient and nearby donors. We do not track your location in the background. Location is only fetched when you open the dashboard or click the refresh button.
          </Text>
        </View>

        <View style={styles.policyCard}>
          <View style={styles.policyRow}>
            <Ionicons name="call" size={20} color="#E63946" />
            <Text style={styles.policyHeading}>2. Contact Information</Text>
          </View>
          <Text style={styles.policyText}>
            Your mobile number is visible to other registered users solely for the purpose of emergency blood donation coordination. LifeDrop and Lakshya Public School do not sell or share this data with any third-party marketing agencies.
          </Text>
        </View>

        <View style={styles.policyCard}>
          <View style={styles.policyRow}>
            <Ionicons name="server" size={20} color="#E63946" />
            <Text style={styles.policyHeading}>3. Data Deletion</Text>
          </View>
          <Text style={styles.policyText}>
            If you wish to remove your donor profile from our database, you can contact the administration. Our automated systems and admins continually monitor and remove inactive or fake accounts to ensure system integrity.
          </Text>
        </View>

        <Text style={styles.footerText}>
          By using LifeDrop, you agree to these terms designed for community welfare.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  container: { padding: 20, paddingBottom: 40 },
  iconContainer: { alignItems: 'center', marginTop: 10, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: '800', color: '#09090B', textAlign: 'center' },
  lastUpdated: { fontSize: 13, color: '#A1A1AA', textAlign: 'center', marginBottom: 25, fontWeight: '600' },
  policyCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E4E4E7' },
  policyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  policyHeading: { fontSize: 16, fontWeight: '700', color: '#09090B', marginLeft: 8 },
  policyText: { fontSize: 14, color: '#71717A', lineHeight: 22 },
  footerText: { textAlign: 'center', fontSize: 13, color: '#A1A1AA', marginTop: 20, fontStyle: 'italic', paddingHorizontal: 10 }
});