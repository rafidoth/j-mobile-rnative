import { updateSet } from "../services/sets.js";

export default async function updateSetController(req, res) {
  try {
    const { setId } = req.params;
    const { title, visibility } = req.body || {};
    if (!setId || !title || !visibility) {
      return res.status(400).json({
        error: "setId (param), title and visibility are required",
      });
    }

    const set = await updateSet({
      setId: String(setId),
      title: String(title),
      visibility: String(visibility),
    });
    if (!set) return res.status(404).json({ error: "Set not found" });
    return res.status(200).json({ set });
  } catch (err) {
    console.error("/api/set PATCH error", err);
    return res.status(500).json({ error: "Failed to update set" });
  }
}
