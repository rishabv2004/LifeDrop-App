import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Auth se user details nikal rahe hain
  const currentUser = auth.currentUser;
  const userName = currentUser?.displayName || 'LifeDrop User';
  const userEmail = currentUser?.email || 'user@lifedrop.com';

  // Toggle State (Hackathon demo ke liye local state)
  const [isAvailable, setIsAvailable] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/'); 
    } catch (error: any) {
      alert("Logout Failed: " + error.message);
    }
  };

  const toggleSwitch = () => {
    setIsAvailable(previousState => !previousState);
    if (!isAvailable) {
      alert("🟢 Status changed to AVAILABLE. You will now appear on the dashboard.");
    } else {
      alert("🔴 Status changed to UNAVAILABLE. Your profile is hidden to prevent disturbance.");
    }
    // Asli app mein yahan hum Firebase firestore mein donor ka status update karenge
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Verified User 🛡️</Text>
          </View>
        </View>

        {/* SETTINGS SECTION */}
        <Text style={styles.sectionTitle}>Donor Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: isAvailable ? '#D1FAE5' : '#FEE2E2' }]}>
              <Ionicons name="water" size={20} color={isAvailable ? '#10B981' : '#EF4444'} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Active Donor Status</Text>
              <Text style={styles.settingDesc}>
                {isAvailable ? 'Currently visible to nearby patients' : 'Hidden from dashboard'}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#E4E4E7', true: '#10B981' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#E4E4E7"
            onValueChange={toggleSwitch}
            value={isAvailable}
          />
        </View>

        <TouchableOpacity style={styles.settingRowAction} onPress={() => alert('Editing profile details will be available soon.')}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F4F4F5' }]}>
              <Ionicons name="person" size={20} color="#09090B" />
            </View>
            <Text style={styles.settingLabel}>Edit Personal Details</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F4F4F5' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: '#FFE4E6' },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#E63946' },
  userName: { fontSize: 22, fontWeight: '800', color: '#09090B', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#71717A', marginBottom: 12 },
  badgeContainer: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#DCFCE7' },
  badgeText: { color: '#16A34A', fontSize: 12, fontWeight: '700' },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#71717A', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F4F4F5' },
  settingRowAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderColor: '#F4F4F5' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#09090B' },
  settingDesc: { fontSize: 12, color: '#71717A', marginTop: 2 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FECACA' },
  logoutBtnText: { color: '#EF4444', fontSize: 16, fontWeight: '700' }
});