type FinnhubMarketStatus = {
  exchange: string;
  holiday: string | null;
  isOpen: boolean;
  session: string | null;
  state: string | null;
  timezone: string;
  timestamp: number;
};

type MarketStatusResponse = {
  exchange: string;
  isOpen: boolean;
  holiday: string | null;
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
      isOpen: Boolean(res.isOpen),
      holiday: res.holiday ?? null,
    };
  },
);
