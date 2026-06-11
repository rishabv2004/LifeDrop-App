import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Custom Drawer Content (Jisme Stamp lagega)
function CustomDrawerContent(props: any) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* 🏆 THE MASTER STAMP */}
      {/* 🏆 THE PREMIUM MASTER STAMP */}
      <View style={{ padding: 24, borderTopWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#FAFAFA', paddingBottom: 40, alignItems: 'center' }}>
        
        {/* Students Card */}
        <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 12, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}>
           <Text style={{ fontSize: 10, color: '#71717A', textAlign: 'center', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
             Designed By
           </Text>
           <Text style={{ fontSize: 13, color: '#09090B', textAlign: 'center', fontWeight: '800' }}>
             Class 11 Students
           </Text>
           <Text style={{ fontSize: 11, color: '#71717A', textAlign: 'center', marginTop: 3, fontWeight: '500' }}>
             Lakshya Public School, Baghpat
           </Text>
        </View>

        {/* Teacher/Mentor Card */}
        <View style={{ backgroundColor: '#FFF1F2', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, width: '100%', borderWidth: 1, borderColor: '#FECDD3' }}>
           <Text style={{ fontSize: 10, color: '#E63946', textAlign: 'center', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
             Developed & Mentored By
           </Text>
           <Text style={{ fontSize: 14, color: '#E63946', textAlign: 'center', fontWeight: '900', letterSpacing: 0.5 }}>
             Rishab Verma
           </Text>
           <Text style={{ fontSize: 11, color: '#E63946', textAlign: 'center', fontWeight: '600', marginTop: 2 }}>
             (PGT Computer Science)
           </Text>
        </View>

      </View>git add .
    </View>
  );
}

export default function UserDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, 
          drawerActiveBackgroundColor: '#FFF1F2',
          drawerActiveTintColor: '#E63946',
          drawerInactiveTintColor: '#09090B',
          drawerStyle: { backgroundColor: '#FFFFFF', width: 280 },
          drawerLabelStyle: { fontSize: 16, fontWeight: '600', marginLeft: -10 },
        }}
      >
        <Drawer.Screen name="dashboard" options={{ drawerLabel: 'Home', title: 'Dashboard', drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="profile" options={{ drawerLabel: 'My Profile', title: 'Profile', drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="vision" options={{ drawerLabel: 'Our Vision', title: 'Our Vision', drawerIcon: ({ color }) => <Ionicons name="eye-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="donate" options={{ drawerLabel: 'Donate Funds', title: 'Donate', drawerIcon: ({ color }) => <Ionicons name="heart-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="faq" options={{ drawerLabel: 'Help & FAQ', title: 'FAQ', drawerIcon: ({ color }) => <Ionicons name="help-circle-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="privacy" options={{ drawerLabel: 'Privacy Policy', title: 'Privacy Policy', drawerIcon: ({ color }) => <Ionicons name="shield-checkmark-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="contact" options={{ drawerLabel: 'Contact Us', title: 'Contact', drawerIcon: ({ color }) => <Ionicons name="call-outline" size={22} color={color} /> }} />
        <Drawer.Screen name="admin-login" options={{ drawerLabel: 'Admin Access', title: 'Admin Login', drawerIcon: ({ color }) => <Ionicons name="shield-half" size={22} color={color} /> }} />

        {/* HIDDEN SCREENS */}
        <Drawer.Screen name="admin-dashboard" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="chats-list" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="chat" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}