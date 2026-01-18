import { listQuestionsBySetId } from "../services/questions.js";

export default async function listQuestionsController(req, res) {
  try {
    const { setId } = req.params;
    if (!setId) return res.status(400).json({ error: "Missing setId" });

    const { limit, offset, orderField, orderDir } = req.query;
    const questions = await listQuestionsBySetId(String(setId), {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy:
        orderField && orderDir
          ? { field: String(orderField), direction: String(orderDir) }
          : undefined,
    });

    return res.status(200).json({ questions });
  } catch (err) {
    console.error("/api/questions error", err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
}
