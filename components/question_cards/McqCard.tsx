import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
// Removed missing type import; using inline types
import { typeLabel } from "./CardUtils";
import { Trash } from "lucide-react-native";

interface Props {
  question: any;
  showAnswer: boolean;
  position: number;
  selected: string;
  selectAnswer: (id: string, ans: string) => void;
  editQuestion: (questionId: string | number, updates: any) => void;
  deleteQuestion: (questionId: string | number) => void;
}

function difficultyColor(d: string) {
  const key = String(d || "").toLowerCase();
  if (key === "easy") return { backgroundColor: "#059669", color: "#ecfeff" };
  if (key === "medium") return { backgroundColor: "#f59e0b", color: "#1f2937" };
  if (key === "hard") return { backgroundColor: "#e11d48", color: "#fdf2f8" };
  return { backgroundColor: "#e5e7eb", color: "#111827" };
}

export default function McqCard({
  question: q,
  showAnswer,
  position,
  selected,
  selectAnswer,
  editQuestion,
  deleteQuestion,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(q.text);
  const [draftChoices, setDraftChoices] = useState<string[]>(q.choices || []);

  const handleEditPress = () => {
    if (!isEditing) {
      setIsEditing(true);
      setDraftText(q.text);
      setDraftChoices(q.choices || []);
      return;
    }
    // Done pressed: submit updates
    const updates = { text: draftText, choices: draftChoices };
    editQuestion(q.id, updates);
    setIsEditing(false);
  };

  const setChoiceAt = (idx: number, value: string) => {
    setDraftChoices((prev) => prev.map((c, i) => (i === idx ? value : c)));
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, difficultyColor(q.difficulty)]}>
          <Text
            style={[
              styles.badgeText,
              { color: difficultyColor(q.difficulty).color },
            ]}
          >
            {typeLabel(q.difficulty)}
          </Text>
        </View>
        <View style={[styles.badge, styles.badgeOutline]}>
          <Text style={styles.badgeText}>{typeLabel(q.type)}</Text>
        </View>
        <View style={{ marginLeft: "auto", flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={handleEditPress}
            style={[styles.editBtn, isEditing && styles.doneBtn]}
            activeOpacity={0.8}
          >
            <Text style={[styles.editBtnText, isEditing && styles.doneBtnText]}>
              {isEditing ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteQuestion(q.id)}
            style={styles.trashBtn}
            accessibilityLabel="Delete question"
            activeOpacity={0.8}
          >
            <Trash size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <TextInput
          value={draftText}
          onChangeText={setDraftText}
          style={styles.questionInput}
          multiline
        />
      ) : (
        <Text style={styles.questionText}>
          {position}. {q.text}
        </Text>
      )}

      <View style={styles.optionsWrap}>
        {(isEditing ? draftChoices : q.choices)?.map(
          (c: string, idx: number) => {
            const isAnswer = idx === q.answerIdx;
            const isSelected = selected === c;
            return (
              <View
                key={`${q.id}-choice-${idx}`}
                style={[
                  styles.option,
                  !isEditing && isSelected && (isAnswer ? styles.optionCorrect : styles.optionSelected),
                ]}
              >
                <View style={[styles.choiceBadge, styles.badgeOutline]}>
                  <Text style={styles.choiceBadgeText}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    value={c}
                    onChangeText={(t) => setChoiceAt(idx, t)}
                    style={styles.optionInput}
                  />
                ) : (
                  <TouchableOpacity onPress={() => selectAnswer(q.id, c)} style={styles.optionInner}>
                    <Text style={styles.optionText}>{c}</Text>
                    {showAnswer && isAnswer ? (
                      <View style={[styles.badge, styles.badgeDefault]}>
                        <Text style={[styles.badgeText, { color: "#fff" }]}>Correct</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                )}
              </View>
            );
          },
        )}
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
  card: {
    backgroundColor: "#121212",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  badgeOutline: { backgroundColor: "#1f2937" },
  badgeDefault: { backgroundColor: "#16a34a" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#e5e7eb" },

  editBtn: {
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  editBtnText: { color: "#e5e7eb", fontWeight: "600" },
  doneBtn: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  doneBtnText: { color: "#ffffff" },

  trashBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  questionText: { fontSize: 16, fontWeight: "600", color: "#e5e7eb" },
  questionInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#1c1c1c",
  },

  optionsWrap: { gap: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#1c1c1c",
  },
  optionInner: { flex: 1, flexDirection: "row", alignItems: "center" },
  optionSelected: { borderColor: "#D70040", backgroundColor: "#D7004030" },
  optionCorrect: { borderColor: "#16a34a", backgroundColor: "#0c1b14" },
  optionText: { flex: 1, color: "#e5e7eb" },
  optionInput: {
    flex: 1,
    color: "#e5e7eb",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#111827",
  },

  choiceBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  choiceBadgeText: { textAlign: "center", fontWeight: "600", color: "#e5e7eb" },
  explainBlock: { marginTop: 10, gap: 6 },
  explainTitle: { fontWeight: "600", fontSize: 12, color: "#cbd5e1" },
  explainCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#121212",
  },
  explainText: { fontSize: 12, color: "#94a3b8" },
});
