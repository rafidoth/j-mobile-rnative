import { getSetById } from "../services/sets.js";

export default async function getSetController(req, res) {
  try {
    const { setId } = req.params;
    if (!setId) return res.status(400).json({ error: "Missing setId" });

    const set = await getSetById(String(setId));
    if (!set) return res.status(404).json({ error: "Set not found" });
    return res.status(200).json({ set });
  } catch (err) {
    console.error("/api/set error", err);
    return res.status(500).json({ error: "Failed to fetch set" });
  }
}
