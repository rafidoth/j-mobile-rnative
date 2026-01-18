import { createSet } from "../services/sets.js";

export default async function createSetController(req, res) {
  try {
    const { visibility, title, userId } = req.body || {};
    if (!visibility || !title || !userId) {
      return res
        .status(400)
        .json({ error: "visibility, title and userId are required" });
    }
    const set = await createSet({
      visibility: String(visibility),
      title: String(title),
      userId: String(userId),
    });
    return res.status(201).json({ set });
  } catch (err) {
    console.error("/api/set POST error", err);
    return res.status(500).json({ error: "Failed to create set" });
  }
}
