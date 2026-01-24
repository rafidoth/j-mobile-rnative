import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

export default function TrueFalseCard({
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

      <View style={styles.optionsWrap}>
        {q.choices?.map((c: string, idx: number) => {
          const isAnswer = idx === q.answerIdx;
          const isSelected = selected === c;
          return (
            <TouchableOpacity
              key={`${q.id}-choice-${idx}`}
              onPress={() => selectAnswer(q.id, c)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              {showAnswer && isAnswer ? (
                <View style={[styles.badge, styles.badgeDefault]}>
                  <Text style={[styles.badgeText, { color: "#fff" }]}>Correct</Text>
                </View>
              ) : (
                <View style={[styles.choiceBadge, styles.badgeOutline]}>
                  <Text style={styles.choiceBadgeText}>{String.fromCharCode(65 + idx)}</Text>
                </View>
              )}
              <Text style={styles.optionText}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
  optionsWrap: { gap: 8 },
  option: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", padding: 12, borderRadius: 10, backgroundColor: "#0b1220" },
  optionSelected: { borderColor: "#3b82f6", backgroundColor: "#11163a" },
  optionText: { flex: 1, color: "#e5e7eb" },
  choiceBadge: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 8, backgroundColor: "#111827" },
  choiceBadgeText: { textAlign: "center", fontWeight: "600", color: "#e5e7eb" },
  explainBlock: { marginTop: 10, gap: 6 },
  explainTitle: { fontWeight: "600", fontSize: 12, color: "#cbd5e1" },
  explainCard: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#334155", borderRadius: 10, padding: 10, backgroundColor: "#0b1220" },
  explainText: { fontSize: 12, color: "#94a3b8" },
});
