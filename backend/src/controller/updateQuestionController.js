import { updateQuestionById } from "../services/questions.js";

export default async function updateQuestionController(req, res) {
  try {
    const { questionId } = req.params;
    if (!questionId) return res.status(400).json({ error: "Missing questionId" });

    const body = req.body || {};
    const allowed = [
      "text",
      "type",
      "difficulty",
      "choices",
      "answer",
      "answerIdx",
      "explanation",
    ];

    // reject unknown fields for minimal safety
    const unknown = Object.keys(body).filter((k) => !allowed.includes(k));
    if (unknown.length) {
      return res.status(400).json({ error: `Unknown fields: ${unknown.join(", ")}` });
    }

    const question = await updateQuestionById(String(questionId), body);
    return res.status(200).json({ question });
  } catch (err) {
    if (err?.code === "P2025") {
      // Prisma record not found
      return res.status(404).json({ error: "Question not found" });
    }
    if (err?.message) {
      return res.status(400).json({ error: err.message });
    }
    console.error("/api/question PATCH error", err);
    return res.status(500).json({ error: "Failed to update question" });
  }
}
