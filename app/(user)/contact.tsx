import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 Theme Manager Import Kiya

export default function ContactScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Colors nikal liye

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          
          <View style={styles.row}>
            <Ionicons name="location" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Our Location</Text>
              <Text style={[styles.value, { color: colors.text }]}>Baghpat, Uttar Pradesh , India</Text>
            </View>
          </View>
          
          {/* Dynamic Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? '#3F3F46' : '#F4F4F5' }]} />
          
          <View style={styles.row}>
            <Ionicons name="mail" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Email Support</Text>
              <Text style={[styles.value, { color: colors.text }]}>support@lifedrop.in</Text>
            </View>
          </View>

          {/* Dynamic Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? '#3F3F46' : '#F4F4F5' }]} />
          
          <View style={styles.row}>
            <Ionicons name="call" size={24} color="#E63946" />
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Helpline</Text>
              <Text style={[styles.value, { color: colors.text }]}>+91 7599819325</Text>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

// ⚠️ Styles fixed for layout, dynamic colors handled inline
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { padding: 20 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  textWrap: { marginLeft: 15, flex: 1 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '500' },
  divider: { height: 1, marginVertical: 10 }
});