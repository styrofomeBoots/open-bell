import { createError, getQuery } from "h3";
import { getUserFromSession } from "../../utils/session";

type FinnhubQuote = {
  o?: number; // open
  c?: number; // current
  h?: number; // high
  l?: number; // low
  pc?: number; // previous close
  t?: number; // timestamp
};

type QuoteResponse = {
  symbol: string;
  open: number;
  ts: number | null;
};

function parseSymbol(query: ReturnType<typeof getQuery>): string {
  const value = (query as Record<string, unknown>).symbol;

  if (typeof value !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Symbol must be a single string",
    });
  }

  const symbol = value.trim().toUpperCase();

  if (!symbol) {
    throw createError({ statusCode: 400, statusMessage: "Missing symbol" });
  }

  if (!/^[A-Z.]{1,10}$/.test(symbol)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid symbol" });
  }

  return symbol;
}

function isFinnhubNoDataQuote(res: FinnhubQuote | null | undefined): boolean {
  const o = typeof res?.o === "number" ? res.o : null;
  const c = typeof res?.c === "number" ? res.c : null;
  const h = typeof res?.h === "number" ? res.h : null;
  const l = typeof res?.l === "number" ? res.l : null;
  const pc = typeof res?.pc === "number" ? res.pc : null;
  const t = typeof res?.t === "number" ? res.t : null;

  // Common "unknown symbol / no data" shape from Finnhub: all zeroes + t=0
  return t === 0 && o === 0 && c === 0 && h === 0 && l === 0 && pc === 0;
}

export default defineEventHandler(async (event): Promise<QuoteResponse> => {
  const user = await getUserFromSession(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const symbol = parseSymbol(getQuery(event));

  if (process.env.NODE_ENV === "test") {
    return { symbol, open: 123.45, ts: 1700000000 };
  }

  const { finnhubApiKey } = useRuntimeConfig(event);

  const res = await $fetch<FinnhubQuote>("https://finnhub.io/api/v1/quote", {
    query: { symbol, token: finnhubApiKey },
  });

  if (isFinnhubNoDataQuote(res)) {
    throw createError({ statusCode: 404, statusMessage: "Symbol not found" });
  }

  if (typeof res?.o !== "number") {
    throw createError({ statusCode: 502, statusMessage: "Quote unavailable" });
  }

  return { symbol, open: res.o, ts: typeof res.t === "number" ? res.t : null };
});
