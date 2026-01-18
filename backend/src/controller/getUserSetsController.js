import { getUserSets } from "../services/sets.js";

export default async function getUserSetsController(req, res) {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const setsRaw = await getUserSets(String(user_id));
    const sets = (setsRaw || []).map((s) => ({
      id: s.id,
      title: s.title,
      visibility: s.visibility,
      created_at: s.createdAt,
    }));
    return res.status(200).json({ sets });
  } catch (err) {
    console.error("/api/sets/user error", err);
    return res.status(500).json({ error: "Failed to fetch user's sets" });
  }
}
