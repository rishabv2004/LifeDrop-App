import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FAQScreen() {
  const router = useRouter();

  const faqs = [
    { q: "Is LifeDrop completely free?", a: "Yes, LifeDrop is a 100% free social welfare initiative." },
    { q: "How do I contact a donor?", a: "Once you find a nearby donor, you can directly see their mobile number and call them." },
    { q: "Who manages this app?", a: "It is managed by the CS Department of Lakshya Public School, Baghpat." },
    { q: "Is my location tracked all the time?", a: "No, we only fetch your location when you open the app to find nearby donors." }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {faqs.map((item, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  container: { padding: 20 },
  faqCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#E4E4E7' },
  question: { fontSize: 16, fontWeight: '700', color: '#09090B', marginBottom: 8 },
  answer: { fontSize: 14, color: '#71717A', lineHeight: 20 }
});