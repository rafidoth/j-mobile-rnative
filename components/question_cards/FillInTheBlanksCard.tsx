import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { typeLabel } from "./CardUtils";
import { ChevronUp, ChevronDown } from "lucide-react-native";

interface Props {
  question: any;
  showAnswer: boolean;
  position: number;
  selected: string;
  selectAnswer: (id: string, ans: string) => void;
  editMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function difficultyColor(d: string) {
  const key = String(d || "").toLowerCase();
  if (key === "easy") return { backgroundColor: "#059669", color: "#ecfeff" };
  if (key === "medium") return { backgroundColor: "#f59e0b", color: "#1f2937" };
  if (key === "hard") return { backgroundColor: "#e11d48", color: "#fdf2f8" };
  return { backgroundColor: "#e5e7eb", color: "#111827" };
}

export default function FillInTheBlanksCard({
  question: q,
  showAnswer,
  position,
  selected,
  selectAnswer,
  editMode = false,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: Props) {
  const isCorrect = q.choices.some((choice: string) => choice === selected);
  const isEmpty = selected === "";
  return (
    <View style={styles.card}>
      {/* Reorder buttons - shown only in edit mode */}
      {editMode && (
        <View style={styles.reorderRow}>
          <TouchableOpacity
            onPress={onMoveUp}
            disabled={isFirst}
            style={[styles.reorderBtn, isFirst && styles.reorderBtnDisabled]}
            accessibilityLabel="Move question up"
            activeOpacity={0.7}
          >
            <ChevronUp size={20} color={isFirst ? "#4b5563" : "#e5e7eb"} />
          </TouchableOpacity>
          <Text style={styles.reorderPositionText}>Position {position}</Text>
          <TouchableOpacity
            onPress={onMoveDown}
            disabled={isLast}
            style={[styles.reorderBtn, isLast && styles.reorderBtnDisabled]}
            accessibilityLabel="Move question down"
            activeOpacity={0.7}
          >
            <ChevronDown size={20} color={isLast ? "#4b5563" : "#e5e7eb"} />
          </TouchableOpacity>
        </View>
      )}

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
        style={[styles.input, isCorrect ? styles.inputCorrect : !isEmpty ? styles.inputWrong : null]}
      />

      {showAnswer && (
        <View style={styles.answerBlock}>
          <Text style={styles.explainTitle}>Answer</Text>
          <View style={styles.answerList}>
            {q.choices?.map((c: string, idx: number) => (
              <View key={`${q.id}-choice-${idx}`} style={[styles.answerRow]}>
                <View style={[styles.badge, styles.badgeDefault]}>
                  <Text style={[styles.badgeText, { color: "#fff" }]}>Correct</Text>
                </View>
                <Text>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {showAnswer && q.explanation ? (
        <View style={styles.explainBlock}>
          <Text style={styles.explainTitle}>Explanation</Text>
          <View style={styles.explainCard}>
            <Text style={styles.explainText}>{q.explanation}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#0f172a", borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 14, padding: 14, gap: 10 },
  reorderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#334155",
    marginBottom: 4,
  },
  reorderBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  reorderBtnDisabled: {
    opacity: 0.4,
    backgroundColor: "#111827",
  },
  reorderPositionText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  badgeOutline: { backgroundColor: "#1f2937" },
  badgeDefault: { backgroundColor: "#16a34a" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#e5e7eb" },
  questionText: { fontSize: 16, fontWeight: "600", color: "#e5e7eb" },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 10, padding: 12, color: "#e5e7eb", backgroundColor: "#0b1220" },
  inputCorrect: { borderColor: "#16a34a", backgroundColor: "#0c1b14" },
  inputWrong: { borderColor: "#ef4444", backgroundColor: "#1a0b0b" },
  answerBlock: { marginTop: 10, gap: 6 },
  answerList: { gap: 6 },
  answerRow: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "#14532d", padding: 8, borderRadius: 8, backgroundColor: "#052e1b" },
  explainBlock: { marginTop: 10, gap: 6 },
  explainTitle: { fontWeight: "600", fontSize: 12, color: "#cbd5e1" },
  explainCard: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 10, padding: 10, backgroundColor: "#0b1220" },
  explainText: { fontSize: 12, color: "#94a3b8" },
});
