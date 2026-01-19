type FinnhubMarketStatus = {
  exchange: string;
  holiday: string | null;
  is_open: boolean;
  session: string | null;
  state: string | null;
  timezone: string;
  timestamp: number;
};

type MarketStatusResponse = {
  exchange: string;
  isOpen: boolean;
  holiday: string | null;
  timestamp: number | null;
};

export default defineEventHandler(
  async (event): Promise<MarketStatusResponse> => {
    const user = await getUserFromSession(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const exchange = (getQuery(event).exchange as string | undefined) ?? "US";

    const { finnhubApiKey } = useRuntimeConfig(event);

    const res = await $fetch<FinnhubMarketStatus>(
      "https://finnhub.io/api/v1/stock/market-status",
      { query: { exchange, token: finnhubApiKey } },
    );

    return {
      exchange: res.exchange ?? exchange,
      isOpen: Boolean(res.is_open),
      holiday: res.holiday ?? null,
      timestamp: typeof res.timestamp === "number" ? res.timestamp : null,
    };
  },
);
