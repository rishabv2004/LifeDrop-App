import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 Theme Manager Import Kiya

export default function DonateScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Colors nikal liye

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support Our Cause</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#3F0F14' : '#FFF1F2' }]}>
          <Ionicons name="heart" size={40} color="#E63946" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Help Us Save More Lives</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#A1A1AA' : '#71717A' }]}>
          LifeDrop is a non-profit initiative by Lakshya Public School. Your small donation helps us keep the servers running and reach more people in Baghpat.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          
          {/* 🚀 ASLI QR CODE YAHAN LAGEGA 🚀 */}
          {/* Jab image assets/images/my-qr.png mein daal de, toh neeche wali line se // hata dena */}
          <Image source={require('../../assets/images/my-qr.jpeg')} style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10 }} />
          
          {/* Jab tak image nahi lagata, ye dummy icon dikhega */}
          
          <Text style={[styles.upiLabel, { color: isDark ? '#E4E4E7' : '#3F3F46' }]}>Scan to Donate via UPI</Text>
          <View style={[styles.upiBox, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
            <Text style={[styles.upiText, { color: colors.text }]}>rishabv@ptyes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ⚠️ Styles fixed for layout, dynamic colors handled inline
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { padding: 20, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  card: { borderRadius: 20, padding: 30, alignItems: 'center', width: '100%', borderWidth: 1 },
  upiLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  upiBox: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  upiText: { fontSize: 16, fontWeight: '700' }
});