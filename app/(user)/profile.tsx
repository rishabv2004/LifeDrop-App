import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 👈 Theme Manager Import Kiya

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors } = useContext(ThemeContext); // 👈 Colors Nikale
  
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        
        {/* PROFILE CARD */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth: 1 }]}>
          <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#3F0F14' : '#FFF1F2', borderColor: isDark ? '#881337' : '#FFE4E6' }]}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
          <Text style={[styles.userEmail, { color: isDark ? '#A1A1AA' : '#71717A' }]}>{userEmail}</Text>
          <View style={[styles.badgeContainer, { backgroundColor: isDark ? '#064E3B' : '#F0FDF4', borderColor: isDark ? '#047857' : '#DCFCE7' }]}>
            <Text style={[styles.badgeText, { color: isDark ? '#34D399' : '#16A34A' }]}>Verified User 🛡️</Text>
          </View>
        </View>

        {/* SETTINGS SECTION */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#A1A1AA' : '#71717A' }]}>Donor Settings</Text>
        
        <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: isAvailable ? (isDark ? '#064E3B' : '#D1FAE5') : (isDark ? '#3F0F14' : '#FEE2E2') }]}>
              <Ionicons name="water" size={20} color={isAvailable ? '#10B981' : '#EF4444'} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Active Donor Status</Text>
              <Text style={[styles.settingDesc, { color: isDark ? '#A1A1AA' : '#71717A' }]}>
                {isAvailable ? 'Currently visible to nearby patients' : 'Hidden from dashboard'}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: isDark ? '#3F3F46' : '#E4E4E7', true: '#10B981' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor={isDark ? '#3F3F46' : '#E4E4E7'}
            onValueChange={toggleSwitch}
            value={isAvailable}
          />
        </View>

        <TouchableOpacity style={[styles.settingRowAction, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => alert('Editing profile details will be available soon.')}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
              <Ionicons name="person" size={20} color={colors.text} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Edit Personal Details</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#71717A' : '#A1A1AA'} />
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: isDark ? '#3F0F14' : '#FEF2F2', borderColor: isDark ? '#881337' : '#FECACA' }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// ⚠️ Styles waise hi rahenge, main colors inline update kar diye hain!
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  profileCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#E63946' },
  userName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 12 },
  badgeContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  settingRowAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 30, borderWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  logoutBtnText: { color: '#EF4444', fontSize: 16, fontWeight: '700' }
});