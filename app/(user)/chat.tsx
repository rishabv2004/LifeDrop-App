import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, auth } from '../../config/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const router = useRouter();
  const { otherUserName } = useLocalSearchParams(); 
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  const currentUser = auth.currentUser;
  const myName = currentUser?.displayName?.split(' ')[0] || 'User';
  const theirName = (otherUserName as string) || 'Donor';

  // 🔥 MASTER FIX: Alphabetical Sorting ensures Jyoti & Rahul ALWAYS get the exact same unique Room ID.
  const roomId = [myName, theirName].sort().join('_');

  useEffect(() => {
    const q = query(collection(db, "chatRooms", roomId, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    const textToSend = inputText.trim();
    setInputText(''); 

    try {
      // 1. Send Message inside the unique room
      await addDoc(collection(db, "chatRooms", roomId, "messages"), {
        text: textToSend,
        senderName: myName,
        createdAt: serverTimestamp()
      });

      // 2. Update the "Inbox List" metadata (For Notifications & Chat List)
      await setDoc(doc(db, "chatRooms", roomId), {
        participants: [myName, theirName],
        lastMessage: textToSend,
        lastSender: myName,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      alert("Failed to send message!");
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderName === myName;

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {!isMe && (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{theirName.charAt(0)}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleThem]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{theirName}</Text>
          <Text style={styles.headerStatus}>🟢 Online • Secure 1-on-1 Chat</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList 
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted 
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👋</Text>
              <Text style={styles.emptyText}>Say Hello to {theirName}!</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#A1A1AA"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={[styles.sendBtn, inputText.trim() === '' && styles.sendBtnDisabled]} onPress={sendMessage} disabled={inputText.trim() === ''}>
            <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 5, marginRight: 10 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#09090B', marginBottom: 2 },
  headerStatus: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  container: { flex: 1 },
  chatList: { paddingHorizontal: 15, paddingVertical: 20 },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowThem: { justifyContent: 'flex-start' },
  avatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarSmallText: { color: '#E63946', fontSize: 12, fontWeight: 'bold' },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageBubbleMe: { backgroundColor: '#E63946', borderBottomRightRadius: 4 },
  messageBubbleThem: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E4E4E7' },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextMe: { color: '#FFFFFF', fontWeight: '500' },
  messageTextThem: { color: '#09090B', fontWeight: '400' },
  emptyContainer: { alignItems: 'center', marginTop: 50, transform: [{ scaleY: -1 }] },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#A1A1AA', fontSize: 14, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E4E4E7', paddingBottom: Platform.OS === 'ios' ? 25 : 10 },
  input: { flex: 1, backgroundColor: '#F4F4F5', borderRadius: 20, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: '#09090B', maxHeight: 100, minHeight: 45 },
  sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E63946', justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 2 },
  sendBtnDisabled: { backgroundColor: '#FCA5A5' }
});