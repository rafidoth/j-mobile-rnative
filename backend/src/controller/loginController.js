import { authenticateUser } from "../services/auth.js";

export default async function loginController(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await authenticateUser({ email: String(email), password: String(password) });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials", loggedIn: false });
    }

    return res.status(200).json({ loggedIn: true, user });
  } catch (err) {
    console.error("/api/login error", err);
    return res.status(500).json({ error: "Failed to login" });
  }
}
