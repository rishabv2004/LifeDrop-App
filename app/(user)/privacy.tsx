import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 Theme Manager Import Kiya

export default function PrivacyScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Colors nikal liye

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={50} color="#10B981" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Your Data is Secure</Text>
        <Text style={[styles.lastUpdated, { color: isDark ? '#A1A1AA' : '#A1A1AA' }]}>Last Updated: June 2026</Text>

        <View style={[styles.policyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.policyRow}>
            <Ionicons name="location" size={20} color="#E63946" />
            <Text style={[styles.policyHeading, { color: colors.text }]}>1. Location Data (GPS)</Text>
          </View>
          <Text style={[styles.policyText, { color: isDark ? '#A1A1AA' : '#71717A' }]}>
            LifeDrop requires high-accuracy GPS permissions strictly to calculate the distance between a patient and nearby donors. We do not track your location in the background. Location is only fetched when you open the dashboard or click the refresh button.
          </Text>
        </View>

        <View style={[styles.policyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.policyRow}>
            <Ionicons name="call" size={20} color="#E63946" />
            <Text style={[styles.policyHeading, { color: colors.text }]}>2. Contact Information</Text>
          </View>
          <Text style={[styles.policyText, { color: isDark ? '#A1A1AA' : '#71717A' }]}>
            Your mobile number is visible to other registered users solely for the purpose of emergency blood donation coordination. LifeDrop and Lakshya Public School do not sell or share this data with any third-party marketing agencies.
          </Text>
        </View>

        <View style={[styles.policyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.policyRow}>
            <Ionicons name="server" size={20} color="#E63946" />
            <Text style={[styles.policyHeading, { color: colors.text }]}>3. Data Deletion</Text>
          </View>
          <Text style={[styles.policyText, { color: isDark ? '#A1A1AA' : '#71717A' }]}>
            If you wish to remove your donor profile from our database, you can contact the administration. Our automated systems and admins continually monitor and remove inactive or fake accounts to ensure system integrity.
          </Text>
        </View>

        <Text style={[styles.footerText, { color: isDark ? '#71717A' : '#A1A1AA' }]}>
          By using LifeDrop, you agree to these terms designed for community welfare.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ⚠️ Styles waise hi hain, colors inline set ho gaye hain
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { padding: 20, paddingBottom: 40 },
  iconContainer: { alignItems: 'center', marginTop: 10, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  lastUpdated: { fontSize: 13, textAlign: 'center', marginBottom: 25, fontWeight: '600' },
  policyCard: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  policyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  policyHeading: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
  policyText: { fontSize: 14, lineHeight: 22 },
  footerText: { textAlign: 'center', fontSize: 13, marginTop: 20, fontStyle: 'italic', paddingHorizontal: 10 }
});