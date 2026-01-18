import { deleteQuestionById } from "../services/questions.js";

export default async function deleteQuestionController(req, res) {
  try {
    const { questionId } = req.params;
    if (!questionId) return res.status(400).json({ error: "Missing questionId" });

    const deleted = await deleteQuestionById(String(questionId));
    return res.status(200).json({ deletedId: deleted.id });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Question not found" });
    }
    console.error("/api/question DELETE error", err);
    return res.status(500).json({ error: "Failed to delete question" });
  }
}
