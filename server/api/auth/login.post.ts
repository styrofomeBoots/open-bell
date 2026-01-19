import bcrypt from "bcryptjs";
import { createError, readBody } from "h3";
import { prisma } from "../../utils/prisma";
import { createSession } from "../../utils/session";

type LoginBody = { email?: string; password?: string };

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event);

  const email: string = (body.email ?? "").trim().toLowerCase();
  const password: string = body.password ?? "";

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email and password required." });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials." });
  }

  const ok: boolean = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials." });
  }

  await createSession(event, user.id);

  return { ok: true };
});
