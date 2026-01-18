import prisma from "../lib/prisma.js";

export async function listQuestionsBySetId(
  setId,
  opts = {}
) {
  if (!setId || typeof setId !== "string") return [];
  const {
    limit = 50,
    offset = 0,
    orderBy = { field: "createdAt", direction: "desc" },
  } = opts;

  const take = Math.min(Number(limit) || 50, 100);
  const skip = Math.max(Number(offset) || 0, 0);
  const order = { [orderBy.field]: orderBy.direction };

  try {
    const questions = await prisma.question.findMany({
      where: { setId },
      select: {
        id: true,
        text: true,
        type: true,
        difficulty: true,
        choices: true,
        answer: true,
        answerIdx: true,
        explanation: true,
        createdAt: true,
        updatedAt: true,
      },
      take,
      skip,
      orderBy: order,
    });
    return questions;
  } catch (err) {
    console.error("listQuestionsBySetId error", err);
    throw err;
  }
}

export async function createQuestion({
  setId,
  text,
  type,
  difficulty,
  choices,
  answer,
  answerIdx,
  explanation,
}) {
  if (!setId || !text || !type || !difficulty) {
    throw new Error("setId, text, type, difficulty are required");
  }
  if (typeof answerIdx === "number" && answerIdx < 0) {
    throw new Error("answerIdx must be >= 0");
  }
  try {
    const question = await prisma.question.create({
      data: {
        setId,
        text,
        type,
        difficulty,
        choices: choices ?? [],
        answer: answer ?? "",
        answerIdx: typeof answerIdx === "number" ? answerIdx : 0,
        explanation: explanation ?? null,
      },
      select: {
        id: true,
        setId: true,
        text: true,
        type: true,
        difficulty: true,
        choices: true,
        answer: true,
        answerIdx: true,
        explanation: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return question;
  } catch (err) {
    console.error("createQuestion error", err);
    throw err;
  }
}

export async function updateQuestionById(id, updates = {}) {
  if (!id || typeof id !== "string") {
    throw new Error("question id is required");
  }
  const allowed = [
    "text",
    "type",
    "difficulty",
    "choices",
    "answer",
    "answerIdx",
    "explanation",
  ];
  const data = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      data[key] = updates[key];
    }
  }
  if (Object.keys(data).length === 0) {
    throw new Error("No valid fields to update");
  }
  if (typeof data.answerIdx === "number" && data.answerIdx < 0) {
    throw new Error("answerIdx must be >= 0");
  }
  try {
    const question = await prisma.question.update({
      where: { id },
      data: { ...data },
      select: {
        id: true,
        setId: true,
        text: true,
        type: true,
        difficulty: true,
        choices: true,
        answer: true,
        answerIdx: true,
        explanation: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return question;
  } catch (err) {
    console.error("updateQuestionById error", err);
    throw err;
  }
}

export async function deleteQuestionById(id) {
  if (!id || typeof id !== "string") {
    throw new Error("question id is required");
  }
  try {
    const deleted = await prisma.question.delete({
      where: { id },
      select: { id: true },
    });
    return deleted;
  } catch (err) {
    console.error("deleteQuestionById error", err);
    throw err;
  }
}
