import { z } from "zod";

// Flat schema that directly matches Prisma Question model
export const QuestionSchema = z.object({
  text: z.string().describe("The question text"),
  type: z.literal("multiple_choice_questions").describe("Question type - MCQ only"),
  difficulty: z.enum(["easy", "medium", "hard"]).describe("Difficulty level"),
  choices: z
    .array(z.string())
    .length(4)
    .describe("Exactly 4 answer choices as plain strings"),
  answer: z.string().describe("The correct answer - must match one of the choices exactly"),
  answerIdx: z
    .number()
    .min(0)
    .max(3)
    .describe("0-based index of the correct answer in choices array"),
  explanation: z.string().describe("Brief explanation of why this answer is correct"),
});

// Expected response from LLM
export const LlmExpectedResponseSchema = z.object({
  title: z.string().describe("A concise 5-8 word title for the question set"),
  questions: z.array(QuestionSchema),
});
