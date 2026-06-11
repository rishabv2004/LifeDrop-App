import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ActivityIndicator, Platform, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router'; // 👈 useNavigation add kiya
import { DrawerActions } from '@react-navigation/native'; // 👈 Drawer kholne ka tool
import { db, auth } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1)); 
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'Recently';
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return 'Recently';
};

export default function UserDashboard() {
  const router = useRouter();
  const navigation = useNavigation(); // 👈 Navigation variable banaya
  const [searchQuery, setSearchQuery] = useState('');
  const [isHindi, setIsHindi] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);

  const currentUser = auth.currentUser;
  const myFirstName = currentUser?.displayName?.split(' ')[0] || 'User';

  const [showSOSModal, setShowSOSModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientBlood, setPatientBlood] = useState('');
  const [hospitalName, setHospitalName] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (loc) {
          setUserCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        }
      } else {
        Alert.alert("Permission Denied", "Please enable location services.");
      }
    } catch (e) { 
      console.log(e); 
      Alert.alert("Error", "Could not fetch location.");
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/'); 
    } catch (error: any) { alert("Logout Failed: " + error.message); }
  };

  const handleSOSOpen = () => setShowSOSModal(true);

  const handleSOSSubmit = () => {
    if (!patientName || !patientGender || !patientBlood || !hospitalName) {
      Alert.alert(isHindi ? "त्रुटि" : "Error", isHindi ? "कृपया सभी आपातकालीन विवरण भरें!" : "Please fill all emergency details!");
      return;
    }
    setShowSOSModal(false);
    Alert.alert(
      isHindi ? "🚨 आपातकालीन अलर्ट लाइव!" : "🚨 SOS Broadcast Active!",
      isHindi 
        ? `मरीज: ${patientName}\nब्लड ग्रुप: ${patientBlood}\nअस्पताल: ${hospitalName}\n\nआपकी लोकेशन के 30 किमी के दायरे में सभी सक्रिय डोनर्स को आपातकालीन नोटिफिकेशन भेज दिया गया है!`
        : `Patient: ${patientName}\nBlood Required: ${patientBlood}\nHospital: ${hospitalName}\n\nEmergency broadcast has been sent successfully to all active donors within 30km!`,
      [{ text: "OK", onPress: () => { setPatientName(''); setPatientGender(''); setPatientBlood(''); setHospitalName(''); }}]
    );
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({});
          if (isMounted && loc) setUserCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        } else {
          if (isMounted) setUserCoords({ lat: 28.9846, lon: 77.2872 }); 
        }
      } catch (e) {
        if (isMounted) setUserCoords({ lat: 28.9846, lon: 77.2872 }); 
      }
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donorList: any[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const distanceKM = userCoords ? calculateDistance(userCoords.lat, userCoords.lon, data.latitude, data.longitude) : 9999; 
        donorList.push({ id: doc.id, ...data, computedDistance: distanceKM });
      });
      donorList.sort((a, b) => a.computedDistance - b.computedDistance);
      setDonors(donorList);
      setLoading(false);
    }, (error) => { setLoading(false); });
    return () => unsubscribe();
  }, [userCoords]); 

  const filteredDonors = donors.filter(donor => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = donor.city?.toLowerCase().includes(searchLower) || donor.bloodGroup?.toLowerCase().includes(searchLower);
    const withinRange = donor.computedDistance <= 30; 
    
    const donorFirstName = (donor.fullName || 'Anonymous').split(' ')[0].toLowerCase();
    const isNotMe = donorFirstName !== myFirstName.toLowerCase();

    return matchesSearch && withinRange && isNotMe;
  });

  const renderDonorCard = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.donorInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.fullName ? item.fullName.charAt(0) : 'D'}</Text>
            </View>
            <View style={styles.nameTextContainer}>
              <Text style={styles.donorName} numberOfLines={1}>{item.fullName || 'Anonymous'}</Text>
              <Text style={styles.distanceText}>📍 {item.city} • {item.computedDistance} km</Text>
            </View>
          </View>
          <View style={styles.bloodBadge}>
            <Text style={styles.bloodBadgeText}>{item.bloodGroup}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.statusCol}>
            <Text style={styles.statusLabel}>{isHindi ? 'स्थिति' : 'Status'}</Text>
            <View style={styles.statusIndicatorRow}>
              <View style={[styles.statusDot, { backgroundColor: item.available ? '#10B981' : '#EF4444' }]} />
              <Text style={[styles.statusValue, { color: item.available ? '#10B981' : '#EF4444' }]}>
                {item.available ? (isHindi ? 'उपलब्ध' : 'Available') : (isHindi ? 'अनुपलब्ध' : 'Unavailable')}
              </Text>
            </View>
          </View>
          <View style={styles.statusColRight}>
            <Text style={styles.statusLabel}>{isHindi ? 'संपर्क' : 'Contact'}</Text>
            <Text style={styles.statusValueDark}>{item.mobileNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.registrationInfo}>
          <Ionicons name="calendar-outline" size={15} color="#71717A" />
          <Text style={styles.registrationText}>
            {isHindi ? 'पंजीकृत: ' : 'Registered: '} 
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />
      
      {/* 🛠️ UPDATED HEADER WITH HAMBURGER MENU BUTTON */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* MENU BUTTON */}
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="menu" size={32} color="#09090B" />
          </TouchableOpacity>
          
          <View>
            <Text style={styles.greeting}>{isHindi ? `नमस्ते, ${myFirstName} 👋` : `Hello, ${myFirstName} 👋`}</Text>
            <Text style={styles.headerLocation}>📍 Live Hardware GPS Active</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh} disabled={refreshing}>
            {refreshing ? <ActivityIndicator size="small" color="#E63946" /> : <Ionicons name="refresh-outline" size={18} color="#09090B" />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsHindi(!isHindi)}>
            <Text style={styles.iconButtonText}>A/अ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sosContainer}>
        <TouchableOpacity style={styles.sosButton} activeOpacity={0.9} onPress={handleSOSOpen}>
          <View style={styles.sosIconCircle}>
            <Ionicons name="alert-circle" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.sosTextWrapper}>
            <Text style={styles.sosTitle}>{isHindi ? 'आपातकालीन रक्त अनुरोध' : 'URGENT BLOOD REQUEST'}</Text>
            <Text style={styles.sosSubtitle}>{isHindi ? 'विवरण भरकर डोनर्स को अलर्ट करें' : 'Fill details & alert nearby donors'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ opacity: 0.8 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.pageTitle}>{isHindi ? 'आसपास के रक्तदाता (30 किमी)' : 'Nearby Donors (Within 30km)'}</Text>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder={isHindi ? "रक्त समूह या शहर खोजें..." : "Search blood group or city..."} placeholderTextColor="#A1A1AA" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
      </View>

      {loading || !userCoords ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.loadingText}>Locating your coordinates...</Text>
        </View>
      ) : (
        <FlatList 
          data={filteredDonors}
          keyExtractor={(item) => item.id}
          renderItem={renderDonorCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No nearby donors found within 30km.</Text>}
        />
      )}

      <Modal visible={showSOSModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isHindi ? "🚨 आपातकालीन फॉर्म" : "🚨 Emergency Details"}</Text>
                <Text style={styles.modalSubtitle}>{isHindi ? "यह विवरण तुरंत पास के डोनर्स के पास अलर्ट के रूप में जाएगा।" : "This short form data broadcasts live to nearby life-savers."}</Text>
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.formLabel}>{isHindi ? "मरीज का नाम" : "Patient Full Name"}</Text>
                <TextInput style={styles.formInput} placeholder="e.g. Satish Kumar" placeholderTextColor="#A1A1AA" value={patientName} onChangeText={setPatientName} />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formInputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.formLabel}>{isHindi ? "लिंग" : "Gender"}</Text>
                  <TextInput style={styles.formInput} placeholder="Male / Female" placeholderTextColor="#A1A1AA" value={patientGender} onChangeText={setPatientGender} />
                </View>
                <View style={[styles.formInputGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>{isHindi ? "रक्त समूह" : "Blood Group"}</Text>
                  <TextInput style={styles.formInput} placeholder="e.g. O+, AB-" placeholderTextColor="#A1A1AA" autoCapitalize="characters" value={patientBlood} onChangeText={setPatientBlood} />
                </View>
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.formLabel}>{isHindi ? "अस्पताल का नाम और पता" : "Hospital Name / Location"}</Text>
                <TextInput style={styles.formInput} placeholder="e.g. City Hospital, Delhi Road" placeholderTextColor="#A1A1AA" value={hospitalName} onChangeText={setHospitalName} />
              </View>
              <TouchableOpacity style={styles.broadcastBtn} activeOpacity={0.9} onPress={handleSOSSubmit}>
                <Text style={styles.broadcastBtnText}>{isHindi ? "🚨 लाइव ब्रॉडकास्ट अलर्ट भेजें" : "🚨 Send Live SOS Alert"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setShowSOSModal(false)}>
                <Text style={styles.cancelModalBtnText}>{isHindi ? "रद्द करें" : "Cancel"}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} activeOpacity={0.9} onPress={() => router.push('/(donor)/register')}>
          <Text style={styles.fabIcon}>🩸</Text>
          <Text style={styles.fabText}>{isHindi ? 'रक्तदाता बनें' : 'Become a Donor'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 20 : 10, marginBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' }, // 👈 Naya style
  menuButton: { marginRight: 15, padding: 2 }, // 👈 Naya style
  greeting: { fontSize: 24, fontWeight: '800', color: '#09090B', letterSpacing: -0.5 },
  headerLocation: { fontSize: 13, color: '#10B981', fontWeight: '600', marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { backgroundColor: '#FFFFFF', width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', alignItems: 'center' },
  iconButtonText: { fontSize: 14, fontWeight: 'bold', color: '#09090B' },
  sosContainer: { paddingHorizontal: 20, marginBottom: 20 },
  sosButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', borderRadius: 20, padding: 16, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  sosIconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  sosTextWrapper: { flex: 1 },
  sosTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 2, letterSpacing: 0.5 },
  sosSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },
  searchSection: { paddingHorizontal: 20, marginBottom: 10 },
  pageTitle: { fontSize: 17, fontWeight: '700', color: '#71717A', marginBottom: 12 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4E4E7', height: 55 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#09090B' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#71717A', fontSize: 15 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#71717A', fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F4F4F5' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  donorInfo: { flexDirection: 'row', flex: 1, paddingRight: 15 },
  avatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1.5, borderColor: '#FFE4E6' },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#E63946' },
  nameTextContainer: { flex: 1, justifyContent: 'center' },
  donorName: { fontSize: 19, fontWeight: '800', color: '#09090B', marginBottom: 4, letterSpacing: -0.3 },
  distanceText: { fontSize: 13, color: '#71717A', fontWeight: '500' },
  bloodBadge: { backgroundColor: '#E63946', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  bloodBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FAFAFA', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F4F4F5' },
  statusCol: { flex: 1 },
  statusColRight: { flex: 1, alignItems: 'flex-end' },
  statusLabel: { fontSize: 12, color: '#A1A1AA', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusValue: { fontSize: 14, fontWeight: '700' },
  statusValueDark: { fontSize: 15, fontWeight: '800', color: '#09090B' },
  registrationInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F4F4F5' },
  registrationText: { fontSize: 13, color: '#71717A', fontWeight: '600', marginLeft: 6 },
  fabContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  fabButton: { flexDirection: 'row', backgroundColor: '#E63946', paddingVertical: 16, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', shadowColor: '#E63946', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  fabIcon: { fontSize: 20, marginRight: 10 },
  fabText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '85%' },
  modalHeader: { marginBottom: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#EF4444', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#71717A', textAlign: 'center', lineHeight: 20 },
  formInputGroup: { marginBottom: 18 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  formLabel: { fontSize: 14, fontWeight: '600', color: '#09090B', marginBottom: 8 },
  formInput: { backgroundColor: '#F4F4F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#09090B', borderWidth: 1, borderColor: '#E4E4E7' },
  broadcastBtn: { backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 15, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  broadcastBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  cancelModalBtn: { marginTop: 12, paddingVertical: 14, alignItems: 'center' },
  cancelModalBtnText: { color: '#71717A', fontSize: 15, fontWeight: '600' }
});