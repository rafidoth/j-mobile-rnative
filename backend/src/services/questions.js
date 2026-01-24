import prisma from "../lib/prisma.js";

export async function listQuestionsBySetId(
  setId,
  opts = {}
) {
  if (!setId || typeof setId !== "string") return [];
  const {
    limit = 50,
    offset = 0,
    orderBy = { field: "position", direction: "asc" },
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
        position: true,
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

export async function getMaxPositionInSet(setId) {
  if (!setId || typeof setId !== "string") return 0;
  try {
    const result = await prisma.question.aggregate({
      where: { setId },
      _max: { position: true },
    });
    return result._max.position ?? 0;
  } catch (err) {
    console.error("getMaxPositionInSet error", err);
    return 0;
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
    // Get the next position (max + 1)
    const maxPosition = await getMaxPositionInSet(setId);
    const nextPosition = maxPosition + 1;

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
        position: nextPosition,
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
        position: true,
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
        position: true,
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
    // First get the question to know its setId and position
    const question = await prisma.question.findUnique({
      where: { id },
      select: { id: true, setId: true, position: true },
    });

    if (!question) {
      throw new Error("Question not found");
    }

    const { setId, position } = question;

    // Delete the question and renumber remaining questions in a transaction
    const [deleted] = await prisma.$transaction([
      prisma.question.delete({
        where: { id },
        select: { id: true },
      }),
      // Decrement position for all questions after the deleted one
      prisma.question.updateMany({
        where: {
          setId,
          position: { gt: position },
        },
        data: {
          position: { decrement: 1 },
        },
      }),
    ]);

    return deleted;
  } catch (err) {
    console.error("deleteQuestionById error", err);
    throw err;
  }
}

export async function reorderQuestions(setId, positions) {
  if (!setId || typeof setId !== "string") {
    throw new Error("setId is required");
  }
  if (!Array.isArray(positions) || positions.length === 0) {
    throw new Error("positions array is required");
  }

  try {
    // Update all positions in a transaction
    const updates = positions.map(({ questionId, position }) =>
      prisma.question.update({
        where: { id: questionId },
        data: { position },
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
          position: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    );

    const updatedQuestions = await prisma.$transaction(updates);
    
    // Return sorted by position
    return updatedQuestions.sort((a, b) => a.position - b.position);
  } catch (err) {
    console.error("reorderQuestions error", err);
    throw err;
  }
}
