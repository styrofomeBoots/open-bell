import { vi } from "vitest";

(globalThis as any).defineEventHandler = (handler: any) => handler;

(globalThis as any).useRuntimeConfig = () => ({
  finnhubApiKey: "test",
});

// Default $fetch stub (quote handler calls $fetch to Finnhub)
(globalThis as any).$fetch = vi
  .fn()
  .mockResolvedValue({ o: 123.45, t: 1700000000 });

// Mock h3 helpers that otherwise expect a real Node req/res
vi.mock("h3", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    readBody: async (event: any) => event?._body ?? {},
    getQuery: (event: any) => event?._query ?? {},
  };
});

// Mock bcryptjs so login doesn’t need real bcrypt hashes
vi.mock("bcryptjs", () => {
  const hash = vi.fn(async () => "hashed");
  const compare = vi.fn(async () => true);

  return {
    default: { hash, compare },
    hash,
    compare,
  };
});
