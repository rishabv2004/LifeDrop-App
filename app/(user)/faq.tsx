import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 Theme Manager Import Kiya

export default function FAQScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Colors nikal liye

  // 📝 5 Naye FAQs add kar diye hain!
  const faqs = [
    { q: "Is LifeDrop completely free?", a: "Yes, LifeDrop is a 100% free social welfare initiative." },
    { q: "How do I contact a donor?", a: "Once you find a nearby donor, you can directly see their mobile number and call them." },
    { q: "What happens when I trigger an SOS alert?", a: "The SOS feature instantly broadcasts your emergency details to all active donors within a 30km radius of your current location." },
    { q: "Can I hide my profile if I cannot donate?", a: "Yes! You can go to 'My Profile' and toggle your Active Donor Status to turn it off. You will instantly disappear from the dashboard." },
    { q: "Who can register as a blood donor?", a: "Anyone who is generally in good health, weighs at least 50 kg, and is between 18 to 65 years of age can register as a donor." },
    { q: "Is my phone number safe?", a: "Yes, your number is only visible to securely registered users to coordinate emergency donations. We do not share data with any third parties." },
    { q: "Who manages this app?", a: "It is developed and managed by the CS Department of Lakshya Public School, Baghpat." },
    { q: "Is my location tracked all the time?", a: "No, we only fetch your hardware GPS location when you open the app or press the refresh button to find nearby donors." }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {faqs.map((item, index) => (
          <View key={index} style={[styles.faqCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.question, { color: colors.text }]}>{item.q}</Text>
            <Text style={[styles.answer, { color: isDark ? '#A1A1AA' : '#71717A' }]}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ⚠️ Styles fixed for structure, colors handled inline!
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { padding: 20, paddingBottom: 40 },
  faqCard: { padding: 20, borderRadius: 16, marginBottom: 15, borderWidth: 1 },
  question: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  answer: { fontSize: 14, lineHeight: 20 }
});