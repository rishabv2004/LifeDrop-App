import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="location" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={styles.label}>Our Location</Text>
              <Text style={styles.value}>Baghpat, Uttar Pradesh , India</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Ionicons name="mail" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={styles.label}>Email Support</Text>
              <Text style={styles.value}>support@lifedrop.in</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Ionicons name="call" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={styles.label}>Helpline</Text>
              <Text style={styles.value}>+91 7599819325</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  container: { padding: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E4E4E7' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  textWrap: { marginLeft: 15, flex: 1 },
  label: { fontSize: 13, color: '#A1A1AA', fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 15, color: '#09090B', fontWeight: '500' },
divider: { height: 1, backgroundColor: '#F4F4F5', marginVertical: 10 }});