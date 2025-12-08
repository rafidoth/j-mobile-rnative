import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { create } from "zustand";

// Local type definitions to avoid missing module resolution
type Difficulty = "easy" | "medium" | "hard";
type QuestionKind =
  | "multiple_choice_questions"
  | "true_false"
  | "short_question"
  | "fill_in_the_blanks";

// Difficulty levels supported in UI
const difficultyLevels: Difficulty[] = ["easy", "medium", "hard"];

// Question type metadata used for selection UI
const questionTypes: {
  value: QuestionKind;
  label: string;
  description: string;
}[] = [
  {
    value: "multiple_choice_questions",
    label: "Multiple Choice",
    description: "There will be 4 options and 1 correct answer.",
  },
  {
    value: "true_false",
    label: "True / False",
    description: "There will be 2 options: True and False.",
  },
  {
    value: "short_question",
    label: "Short Question",
    description: "Participant will type a short text as answer.",
  },
  {
    value: "fill_in_the_blanks",
    label: "Fill in the Blank",
    description:
      "There should be a ___ in the question and one correct answer for that.",
  },
];

interface CreateNewQuestionStoreState {
  reset: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;

  questionText: string;
  setQuestionText: (t: string) => void;

  questionType: QuestionKind;
  setQuestionType: (t: QuestionKind) => void;

  mcq: { choices: string[]; correctAnswer: number };
  setChoice: (index: number, value: string) => void;
  setMcqCorrectAnswer: (index: number) => void;

  trueFalse: { choices: [string, string]; correctAnswer: number };
  setTrueFalseCorrectAnswer: (index: number) => void;

  fillInTheBlanks: { correctAnswers: string[] };
  addFillInTheBlanksAnswer: (answer: string) => void;

  shortAnswer: { estimatedCorrectAnswer: string };
  setShortAnswerEstimatedCorrectAnswer: (t: string) => void;

  answerExplanation: string;
  setAnswerExplanation: (t: string) => void;
}

const CreateNewQuestionStore = (
  set: any,
  _get: any,
  store: any,
): CreateNewQuestionStoreState => ({
  reset: () => set(store.getInitialState()),
  difficulty: "easy",
  setDifficulty: (d) => set({ difficulty: d }),

  questionText: "",
  setQuestionText: (t) => set({ questionText: t }),

  questionType: "multiple_choice_questions",
  setQuestionType: (t) => set({ questionType: t }),

  mcq: {
    choices: ["", "", "", ""],
    correctAnswer: Math.floor(Math.random() * 4),
  },
  setChoice: (index, value) =>
    set((state: CreateNewQuestionStoreState) => {
      const newChoices = [...state.mcq.choices];
      newChoices[index] = value;
      return { mcq: { ...state.mcq, choices: newChoices } };
    }),
  setMcqCorrectAnswer: (index) =>
    set((state: CreateNewQuestionStoreState) => ({
      mcq: { ...state.mcq, correctAnswer: index },
    })),

  trueFalse: {
    choices: ["True", "False"],
    correctAnswer: Math.floor(Math.random() * 2),
  },
  setTrueFalseCorrectAnswer: (index) =>
    set((state: CreateNewQuestionStoreState) => ({
      trueFalse: { ...state.trueFalse, correctAnswer: index },
    })),

  fillInTheBlanks: { correctAnswers: [] },
  addFillInTheBlanksAnswer: (answer) =>
    set((state: CreateNewQuestionStoreState) => ({
      fillInTheBlanks: {
        correctAnswers: [...state.fillInTheBlanks.correctAnswers, answer],
      },
    })),

  shortAnswer: { estimatedCorrectAnswer: "" },
  setShortAnswerEstimatedCorrectAnswer: (t) =>
    set((state: CreateNewQuestionStoreState) => ({
      shortAnswer: { ...state.shortAnswer, estimatedCorrectAnswer: t },
    })),

  answerExplanation: "",
  setAnswerExplanation: (t) => set({ answerExplanation: t }),
});

const useCreateNewQuestionStore = create<CreateNewQuestionStoreState>(
  CreateNewQuestionStore,
);

