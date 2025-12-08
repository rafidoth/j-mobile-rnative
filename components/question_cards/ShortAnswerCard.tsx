import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import type { ShortQuestion } from "@/types/questions";
import { typeLabel } from "./CardUtils";

interface Props {
  question: ShortQuestion;
  showAnswer: boolean;
  position: number;
  selected: string;
  selectAnswer: (id: string, ans: string) => void;
}

function difficultyColor(d: string) {
  const key = String(d || "").toLowerCase();
  if (key === "easy") return { backgroundColor: "#059669", color: "#ecfeff" };
  if (key === "medium") return { backgroundColor: "#f59e0b", color: "#1f2937" };
  if (key === "hard") return { backgroundColor: "#e11d48", color: "#fdf2f8" };
  return { backgroundColor: "#e5e7eb", color: "#111827" };
}

export default function ShortAnswerCard({ question: q, showAnswer, position, selected, selectAnswer }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, difficultyColor(q.difficulty)]}>
          <Text style={[styles.badgeText, { color: difficultyColor(q.difficulty).color }]}>{typeLabel(q.difficulty)}</Text>
        </View>
        <View style={[styles.badge, styles.badgeOutline]}>
          <Text style={styles.badgeText}>{typeLabel(q.type)}</Text>
        </View>
      </View>
      <Text style={styles.questionText}>{position}. {q.text}</Text>

      <TextInput
        placeholder="Write your answer…"
        value={selected}
        onChangeText={(t) => selectAnswer(q.id, t)}
        style={styles.input}
      />

      {q.type === "short_question" && showAnswer && (
        <View style={styles.explainBlock}>
          <Text style={styles.explainTitle}>Answer</Text>
          <View style={styles.explainCard}>
            <Text style={styles.explainText}>{q.answerText || "No answer provided."}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#0f172a", borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 14, padding: 14, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  badgeOutline: { backgroundColor: "#1f2937" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#e5e7eb" },
  questionText: { fontSize: 16, fontWeight: "600", color: "#e5e7eb" },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 10, padding: 12, color: "#e5e7eb", backgroundColor: "#0b1220" },
  explainBlock: { marginTop: 10, gap: 6 },
  explainTitle: { fontWeight: "600", fontSize: 12, color: "#cbd5e1" },
  explainCard: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 10, padding: 10, backgroundColor: "#0b1220" },
  explainText: { fontSize: 12, color: "#94a3b8" },
});
