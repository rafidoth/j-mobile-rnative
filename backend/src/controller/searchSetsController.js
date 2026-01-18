import { searchSetsByTitle } from "../services/sets.js";

export default async function searchSetsController(req, res) {
  try {
    const q = String(req.query?.query || "").trim();
    if (!q) return res.status(200).json({ sets: [] });

    const sets = await searchSetsByTitle(q);
    return res.status(200).json({ sets });
  } catch (err) {
    console.error("/api/sets/search error", err);
    return res.status(500).json({ error: "Failed to search sets" });
  }
}
