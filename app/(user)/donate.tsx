import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DonateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Our Cause</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={40} color="#E63946" />
        </View>
        <Text style={styles.title}>Help Us Save More Lives</Text>
        <Text style={styles.subtitle}>
          LifeDrop is a non-profit initiative by Lakshya Public School. Your small donation helps us keep the servers running and reach more people in Baghpat.
        </Text>

        <View style={styles.card}>
          <Ionicons name="qr-code-outline" size={100} color="#09090B" style={{ marginBottom: 20 }} />
          <Text style={styles.upiLabel}>Scan to Donate via UPI</Text>
          <View style={styles.upiBox}>
            <Text style={styles.upiText}>rishabv@ptyes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  container: { padding: 20, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#09090B', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#71717A', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#E4E4E7' },
  upiLabel: { fontSize: 16, fontWeight: '600', color: '#3F3F46', marginBottom: 10 },
  upiBox: { backgroundColor: '#F4F4F5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  upiText: { fontSize: 16, fontWeight: '700', color: '#09090B' }
});