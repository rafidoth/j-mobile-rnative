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
