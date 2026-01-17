import prisma from "../lib/prisma.js";

export async function getSetById(id) {
  if (!id || typeof id !== "string") return null;
  try {
    const set = await prisma.set.findUnique({
      where: { id },
      select: {
        id: true,
        visibility: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return set;
  } catch (err) {
    console.error("getSetById error", err);
    throw err;
  }
}

export async function createSet({ visibility, title }) {
  if (!visibility || !title) {
    throw new Error("visibility and title are required");
  }
  try {
    const set = await prisma.set.create({
      data: { visibility, title },
      select: {
        id: true,
        visibility: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return set;
  } catch (err) {
    console.error("createSet error", err);
    throw err;
  }
}