function DifficultySelector() {
  const difficulty = useCreateNewQuestionStore((s) => s.difficulty);
  const setDifficulty = useCreateNewQuestionStore((s) => s.setDifficulty);
  return (
    <View style={rnStyles.rowWrap}>
      {difficultyLevels.map((level) => {
        const active = difficulty === level;
        return (
          <TouchableOpacity
            key={level}
            onPress={() => setDifficulty(level)}
            style={[
              rnStyles.diffPill,
              active ? rnStyles.diffPillActive : rnStyles.diffPillInactive,
            ]}
          >
            <Text
              style={[
                rnStyles.diffPillText,
                active && rnStyles.diffPillTextActive,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function QuestionTypeSelector() {
  const questionType = useCreateNewQuestionStore((s) => s.questionType);
  const setQuestionType = useCreateNewQuestionStore((s) => s.setQuestionType);
  const [open, setOpen] = useState(false);

  const current = questionTypes.find((q) => q.value === questionType);

  return (
    <View style={rnStyles.dropdown}>
      <TouchableOpacity
        style={rnStyles.dropdownTrigger}
        onPress={() => setOpen((v) => !v)}
        accessibilityLabel="Select question type"
      >
        <View style={{ flex: 1 }}>
          <Text style={rnStyles.cardTitle}>
            {current?.label || "Select type"}
          </Text>
          {current?.description ? (
            <Text style={rnStyles.cardDesc}>{current.description}</Text>
          ) : null}
        </View>
        <Text style={rnStyles.dropdownCaret}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={rnStyles.dropdownList}>
          {questionTypes.map((qt) => {
            const isActive = qt.value === questionType;
            return (
              <TouchableOpacity
                key={qt.value}
                onPress={() => {
                  setQuestionType(qt.value);
                  setOpen(false);
                }}
                style={[
                  rnStyles.dropdownItem,
                  isActive && rnStyles.dropdownItemActive,
                ]}
              >
                <Text style={rnStyles.dropdownItemTitle}>{qt.label}</Text>
                <Text style={rnStyles.dropdownItemDesc}>{qt.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

function MCQInputs() {
  const choices = useCreateNewQuestionStore((s) => s.mcq.choices);
  const correctAnswer = useCreateNewQuestionStore((s) => s.mcq.correctAnswer);
  const setChoice = useCreateNewQuestionStore((s) => s.setChoice);
  const setCorrect = useCreateNewQuestionStore((s) => s.setMcqCorrectAnswer);
  const questionText = useCreateNewQuestionStore((s) => s.questionText);
  const setQuestionText = useCreateNewQuestionStore((s) => s.setQuestionText);
  return (
    <View style={rnStyles.columnGap}>
      <TextInput
        placeholder="Enter question text"
        value={questionText}
        onChangeText={setQuestionText}
        style={rnStyles.input}
        placeholderTextColor="#94a3b8"
      />
      <View style={rnStyles.columnGap}>
        {choices.map((c, i) => {
          const active = correctAnswer === i;
          return (
            <View key={i} style={rnStyles.columnGapSmall}>
              <View style={rnStyles.rowGap}>
                <TouchableOpacity
                  onPress={() => setCorrect(i)}
                  style={[
                    rnStyles.choiceBtn,
                    active
                      ? rnStyles.choiceBtnActive
                      : rnStyles.choiceBtnInactive,
                  ]}
                >
                  <Text style={rnStyles.choiceBtnText}>C{i + 1}</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder={`Choice ${i + 1}`}
                  value={c}
                  onChangeText={(t) => setChoice(i, t)}
                  style={[rnStyles.input, { flex: 1 }]}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function TrueFalseInputs() {
  const choices = useCreateNewQuestionStore((s) => s.trueFalse.choices);
  const correctAnswer = useCreateNewQuestionStore(
    (s) => s.trueFalse.correctAnswer,
  );
  const setTrueFalseCorrectAnswer = useCreateNewQuestionStore(
    (s) => s.setTrueFalseCorrectAnswer,
  );
  const setQuestionText = useCreateNewQuestionStore((s) => s.setQuestionText);
  return (
    <View style={rnStyles.columnGap}>
      <TextInput
        placeholder="Enter the statement"
        onChangeText={setQuestionText}
        style={rnStyles.input}
        placeholderTextColor="#94a3b8"
      />
      <View style={rnStyles.gridTwo}>
        {choices.map((choice, index) => {
          const active = correctAnswer === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setTrueFalseCorrectAnswer(index)}
              style={[
                rnStyles.selectBtn,
                active ? rnStyles.selectBtnActive : rnStyles.selectBtnInactive,
              ]}
            >
              <Text style={rnStyles.selectBtnText}>{choice}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function FillInTheBlanksInputs() {
  const correctAnswers = useCreateNewQuestionStore(
    (s) => s.fillInTheBlanks.correctAnswers,
  );
  const addAnswer = useCreateNewQuestionStore(
    (s) => s.addFillInTheBlanksAnswer,
  );
  const setQuestionText = useCreateNewQuestionStore((s) => s.setQuestionText);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  const handleAddAnswer = () => {
    if (current.trim() === "") {
      setError("Answer cannot be empty");
      return;
    }
    if (correctAnswers.includes(current.trim())) {
      setError("Answer already exists");
      return;
    }
    if (correctAnswers.length >= 8) {
      setError("Maximum of 8 answers allowed");
      return;
    }
    addAnswer(current.trim());
    setCurrent("");
    setError("");
  };

  return (
    <View style={rnStyles.columnGap}>
      <TextInput
        placeholder="Enter the statement"
        onChangeText={setQuestionText}
        style={rnStyles.input}
        placeholderTextColor="#94a3b8"
      />
      {correctAnswers.length > 0 && (
        <View style={rnStyles.rowWrap}>
          {correctAnswers.map((ans, i) => (
            <View key={i} style={rnStyles.badge}>
              <Text style={rnStyles.badgeText}>{ans}</Text>
            </View>
          ))}
        </View>
      )}
      <TextInput
        placeholder="Add a correct answer"
        value={current}
        onChangeText={setCurrent}
        style={rnStyles.input}
        placeholderTextColor="#94a3b8"
      />
      <View style={rnStyles.rowGap}>
        <TouchableOpacity
          onPress={handleAddAnswer}
          style={rnStyles.secondaryBtn}
        >
          <Text style={rnStyles.secondaryBtnText}>Add Answer</Text>
        </TouchableOpacity>
        <Text style={rnStyles.errorText}>{error}</Text>
      </View>
    </View>
  );
}

function ShortAnswerInputs() {
  const estimatedCorrectAnswer = useCreateNewQuestionStore(
    (s) => s.shortAnswer.estimatedCorrectAnswer,
  );
  const questionText = useCreateNewQuestionStore((s) => s.questionText);
  const setQuestionText = useCreateNewQuestionStore((s) => s.setQuestionText);
  const setShortAnswerEstimatedCorrectAnswer = useCreateNewQuestionStore(
    (s) => s.setShortAnswerEstimatedCorrectAnswer,
  );
  return (
    <View style={rnStyles.columnGap}>
      <TextInput
        placeholder="Enter question text"
        value={questionText}
        onChangeText={setQuestionText}
        style={rnStyles.input}
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        placeholder="Enter the estimated correct answer"
        value={estimatedCorrectAnswer}
        onChangeText={setShortAnswerEstimatedCorrectAnswer}
        style={[rnStyles.input, { minHeight: 60 }]}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

function getChoicesBasedOnQuestionType(
  questionType: QuestionKind,
  state: CreateNewQuestionStoreState,
) {
  switch (questionType) {
    case "multiple_choice_questions":
      return state.mcq.choices;
    case "true_false":
      return state.trueFalse.choices;
    case "short_question":
      return [];
    case "fill_in_the_blanks":
      return state.fillInTheBlanks.correctAnswers;
    default:
      return [];
  }
}

function getCorrectAnswerBasedOnQuestionType(
  questionType: QuestionKind,
  state: CreateNewQuestionStoreState,
) {
  switch (questionType) {
    case "multiple_choice_questions":
      return state.mcq.choices[state.mcq.correctAnswer];
    case "true_false":
      return state.trueFalse.choices[state.trueFalse.correctAnswer];
    case "short_question":
      return state.shortAnswer.estimatedCorrectAnswer;
    case "fill_in_the_blanks":
      return state.fillInTheBlanks.correctAnswers.join(",");
    default:
      return "";
  }
}

function validateInputs(
  questionType: QuestionKind,
  questionText: string,
  choices: string[],
  correctAnswer: string,
) {
  let error = "";
  if (!questionText || questionText.trim() === "") {
    error = "Question text cannot be empty";
  }
  if (questionType === "multiple_choice_questions") {
    if (choices.length < 4 || choices.some((c) => c.trim() === "")) {
      error = "All 4 choices must be filled out";
    }
    if (!correctAnswer || correctAnswer.trim() === "") {
      error = "A correct answer must be selected";
    }
  }
  if (questionType === "true_false") {
    if (!correctAnswer || correctAnswer.trim() === "") {
      error = "A correct answer must be selected";
    }
  }
  if (questionType === "fill_in_the_blanks") {
    if (choices.length === 0) {
      error = "At least one correct answer must be added";
    }
  }
  const isError = error !== "";
  return { error, isError };
}

export default function NewQuestionsAdd({
  onCreate,
}: {
  onCreate: (q: any) => void;
}) {
  const difficulty = useCreateNewQuestionStore((s) => s.difficulty);
  const questionType = useCreateNewQuestionStore((s) => s.questionType);
  const questionText = useCreateNewQuestionStore((s) => s.questionText);
  const state = useCreateNewQuestionStore();
  const choices = getChoicesBasedOnQuestionType(questionType, state);
  const correctAnswer = getCorrectAnswerBasedOnQuestionType(
    questionType,
    state,
  );
  const explanation = useCreateNewQuestionStore((s) => s.answerExplanation);
  const setExplanation = useCreateNewQuestionStore(
    (s) => s.setAnswerExplanation,
  );
  const [error, setError] = useState("");

  let inputs: React.ReactNode = null;
  switch (questionType) {
    case "multiple_choice_questions":
      inputs = <MCQInputs />;
      break;
    case "true_false":
      inputs = <TrueFalseInputs />;
      break;
    case "short_question":
      inputs = <ShortAnswerInputs />;
      break;
    case "fill_in_the_blanks":
      inputs = <FillInTheBlanksInputs />;
      break;
    default:
      break;
  }

  const resetStates = useCreateNewQuestionStore((s) => s.reset);

  const handleCreateQuestion = () => {
    const { error, isError } = validateInputs(
      questionType,
      questionText,
      choices,
      correctAnswer,
    );
    if (isError) {
      setError(error);
      return;
    }
    setError("");

    const id = String(Date.now());
    let questionPayload: any = {
      id,
      type: questionType,
      text: questionText,
      difficulty,
      explanation,
    };

    if (questionType === "multiple_choice_questions") {
      const answerIdx = state.mcq.correctAnswer;
      questionPayload.choices = [...choices];
      questionPayload.answer = correctAnswer;
      questionPayload.answerIdx = answerIdx;
    } else if (questionType === "true_false") {
      const answerIdx = state.trueFalse.correctAnswer;
      questionPayload.choices = [...choices];
      questionPayload.answer = correctAnswer;
      questionPayload.answerIdx = answerIdx;
    } else if (questionType === "short_question") {
      questionPayload.answerText = correctAnswer;
    } else if (questionType === "fill_in_the_blanks") {
      questionPayload.choices = [...choices];
    }

    onCreate(questionPayload);
    resetStates();
  };

  return (
    <View style={rnStyles.container}>
      <QuestionTypeSelector />
      <View style={{ height: 12 }} />
      {inputs}
      <View style={rnStyles.fieldGroup}>
        <Text style={rnStyles.label}>Difficulty</Text>
        <DifficultySelector />
      </View>
      <View style={rnStyles.fieldGroup}>
        <Text style={rnStyles.label}>Answer Explanation (optional)</Text>
        <TextInput
          placeholder="Explain the correct answer for participants"
          value={explanation}
          onChangeText={setExplanation}
          style={rnStyles.input}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <TouchableOpacity
        onPress={handleCreateQuestion}
        style={[rnStyles.primaryBtn, { marginTop: 20 }]}
      >
        <Text style={rnStyles.primaryBtnText}>Create Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const rnStyles = StyleSheet.create({
  container: { width: "100%", height: "100%", padding: 16 },
  title: { fontSize: 18, fontWeight: "600", color: "white", marginBottom: 12 },
  fieldGroup: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: "500", color: "white", marginBottom: 8 },
  input: {
    height: 40,
    width: "100%",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "white",
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridTwo: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  card: {
    flexBasis: "48%",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#1c1c1c",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  cardActive: { borderColor: "#3b82f6" },
  cardTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  cardDesc: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  diffPill: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  diffPillActive: { backgroundColor: "#0b1220", borderColor: "#3b82f6" },
  diffPillInactive: {},
  diffPillText: { color: "white", fontSize: 12 },
  diffPillTextActive: { color: "#3b82f6" },
  columnGap: { gap: 12 },
  columnGapSmall: { gap: 8 },
  rowGap: { flexDirection: "row", alignItems: "center", gap: 8 },
  choiceBtn: {
    height: 36,
    minWidth: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  choiceBtnActive: { borderColor: "#3b82f6", backgroundColor: "#0b1220" },
  choiceBtnInactive: { borderColor: "#334155" },
  choiceBtnText: { color: "white", fontSize: 12, fontWeight: "600" },
  selectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectBtnActive: { borderColor: "#3b82f6", backgroundColor: "#0b1220" },
  selectBtnInactive: { borderColor: "#334155" },
  selectBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#0b1220",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  badgeText: { color: "white", fontSize: 12 },
  secondaryBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  secondaryBtnText: { color: "white", fontSize: 14 },
  errorText: { color: "#ef4444", fontSize: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
  },
  primaryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
  dropdown: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#121212",
  },
  dropdownCaret: { color: "#94a3b8", fontSize: 12, paddingHorizontal: 6 },
  dropdownList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#334155",
    backgroundColor: "#0b1220",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1f2937",
  },
  dropdownItemActive: { backgroundColor: "#11163a" },
  dropdownItemTitle: { color: "#e5e7eb", fontSize: 14, fontWeight: "600" },
  dropdownItemDesc: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
});
