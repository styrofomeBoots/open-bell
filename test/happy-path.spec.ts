import { describe, it, expect, vi, beforeEach } from "vitest";
import signup from "../server/api/auth/signup.post";
import login from "../server/api/auth/login.post";
import quote from "../server/api/stocks/quote.get";

// Mock Prisma
const users = new Map<string, any>();
const sessions = new Map<string, any>();

vi.mock("../server/utils/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(({ where: { email } }) => users.get(email) ?? null),
      create: vi.fn(({ data }) => {
        users.set(data.email, { ...data, id: "user_1" });
        return { id: "user_1" };
      }),
    },
    session: {
      create: vi.fn(({ data }) => {
        sessions.set(data.id, data);
        return data;
      }),
      findUnique: vi.fn(({ where: { id } }) => sessions.get(id) ?? null),
      delete: vi.fn(),
    },
  },
}));


// Mock session utils
vi.mock("../server/utils/session", async () => {
  const real = await vi.importActual<any>("../server/utils/session");
  return {
    ...real,
    createSession: vi.fn((event: any) => {
      event.context.session = { userId: "user_1" };
    }),
    getUserFromSession: vi.fn(() => ({
      id: "user_1",
      email: "test@example.com",
    })),
  };
});

// Helpers
function mockEvent(body?: any, query?: any): any {
  return {
    _body: body,
    _query: query,
    node: {
      req: { headers: { "content-type": "application/json" } },
      res: {},
    },
    context: {},
  };
}

describe("Happy path", () => {
  beforeEach(() => {
    users.clear();
    sessions.clear();
  });

  it("signs up", async () => {
    const event = mockEvent({ email: "test@example.com", password: "password123" });
    const res = await signup(event);
    expect(res.ok).toBe(true);
  });

  it("logs in", async () => {
    users.set("test@example.com", {
      id: "user_1",
      email: "test@example.com",
      passwordHash: "hashed",
    });

    const event = mockEvent({ email: "test@example.com", password: "password123" });
    const res = await login(event);
    expect(res.ok).toBe(true);
  });

  it("returns a quote when authenticated", async () => {
    const event = mockEvent(undefined, { symbol: "AAPL" });

    // mock Finnhub fetch
    globalThis.$fetch = vi.fn().mockResolvedValue({ o: 123.45, t: 1700000000 });

    const res = await quote(event);
    expect(res.symbol).toBe("AAPL");
    expect(res.open).toBe(123.45);
  });
});
