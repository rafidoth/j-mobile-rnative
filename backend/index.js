import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { getSetById, createSet } from "./src/services/sets.js";
import {
  listQuestionsBySetId,
  createQuestion,
} from "./src/services/questions.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  try {
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("/api/signup error", err);
    return res.status(500).json({ error: "Failed to sign up" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (email === "test@test.com" && password === "1234") {
      return res.status(200).json({ loggedIn: true });
    }
    return res
      .status(401)
      .json({ error: "Invalid credentials", loggedIn: false });
  } catch (err) {
    console.error("/api/login error", err);
    return res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/api/set", async (req, res) => {
  try {
    const { visibility, title } = req.body || {};
    if (!visibility || !title) {
      return res
        .status(400)
        .json({ error: "visibility and title are required" });
    }
    const set = await createSet({
      visibility: String(visibility),
      title: String(title),
    });
    return res.status(201).json({ set });
  } catch (err) {
    console.error("/api/set POST error", err);
    return res.status(500).json({ error: "Failed to create set" });
  }
});

app.get("/api/set/:setId", async (req, res) => {
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
});

app.get("/api/questions/:setId", async (req, res) => {
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
});

app.post("/api/questions", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
