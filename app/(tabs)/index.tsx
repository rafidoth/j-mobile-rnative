import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Sparkles, MessageSquare, Send, Loader2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useSession } from "../../context/AuthContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

export default function Index() {
  const router = useRouter();
  const { currentUser } = useSession();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I can generate exam questions for you. Enter a topic or context below, specify how many questions you want, and tap Generate!",
    },
  ]);

  // Form state
  const [context, setContext] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);

  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const addMessage = (role: "user" | "assistant", content: string, isLoading = false) => {
    const msg: Message = {
      id: String(Date.now()) + Math.random(),
      role,
      content,
      isLoading,
    };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  };

  const updateMessage = (id: string, content: string, isLoading = false) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content, isLoading } : m))
    );
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const onGeneratePress = async () => {
    const trimmedContext = context.trim();
    const count = parseInt(questionCount, 10);

    // Validate inputs
    if (!trimmedContext) {
      addMessage("assistant", "Please enter a topic or context for the questions.");
      return;
    }

    if (isNaN(count) || count < 1 || count > 50) {
      addMessage("assistant", "Please enter a valid number of questions (1-50).");
      return;
    }

    if (!currentUser?.id) {
      addMessage("assistant", "Please sign in to generate questions.");
      return;
    }

    // Add user message showing what they requested
    addMessage("user", `Generate ${count} questions about: "${trimmedContext}"`);

    // Add loading message
    const loadingId = addMessage("assistant", "Generating questions...", true);

    setIsGenerating(true);

    try {
      const response = await axios.post("/api/generate-questions", {
        questionQuantity: count,
        context: trimmedContext,
        userId: currentUser.id,
      });

      const { set_id, title, question_count } = response.data;

      // Update loading message with success
      updateMessage(
        loadingId,
        `Created "${title}" with ${question_count} questions! Redirecting...`,
        false
      );

      // Clear form
      setContext("");
      setQuestionCount("5");

      // Navigate to the new set after a brief delay
      setTimeout(() => {
        router.push(`/sets/${set_id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Generation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate questions. Please try again.";
      updateMessage(loadingId, `Error: ${errorMessage}`, false);
    } finally {
      setIsGenerating(false);
    }
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
          {item.isLoading ? (
            <ActivityIndicator size="small" color="#a5b4fc" />
          ) : (
            <MessageSquare
              size={14}
              color={item.role === "user" ? "#93c5fd" : "#a5b4fc"}
            />
          )}
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

  const canGenerate = context.trim() && !isGenerating;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
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

      <View style={styles.inputSection}>
        {/* Question count input */}
        <View style={styles.countRow}>
          <Text style={styles.label}>Number of questions:</Text>
          <TextInput
            value={questionCount}
            onChangeText={setQuestionCount}
            placeholder="5"
            placeholderTextColor="#9aa0b2"
            style={styles.countInput}
            keyboardType="number-pad"
            maxLength={2}
            editable={!isGenerating}
          />
        </View>

        {/* Context/Topic input */}
        <View style={styles.contextRow}>
          <TextInput
            value={context}
            onChangeText={setContext}
            placeholder="Enter topic or paste your study material..."
            placeholderTextColor="#9aa0b2"
            style={styles.contextInput}
            multiline
            numberOfLines={3}
            editable={!isGenerating}
          />
          <TouchableOpacity
            style={[styles.sendBtn, canGenerate ? null : styles.sendBtnDisabled]}
            onPress={onGeneratePress}
            activeOpacity={0.7}
            disabled={!canGenerate}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#94a3b8" />
            ) : (
              <Send size={18} color={canGenerate ? "#a5b4fc" : "#4b5563"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
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
  inputSection: {
    padding: 14,
    backgroundColor: "#0A0A0A",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1f2937",
    gap: 12,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    color: "#9ca3af",
    fontSize: 14,
  },
  countInput: {
    width: 60,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2937",
    backgroundColor: "#0b0f1a",
    color: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: "center",
    fontSize: 16,
  },
  contextRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  contextInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1f2937",
    backgroundColor: "#0b0f1a",
    color: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: "top",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#0f172a",
    borderColor: "#1f2937",
  },
});
