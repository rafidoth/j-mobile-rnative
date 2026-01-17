import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import NewQuestionsAdd from "@/components/sets/NewQuestionsAdd";
import { Alert } from "react-native";

export default function NewQuestionScreen() {
  const { setId } = useLocalSearchParams();

  const handleCreate = async (q: any) => {
    try {
      const payload: any = {
        setId: String(setId || ""),
        text: String(q?.text || ""),
        type: String(q?.type || "multiple_choice_questions"),
        difficulty: String(q?.difficulty || "easy"),
        choices: Array.isArray(q?.choices) ? q.choices : [],
        answer: String(q?.answer || ""),
        answerIdx: typeof q?.answerIdx === "number" ? q.answerIdx : 0,
        explanation: q?.explanation ?? "",
      };

      if (!payload.setId) {
        throw new Error("Missing setId in route params");
      }

      const resp = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        const msg = data?.error || "Failed to create question";
        throw new Error(msg);
      }

      Alert.alert("Success", "Question created", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.log("Create question failed", err);
      Alert.alert("Error", String(err?.message || "Failed to create question"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={18} color="#e5e7eb" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Question</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <NewQuestionsAdd onCreate={handleCreate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b", paddingTop: 40 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#334155",
    backgroundColor: "#121212",
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  backText: { color: "#e5e7eb" },
  title: { color: "#e5e7eb", fontWeight: "600" },
  content: { padding: 16 },
});
