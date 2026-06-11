import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donorList: any[] = [];
      snapshot.forEach((doc) => {
        donorList.push({ id: doc.id, ...doc.data() });
      });
      setDonors(donorList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteDonor = (donorId: string, donorName: string) => {
    Alert.alert(
      "Remove Donor",
      `Are you sure you want to permanently delete ${donorName} from the database?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "donors", donorId));
              Alert.alert("Success", "Donor removed successfully.");
            } catch (error) {
              Alert.alert("Error", "Could not delete donor.");
            }
          }
        }
      ]
    );
  };

  const renderAdminCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.infoCol}>
        <Text style={styles.name}>{item.fullName || 'Unknown'}</Text>
        <Text style={styles.details}>Blood: {item.bloodGroup} | City: {item.city}</Text>
        <Text style={styles.details}>Contact: {item.mobileNumber}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteDonor(item.id, item.fullName)}>
        <Ionicons name="trash" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(user)/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Control Center</Text>
          <Text style={styles.headerSubtitle}>Live Database Management</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{donors.length}</Text>
          <Text style={styles.statLabel}>Total Donors</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>🟢 Active</Text>
          <Text style={styles.statLabel}>System Status</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#09090B" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={donors}
          keyExtractor={(item) => item.id}
          renderItem={renderAdminCard}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#09090B', paddingTop: 40, paddingBottom: 30 },
  backBtn: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: '#A1A1AA', marginTop: 2 },
  statsContainer: { flexDirection: 'row', padding: 20, marginTop: -20 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginHorizontal: 5, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#09090B', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#71717A', fontWeight: '600', textTransform: 'uppercase' },
  listContainer: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E4E4E7' },
  infoCol: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#09090B', marginBottom: 4 },
  details: { fontSize: 13, color: '#71717A', marginBottom: 2 },
  deleteBtn: { backgroundColor: '#EF4444', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});