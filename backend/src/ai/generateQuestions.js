import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import getQuestionGenerationAgent from "./questionGenerationChain.js";

/**
 * Generate MCQ questions using LangChain
 * @param {number} questionQuantity - Number of questions to generate
 * @param {string} context - Topic or context for generating questions
 * @returns {Promise<{title: string, questions: Array}>} - Generated questions with title
 */
export async function generateQuestionsWithAI(questionQuantity, context) {
  const messages = [
    new SystemMessage(`You are an expert educational question generator that creates multiple choice questions (MCQs).

Rules:
- Generate exactly the requested number of questions
- Each question has exactly 4 choices
- Mix of easy, medium, and hard difficulty
- The "answer" field must contain the EXACT text of one of the choices
- The "answerIdx" must be the 0-based index (0, 1, 2, or 3) of the correct choice
- Provide a brief explanation for each answer`),
    new HumanMessage(`Generate ${questionQuantity} multiple choice questions about: ${context}`),
  ];

  const agent = await getQuestionGenerationAgent();
  
  try {
    const result = await agent.invoke(messages);
    
    // Handle if result is wrapped in array
    if (Array.isArray(result)) {
      return result[0];
    }
    
    return result;
  } catch (error) {
    // If structured output fails, try to extract from error message
    if (error.message && error.message.includes("failed_generation")) {
      console.log("Attempting to parse failed_generation...");
      const match = error.message.match(/"failed_generation":"(.+)"\}\}/s);
      if (match) {
        try {
          // Unescape the JSON string
          const jsonStr = match[1].replace(/\\n/g, '').replace(/\\"/g, '"');
          const parsed = JSON.parse(jsonStr);
          // Handle array wrapper
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          console.log("Successfully parsed failed_generation data");
          return data;
        } catch (parseError) {
          console.error("Failed to parse failed_generation:", parseError);
        }
      }
    }
    throw error;
  }
}
