import { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import CONFIG from "../config";

// 🎨 Couleurs VIALI
const COLORS = {
  primary: "#F47920",
  secondary: "#FDB71A",
  accent: "#E84E1B",
  background: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  darkGray: "#1F2937",
  success: "#10B981",
};

// 🔹 Axios instance avec timeout
const api = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: 10000, // 10 secondes
});

interface Message {
  id: number;
  sender_name: string;
  content: string;
  timestamp?: string;
}

interface Conversation {
  id: number;
  name: string;
  messages: Message[];
}

export default function ChatScreen() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // 🔹 Récupérer la première conversation
  const fetchConversation = async () => {
    try {
      const res = await api.get(CONFIG.ENDPOINTS.CONVERSATIONS);
      if (res.data.length > 0) {
        setConversation(res.data[0]);
        setMessages(res.data[0].messages || []);
      } else {
        setConversation(null);
        setMessages([]);
      }
    } catch (error: any) {
      console.log("Erreur fetch conversation :", error.message || error);
      Alert.alert("Erreur", "Impossible de récupérer la conversation. Vérifiez le serveur.");
    }
  };

  // 🔹 Récupérer les messages d'une conversation
  const fetchMessages = async () => {
    if (!conversation) return;
    try {
      setLoading(true);
      const res = await api.get(`${CONFIG.ENDPOINTS.CONVERSATIONS}${conversation.id}/`);
      setMessages(res.data.messages || []);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error: any) {
      console.log("Erreur fetch messages :", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Envoyer un message
  const sendMessage = async () => {
    if (!text.trim() || !conversation) return;

    try {
      setSending(true);
      await api.post(CONFIG.ENDPOINTS.MESSAGES, {
        conversation: conversation.id,
        sender_name: "Moi",
        content: text.trim(),
      });
      setText("");
      fetchMessages();
    } catch (error: any) {
      console.log("Erreur send message :", error.message || error);
      Alert.alert("Erreur", "Impossible d'envoyer le message.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000); // auto-refresh toutes les 5s
    return () => clearInterval(interval);
  }, [conversation]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender_name === "Moi";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!isMe && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.sender_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View
          style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          {!isMe && <Text style={styles.senderName}>{item.sender_name}</Text>}
          <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
            {item.content}
          </Text>
        </View>
        {isMe && (
          <View style={[styles.avatarContainer, styles.myAvatar]}>
            <Text style={styles.avatarText}>M</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>💬</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {conversation?.name || "Chat VIALI"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.headerStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>En ligne</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {loading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement des messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text style={styles.emptyTitle}>Aucun message</Text>
            <Text style={styles.emptyText}>
              Soyez le premier à envoyer un message
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Écrire un message..."
              placeholderTextColor={COLORS.gray}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!text.trim() || sending}
              activeOpacity={0.7}
            >
              {sending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.sendIcon}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
          {text.length > 400 && (
            <Text style={styles.charCount}>{text.length}/500</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "600",
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: "bold",
  },

  // Messages
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  myAvatar: {
    backgroundColor: COLORS.secondary,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "70%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: COLORS.white,
  },
  otherText: {
    color: COLORS.darkGray,
  },

  // Loading & Empty
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },

  // Input
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkGray,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "bold",
  },
  charCount: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: "right",
    marginTop: 6,
    fontWeight: "600",
  },
});