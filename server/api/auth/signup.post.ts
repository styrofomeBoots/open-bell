import bcrypt from "bcryptjs";
import { createError, readBody } from "h3";
import { prisma } from "../../utils/prisma";
import { createSession } from "../../utils/session";

type SignupBody = { email?: string; password?: string };

export default defineEventHandler(async (event) => {
  const body = await readBody<SignupBody>(event);

  const email: string = (body.email ?? "").trim().toLowerCase();
  const password: string = body.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email address.",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters.",
    });
  }

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password required.",
    });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already exists.",
    });
  }

  const passwordHash: string = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true },
  });

  await createSession(event, user.id);

  return { ok: true };
});
