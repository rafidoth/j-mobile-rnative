import { getSetById } from "../services/sets.js";
import { reorderQuestions } from "../services/questions.js";

export default async function reorderQuestionsController(req, res) {
  try {
    const { setId, positions } = req.body || {};

    if (!setId) {
      return res.status(400).json({ error: "setId is required" });
    }

    if (!Array.isArray(positions) || positions.length === 0) {
      return res.status(400).json({ error: "positions array is required" });
    }

    // Validate positions array structure
    for (const item of positions) {
      if (!item.questionId || typeof item.position !== "number") {
        return res.status(400).json({
          error: "Each position item must have questionId and position (number)",
        });
      }
    }

    // Verify set exists
    const set = await getSetById(String(setId));
    if (!set) {
      return res.status(404).json({ error: "Set not found" });
    }

    const questions = await reorderQuestions(String(setId), positions);

    return res.status(200).json({ questions });
  } catch (err) {
    console.error("/api/questions/reorder POST error", err);
    return res.status(500).json({ error: "Failed to reorder questions" });
  }
}
