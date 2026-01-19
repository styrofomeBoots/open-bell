import { H3Event, deleteCookie, getCookie, setCookie } from "h3";
import { randomUUID } from "node:crypto";
import { prisma } from "./prisma";

const COOKIE_NAME: string = "session";
const SESSION_DAYS: number = 7;

export type AuthUser = { id: string; email: string };

export async function createSession(event: H3Event, userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const sessionId = randomUUID();

  await prisma.session.create({ data: { id: sessionId, userId, expiresAt } });

  setCookie(event, COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getUserFromSession(event: H3Event): Promise<AuthUser | null> {
  const sessionId = getCookie(event, COOKIE_NAME);
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
    return null;
  }

  return { id: session.user.id, email: session.user.email };
}

export async function destroySession(event: H3Event): Promise<void> {
  const sessionId = getCookie(event, COOKIE_NAME);
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
  }
  deleteCookie(event, COOKIE_NAME, { path: "/" });
}
