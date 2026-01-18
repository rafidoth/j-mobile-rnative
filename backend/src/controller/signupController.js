import { createUser } from "../services/auth.js";

export default async function signupController(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    try {
      const user = await createUser({ email: String(email), password: String(password) });
      return res.status(201).json({ user });
    } catch (err) {
      if (String(err?.message).includes("exists")) {
        return res.status(409).json({ error: "User already exists" });
      }
      throw err;
    }
  } catch (err) {
    console.error("/api/signup error", err);
    return res.status(500).json({ error: "Failed to sign up" });
  }
}
