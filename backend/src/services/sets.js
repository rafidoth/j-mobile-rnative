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

export async function createSet({ visibility, title, userId }) {
  if (!visibility || !title || !userId) {
    throw new Error("visibility, title and userId are required");
  }
  try {
    const set = await prisma.set.create({
      data: { visibility, title, userId },
      select: {
        id: true,
        visibility: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
    return set;
  } catch (err) {
    console.error("createSet error", err);
    throw err;
  }
}

export async function getUserSets(userId) {
  if (!userId || typeof userId !== "string") return [];
  try {
    const sets = await prisma.set.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        visibility: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return sets;
  } catch (err) {
    console.error("getUserSets error", err);
    throw err;
  }
}

export async function updateSet({ setId, title, visibility }) {
  if (!setId || !title || !visibility) {
    throw new Error("setId, title and visibility are required");
  }
  try {
    const existing = await prisma.set.findUnique({
      where: { id: setId },
      select: { id: true },
    });
    if (!existing) return null;

    const updated = await prisma.set.update({
      where: { id: setId },
      data: { title, visibility },
      select: {
        id: true,
        visibility: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
    return updated;
  } catch (err) {
    console.error("updateSet error", err);
    throw err;
  }
}

export async function deleteSet({ setId }) {
  if (!setId) throw new Error("setId is required");
  try {
    const existing = await prisma.set.findUnique({ where: { id: setId }, select: { id: true } });
    if (!existing) return false;
    await prisma.set.delete({ where: { id: setId } });
    return true;
  } catch (err) {
    console.error("deleteSet error", err);
    throw err;
  }
}

export async function searchSetsByTitle(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  try {
    const sets = await prisma.set.findMany({
      where: { title: { contains: q } },
      select: {
        id: true,
        title: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    return sets;
  } catch (err) {
    console.error("searchSetsByTitle error", err);
    throw err;
  }
}
