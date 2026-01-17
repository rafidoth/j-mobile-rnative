import useExistingSetStore from "@/store/existingSetStore";
import McqCard from "./McqCard";
import TrueFalseCard from "./TrueFalseCard";
import ShortAnswerCard from "./ShortAnswerCard";
import FillInTheBlanksCard from "./FillInTheBlanksCard";
import { Text } from "react-native";
import type { Question } from "@/types/questions";

interface Props {
  question: Question;
  position: number;
  selected: string;
  selectAnswer: (id: string, ans: string) => void;
  editQuestion: (questionId: string | number, updates: any) => void;
  deleteQuestion: (questionId: string | number) => void;
}

export default function QuestionCard({
  question: q,
  position,
  selected,
  selectAnswer,
  editQuestion,
  deleteQuestion,
}: Props) {
  const showAnswer = useExistingSetStore((state: any) => state.showAnswer);

  // Handle missing or unknown types gracefully
  const type = q?.type;
  switch (type) {
    case "multiple_choice_questions":
      return (
        <McqCard
          question={q as any}
          showAnswer={showAnswer}
          position={position}
          selected={selected}
          selectAnswer={selectAnswer}
          editQuestion={editQuestion}
          deleteQuestion={deleteQuestion}
        />
      );
    case "short_question":
      return (
        <ShortAnswerCard
          question={q as any}
          showAnswer={showAnswer}
          position={position}
          selected={selected}
          selectAnswer={selectAnswer}
        />
      );
    case "fill_in_the_blanks":
      return (
        <FillInTheBlanksCard
          question={q as any}
          showAnswer={showAnswer}
          position={position}
          selected={selected}
          selectAnswer={selectAnswer}
        />
      );
    case "true_false":
      return (
        <TrueFalseCard
          question={q as any}
          showAnswer={showAnswer}
          position={position}
          selected={selected}
          selectAnswer={selectAnswer}
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
