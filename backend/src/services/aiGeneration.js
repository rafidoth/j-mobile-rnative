import prisma from "../lib/prisma.js";
import { generateQuestionsWithAI } from "../ai/generateQuestions.js";

/**
 * Generate questions with AI and save them to the database
 * @param {number} questionQuantity - Number of questions to generate
 * @param {string} context - Topic or context for questions
 * @param {string} userId - User ID who owns the set
 * @returns {Promise<{setId: string, title: string, questionCount: number}>}
 */
export async function generateAndSaveQuestions(
  questionQuantity,
  context,
  userId
) {
  // Generate questions with AI
  console.log(
    `Generating ${questionQuantity} questions for context: "${context.substring(0, 50)}..."`
  );
  const llmResponse = await generateQuestionsWithAI(questionQuantity, context);

  console.log(`LLM generated title: "${llmResponse.title}"`);
  console.log(`LLM generated ${llmResponse.questions.length} questions`);

  // Create set and questions in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the set
    const set = await tx.set.create({
      data: {
        title: llmResponse.title,
        visibility: "private",
        userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    // Prepare questions data - schema already matches DB format
    const questionsData = llmResponse.questions.map((q, idx) => ({
      setId: set.id,
      text: q.text,
      type: q.type,
      difficulty: q.difficulty,
      choices: q.choices,
      answer: q.answer,
      answerIdx: q.answerIdx,
      explanation: q.explanation || null,
      position: idx + 1,
    }));

    // Bulk create questions
    await tx.question.createMany({
      data: questionsData,
    });

    return {
      setId: set.id,
      title: set.title,
      questionCount: questionsData.length,
    };
  });

  console.log(`Created set ${result.setId} with ${result.questionCount} questions`);

  return result;
}
