import { deleteSet } from "../services/sets.js";

export default async function deleteSetController(req, res) {
  try {
    const { setId } = req.params;
    if (!setId) return res.status(400).json({ error: "Missing setId" });

    const ok = await deleteSet({ setId: String(setId) });
    if (!ok) return res.status(404).json({ error: "Set not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("/api/set DELETE error", err);
    return res.status(500).json({ error: "Failed to delete set" });
  }
}
