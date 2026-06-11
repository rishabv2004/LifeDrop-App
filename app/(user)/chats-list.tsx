import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ChatsListScreen() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const myName = auth.currentUser?.displayName?.split(' ')[0] || 'User';

  useEffect(() => {
    // Sirf wahi chats uthao jisme mera naam shamil ho
    const q = query(collection(db, "chatRooms"), where("participants", "array-contains", myName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms: any[] = [];
      snapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by latest message in JavaScript to avoid Firebase indexing issues in Hackathon
      rooms.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
      setChatRooms(rooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [myName]);

  const renderChatItem = ({ item }: { item: any }) => {
    // Dusre bande ka naam nikalo
    const otherUserName = item.participants.find((p: string) => p !== myName) || 'Unknown User';
    
    // Check karo ki aakhri message kisi aur ne bheja hai (Unread logic)
    const isUnread = item.lastSender !== myName;

    return (
      <TouchableOpacity 
        style={styles.chatCard} 
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/(user)/chat', params: { otherUserName: otherUserName } })}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{otherUserName.charAt(0)}</Text>
        </View>
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, isUnread && styles.unreadText]}>{otherUserName}</Text>
          <Text style={[styles.lastMessage, isUnread && styles.unreadMessage]} numberOfLines={1}>
            {item.lastSender === myName ? 'You: ' : ''}{item.lastMessage}
          </Text>
        </View>
        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E63946" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#E4E4E7" />
              <Text style={styles.emptyText}>No messages yet.</Text>
              <Text style={styles.emptySubtext}>When you request blood, your chats will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B' },
  listContainer: { paddingTop: 10, paddingHorizontal: 15 },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F4F4F5' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#E63946' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatName: { fontSize: 16, fontWeight: '600', color: '#09090B', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#71717A' },
  unreadText: { fontWeight: '800', color: '#09090B' },
  unreadMessage: { fontWeight: '700', color: '#09090B' },
  unreadDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E63946', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#09090B', marginTop: 15, marginBottom: 5 },
  emptySubtext: { fontSize: 14, color: '#A1A1AA', textAlign: 'center', lineHeight: 20 }
});