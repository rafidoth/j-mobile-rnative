import prisma from "../lib/prisma.js";

export async function createUser({ email, password }) {
  if (!email || !password) {
    throw new Error("email and password are required");
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await prisma.user.create({
      data: { email, password },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (err) {
    console.error("createUser error", err);
    throw err;
  }
}

export async function authenticateUser({ email, password }) {
  if (!email || !password) {
    throw new Error("email and password are required");
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (err) {
    console.error("authenticateUser error", err);
    throw err;
  }
}
