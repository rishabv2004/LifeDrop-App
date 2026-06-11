import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 ThemeContext Import Kiya

export default function VisionScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Theme extract kiya

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Our Vision</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#3F0F14' : '#FFF1F2' }]}>
            <Ionicons name="earth" size={40} color="#E63946" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>A Social Initiative for a Better Tomorrow.</Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Bridging the gap between blood donors and those in critical need, instantly and securely.</Text>
        </View>

        {/* ABOUT THE TEAM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behind LifeDrop</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.cardText, { color: isDark ? '#E4E4E7' : '#3F3F46' }]}>
              LifeDrop is not just an app; it's a movement started from the classrooms of <Text style={styles.highlight}>Lakshya Public School, Baghpat</Text>. 
            </Text>
            <Text style={[styles.cardText, { color: isDark ? '#E4E4E7' : '#3F3F46' }]}>
              Developed collaboratively by the passionate students of <Text style={styles.highlight}>Class 11</Text> under the mentorship of their PGT Computer Science Teacher, <Text style={styles.highlight}>Mr. Rishab Verma</Text>. Our goal is to use technology for real-world social welfare.
            </Text>
            
            <View style={styles.teamRow}>
              <View style={[styles.teamBadge, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                <Ionicons name="school" size={16} color="#10B981" />
                <Text style={[styles.teamBadgeText, { color: colors.text }]}>Class 11 Students</Text>
              </View>
              <View style={[styles.teamBadge, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                <Ionicons name="code-slash" size={16} color="#3B82F6" />
                <Text style={[styles.teamBadgeText, { color: colors.text }]}>CS Department</Text>
              </View>
            </View>
          </View>
        </View>

        {/* MISSION POINTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Core Values</Text>
          
          <View style={[styles.valueRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.valueIcon, { backgroundColor: isDark ? '#3F0F14' : '#FEE2E2' }]}>
              <Ionicons name="flash" size={20} color="#EF4444" />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Zero Delay</Text>
              <Text style={[styles.valueDesc, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Connecting patients with nearby donors using precise Hardware GPS.</Text>
            </View>
          </View>

          <View style={[styles.valueRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.valueIcon, { backgroundColor: isDark ? '#064E3B' : '#D1FAE5' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>100% Transparency</Text>
              <Text style={[styles.valueDesc, { color: isDark ? '#A1A1AA' : '#71717A' }]}>No hidden fees, no middlemen. Direct contact between the donor and the receiver.</Text>
            </View>
          </View>

          <View style={[styles.valueRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.valueIcon, { backgroundColor: isDark ? '#1E3A8A' : '#DBEAFE' }]}>
              <Ionicons name="people" size={20} color="#3B82F6" />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Community Driven</Text>
              <Text style={[styles.valueDesc, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Empowering local citizens of Baghpat and beyond to save lives daily.</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>Made with ❤️ by Lakshya Public School</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ⚠️ Styles waise hi rahenge, main colors inline update kar diye hain!
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 10, lineHeight: 32 },
  heroSubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  card: { borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1 },
  cardText: { fontSize: 15, lineHeight: 24, marginBottom: 12 },
  highlight: { fontWeight: '700', color: '#E63946' },
  teamRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  teamBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  teamBadgeText: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  valueRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  valueIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  valueTextContainer: { flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  valueDesc: { fontSize: 13, lineHeight: 18 },
  footerText: { textAlign: 'center', fontSize: 14, color: '#A1A1AA', fontWeight: '600', marginTop: 10 }
});