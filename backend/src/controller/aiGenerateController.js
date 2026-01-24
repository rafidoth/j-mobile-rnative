import { generateAndSaveQuestions } from "../services/aiGeneration.js";

export async function generateQuestionsController(req, res) {
  try {
    const { questionQuantity, context } = req.body;

    // Validate required fields
    if (!questionQuantity || !context) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "questionQuantity and context are required",
      });
    }

    // Validate questionQuantity
    const quantity = parseInt(questionQuantity, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 50) {
      return res.status(400).json({
        error: "Invalid questionQuantity",
        message: "questionQuantity must be between 1 and 50",
      });
    }

    // Validate context
    if (typeof context !== "string" || context.trim().length < 3) {
      return res.status(400).json({
        error: "Invalid context",
        message: "context must be a string with at least 3 characters",
      });
    }

    // Get userId from request (you may need to adjust this based on your auth setup)
    // For now, we'll expect it in the body or use a default
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({
        error: "Missing userId",
        message: "userId is required",
      });
    }

    console.log(
      `[AI Generate] Request: ${quantity} questions, context: "${context.substring(0, 50)}..."`
    );

    const result = await generateAndSaveQuestions(quantity, context.trim(), userId);

    console.log(`[AI Generate] Success: set_id=${result.setId}`);

    res.json({
      success: true,
      set_id: result.setId,
      title: result.title,
      question_count: result.questionCount,
    });
  } catch (error) {
    console.error("[AI Generate] Error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error.message || "An error occurred while generating questions",
    });
  }
}
