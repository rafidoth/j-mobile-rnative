import useExistingSetStore from "@/store/existingSetStore";
import McqCard from "./McqCard";
import TrueFalseCard from "./TrueFalseCard";
import ShortAnswerCard from "./ShortAnswerCard";
import FillInTheBlanksCard from "./FillInTheBlanksCard";
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
  switch (q.type) {
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
  }
}
