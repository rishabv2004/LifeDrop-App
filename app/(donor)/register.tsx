import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// 🇮🇳 ALL INDIA STATES & DISTRICTS PERMANENT DATABASE
const INDIA_DATA: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Changlang", "Tirap"],
  "Assam": ["Baksa", "Barpeta", "Bongaigaon", "Cachar", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Guwahati", "Jorhat", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Bastar", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janijgir-Champa", "Jashpur", "Kanker", "Kawardha", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jammu & Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Mendhar", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Girish", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harding", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Tamil Nadu": ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandoli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Amroha", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Khekra", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

const STATES_LIST = Object.keys(INDIA_DATA).sort();

export default function DonorRegister() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [loading, setLoading] = useState(false);

  // Selection States
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Modal controllers
  const [showStateModal, setShowStateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const handleRegister = async () => {
    if (!name || !mobile || !selectedState || !selectedDistrict || !selectedBlood) {
      alert("Please fill all details and select your location!");
      return;
    }

    setLoading(true);
    const fullLocationString = `${selectedDistrict}, ${selectedState}, India`;

    try {
      let latitude = 0;
      let longitude = 0;

      // 🛡️ LAYER 1: HACKATHON FAIL-SAFE DICTIONARY (For Guaranteed Demo)
      // Agar inme se koi sheher select hua, toh API ki zarurat hi nahi, 100% fix.
      const safeCoords: Record<string, {lat: number, lon: number}> = {
        "Bhopal": { lat: 23.2599, lon: 77.4126 },
        "Baghpat": { lat: 28.9426, lon: 77.2274 },
        "Khekra": { lat: 28.8687, lon: 77.2793 },
        "Delhi": { lat: 28.7041, lon: 77.1025 },
        "Jaipur": { lat: 26.9124, lon: 75.7873 },
        "Meerut": { lat: 28.9845, lon: 77.7064 }
      };

      if (safeCoords[selectedDistrict]) {
        latitude = safeCoords[selectedDistrict].lat;
        longitude = safeCoords[selectedDistrict].lon;
      } else {
        // 🛡️ LAYER 2: API WITH USER-AGENT (Ab mobile block nahi karega)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullLocationString)}`, {
          headers: {
            // OSM API requires a User-Agent, otherwise it blocks mobile fetch
            'User-Agent': 'LifeDropHackathonApp/1.0' 
          }
        });
        const data = await response.json();

        if (data && data.length > 0) {
          latitude = parseFloat(data[0].lat);
          longitude = parseFloat(data[0].lon);
        } else {
          // 🛡️ LAYER 3: THE STOPPER! Koi fake GPS save nahi hoga.
          throw new Error("Could not fetch exact map coordinates. Please check connection or try a nearby major district.");
        }
      }

      // Live Firebase Saving
      await addDoc(collection(db, "donors"), {
        fullName: name,
        mobileNumber: mobile,
        city: fullLocationString,
        bloodGroup: selectedBlood,
        latitude: latitude,
        longitude: longitude,
        available: true,
        createdAt: serverTimestamp()
      });

      setLoading(false);
      alert("Registration Successful! Accurate GPS Mapped 🩸");
      router.replace('/(user)/dashboard'); 
    } catch (error: any) {
      setLoading(false);
      alert("Registration Error: " + error.message);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Donor</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Save a Life</Text>
            <Text style={styles.subtitle}>Select your State and District from the official list for highly accurate live distance tracking.</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Rishab Verma" placeholderTextColor="#A1A1AA" value={name} onChangeText={setName} editable={!loading} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput style={styles.input} placeholder="e.g. 9876543210" placeholderTextColor="#A1A1AA" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} editable={!loading} />
            </View>

            {/* CASCADING DROPDOWNS */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>State</Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowStateModal(true)} disabled={loading}>
                  <Text style={[styles.dropdownBtnText, !selectedState && { color: '#A1A1AA' }]} numberOfLines={1}>
                    {selectedState || "Select State"}
                  </Text>
                  <Text style={{color: '#71717A', fontSize: 10}}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>District</Text>
                <TouchableOpacity 
                  style={[styles.dropdownBtn, !selectedState && { backgroundColor: '#F4F4F5', borderColor: '#E4E4E7' }]} 
                  onPress={() => {
                    if(!selectedState) alert("Please select a State first!");
                    else setShowDistrictModal(true);
                  }} 
                  disabled={loading || !selectedState}
                >
                  <Text style={[styles.dropdownBtnText, !selectedDistrict && { color: '#A1A1AA' }]} numberOfLines={1}>
                    {selectedDistrict || "Select District"}
                  </Text>
                  <Text style={{color: '#71717A', fontSize: 10}}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Blood Group</Text>
              <View style={styles.bloodGrid}>
                {BLOOD_GROUPS.map((bg) => (
                  <TouchableOpacity key={bg} style={[styles.bloodButton, selectedBlood === bg && styles.bloodButtonActive]} onPress={() => setSelectedBlood(bg)} disabled={loading}>
                    <Text style={[styles.bloodButtonText, selectedBlood === bg && styles.bloodButtonTextActive]}>{bg}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.submitButton, loading && { backgroundColor: '#FCA5A5' }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Submit Registration</Text>}
        </TouchableOpacity>
      </View>

      {/* STATE MODAL */}
      <Modal visible={showStateModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select State</Text>
            <FlatList 
              data={STATES_LIST}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => {
                  setSelectedState(item);
                  setSelectedDistrict(''); // Reset district on state change
                  setShowStateModal(false);
                }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowStateModal(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DISTRICT MODAL */}
      <Modal visible={showDistrictModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select District</Text>
            <FlatList 
              data={selectedState ? INDIA_DATA[selectedState].sort() : []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => {
                  setSelectedDistrict(item);
                  setShowDistrictModal(false);
                }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowDistrictModal(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F4F4F5' },
  backIcon: { fontSize: 24, color: '#09090B', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  titleSection: { marginBottom: 25 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#E63946', marginBottom: 8 },
  subtitle: { color: '#71717A', fontSize: 15, lineHeight: 22 },
  cardContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E4E4E7' },
  inputGroup: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#09090B', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#F4F4F5', borderRadius: 14, padding: 16, color: '#09090B', fontSize: 16 },
  dropdownBtn: { backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#F4F4F5', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56 },
  dropdownBtnText: { color: '#09090B', fontSize: 15, flex: 1 },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 5 },
  bloodButton: { width: (width - 110) / 4, backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#F4F4F5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bloodButtonActive: { backgroundColor: '#E63946', borderColor: '#E63946' },
  bloodButtonText: { color: '#71717A', fontSize: 16, fontWeight: 'bold' },
  bloodButtonTextActive: { color: '#FFFFFF' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 35 : 20, borderTopWidth: 1, borderTopColor: '#F4F4F5' },
  submitButton: { backgroundColor: '#E63946', paddingVertical: 18, borderRadius: 16, alignItems: 'center', height: 56, justifyContent: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#09090B', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F4F4F5' },
  modalItemText: { fontSize: 16, color: '#09090B', textAlign: 'center' },
  closeModalBtn: { marginTop: 15, paddingVertical: 15, backgroundColor: '#F4F4F5', borderRadius: 12, alignItems: 'center' },
  closeModalBtnText: { color: '#E63946', fontSize: 16, fontWeight: 'bold' }
});