import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Sparkles, MessageSquare, Send } from "lucide-react-native";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! Ask me to generate exam questions, or tap the button below.",
    },
  ]);
  const [input, setInput] = useState("");
  const placeholder = "Make me 15 questions of Introduction to Semiconductor";
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const addUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: String(Date.now()),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const onGeneratePress = () => {
    addUserMessage(input);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.role === "user" ? styles.userWrapper : styles.assistantWrapper,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.role === "user" ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <View style={styles.bubbleHeader}>
          <MessageSquare
            size={14}
            color={item.role === "user" ? "#93c5fd" : "#a5b4fc"}
          />
          <Text
            style={[
              styles.bubbleTitle,
              item.role === "user" ? styles.userTitle : styles.assistantTitle,
            ]}
          >
            {item.role === "user" ? "You" : "AI"}
          </Text>
        </View>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={20} color="#a5b4fc" />
        <Text style={styles.headerTitle}>Jigao AI</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.inputRow, { position: "relative" }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor="#9aa0b2"
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, input.trim() ? null : { opacity: 0.5 }]}
          onPress={onGeneratePress}
          activeOpacity={0.7}
          disabled={!input.trim()}
        >
          <Send size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: "#e5e7eb",
    fontWeight: "800",
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 112,
    gap: 10,
  },
  messageWrapper: {
    maxWidth: "92%",
  },
  userWrapper: {
    alignSelf: "flex-end",
  },
  assistantWrapper: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: "#172033",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2b44",
  },
  assistantBubble: {
    backgroundColor: "#111827",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2937",
  },
  bubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  bubbleTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  userTitle: {
    color: "#93c5fd",
  },
  assistantTitle: {
    color: "#a5b4fc",
  },
  messageText: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "#0A0A0A",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1f2937",
    gap: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2937",
    backgroundColor: "#0b0f1a",
    color: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 46,
    maxHeight: 120,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginLeft: 8,
    backgroundColor: "#0f172a",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20,
    bottom: 25,
  },
  generateBtnText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
