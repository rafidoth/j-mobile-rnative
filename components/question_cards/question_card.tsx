import useExistingSetStore from "@/store/existingSetStore";
import McqCard from "./McqCard";
import TrueFalseCard from "./TrueFalseCard";
import ShortAnswerCard from "./ShortAnswerCard";
import FillInTheBlanksCard from "./FillInTheBlanksCard";
import { Text } from "react-native";

interface Props {
  question: any;
  position: number;
  selected: any;
  selectAnswer: (id: string | number, ans: any) => void;
  editQuestion: (questionId: string | number, updates: any) => void;
  deleteQuestion: (questionId: string | number) => void;
  editMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function QuestionCard({
  question: q,
  position,
  selected,
  selectAnswer,
  editQuestion,
  deleteQuestion,
  editMode = false,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: Props) {
  const showAnswer = useExistingSetStore((state: any) => state.showAnswer);

  // Handle missing or unknown types gracefully
  const type = q?.type;
  switch (type) {
    case "mcq":
    case "multiple_choice_questions":
      return (
        <McqCard
          question={q}
          showAnswer={showAnswer}
          position={position}
          selected={typeof selected === "number" ? selected : -1}
          selectAnswer={(id, ansIndex) => selectAnswer(id, ansIndex)}
          editQuestion={editQuestion}
          deleteQuestion={deleteQuestion}
          editMode={editMode}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={isFirst}
          isLast={isLast}
        />
      );
    case "short_question":
      return (
        <ShortAnswerCard
          question={q}
          showAnswer={showAnswer}
          position={position}
          selected={typeof selected === "string" ? selected : ""}
          selectAnswer={(id, ans) => selectAnswer(id, ans)}
          editMode={editMode}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={isFirst}
          isLast={isLast}
        />
      );
    case "fill_in_the_blanks":
      return (
        <FillInTheBlanksCard
          question={q}
          showAnswer={showAnswer}
          position={position}
          selected={typeof selected === "string" ? selected : ""}
          selectAnswer={(id, ans) => selectAnswer(id, ans)}
          editMode={editMode}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={isFirst}
          isLast={isLast}
        />
      );
    case "true_false":
      return (
        <TrueFalseCard
          question={q}
          showAnswer={showAnswer}
          position={position}
          selected={typeof selected === "string" ? selected : ""}
          selectAnswer={(id, ans) => selectAnswer(id, ans)}
          editMode={editMode}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={isFirst}
          isLast={isLast}
        />
      );
    default:
      console.warn("Unknown question type", type, q);
      return (
        // Minimal fallback so the item still renders
        // Helps diagnose data shape issues without a blank list
        // Uses basic fields if present
        // You can remove after aligning API types
        // eslint-disable-next-line react-native/no-inline-styles
        <>
          {/* Basic text fallback */}
          {/* @ts-ignore - Text is from react-native in parent */}
          <Text>
            {String(q?.id ?? position)} - {String((q as any)?.title ?? (q as any)?.question ?? "Untitled")}
          </Text>
        </>
      );
  }
}
