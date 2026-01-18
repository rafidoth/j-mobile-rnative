import { getSetById } from "../services/sets.js";
import { createQuestion } from "../services/questions.js";

export default async function createQuestionController(req, res) {
  try {
    const {
      setId,
      text,
      type,
      difficulty,
      choices,
      answer,
      answerIdx,
      explanation,
    } = req.body || {};
    if (!setId || !text || !type || !difficulty) {
      return res
        .status(400)
        .json({ error: "setId, text, type, difficulty are required" });
    }

    const set = await getSetById(String(setId));
    if (!set) return res.status(404).json({ error: "Set not found" });

    const question = await createQuestion({
      setId: String(setId),
      text: String(text),
      type: String(type),
      difficulty: String(difficulty),
      choices,
      answer,
      answerIdx,
      explanation,
    });

    return res.status(201).json({ question });
  } catch (err) {
    console.error("/api/questions POST error", err);
    return res.status(500).json({ error: "Failed to create question" });
  }
}
