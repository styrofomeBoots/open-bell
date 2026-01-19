<script setup lang="ts">
definePageMeta({ layout: "default" });

type QuoteResponse = {
  symbol: string;
  open: number;
  ts: number | null;
};

const symbol = ref<string>("");
const quote = ref<QuoteResponse | null>(null);
const isLoading = ref<boolean>(false);
const errorMsg = ref<string>("");

const quoteDateLabel = computed<string>(() => {
  const ts = quote.value?.ts;
  if (!ts) return "";
  const d = new Date(ts * 1000);

  return d.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
});

const lookup = async (): Promise<void> => {
  errorMsg.value = "";
  quote.value = null;

  const cleaned = symbol.value.trim().toUpperCase();
  if (!cleaned) {
    errorMsg.value = "Enter a stock symbol (e.g. AAPL).";
    return;
  }

  isLoading.value = true;
  try {
    quote.value = await $fetch<QuoteResponse>("/api/stocks/quote", {
      query: { symbol: cleaned },
    });
  } catch (err: unknown) {
    errorMsg.value =
      (err as any)?.data?.statusMessage ||
      (err as any)?.data?.message ||
      (err as any)?.message ||
      "Unable to fetch quote.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-6">
      <div>
        <h1 class="text-2xl font-bold">OpenBell</h1>
        <p class="text-base-content/70 mt-1">
          Look up the opening price for a stock symbol.
        </p>
      </div>
      <MarketStatusIcon />
    </div>

    <div class="form-control mt-6">
      <div class="join w-full">
        <div class="relative join-item flex-1">
          <label class="floating-label form-control w-full">
            <input
              v-model="symbol"
              class="input input-bordered w-full join-item"
              placeholder="Stock symbol"
              autocapitalize="characters"
              autocomplete="off"
              spellcheck="false"
              @keydown.enter.prevent="lookup"
            />
            <span class="label-text">Stock symbol</span>
          </label>
        </div>

        <button
          class="btn btn-primary join-item"
          :disabled="isLoading"
          @click="lookup"
        >
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          <span>{{ isLoading ? "Searching..." : "Search" }}</span>
        </button>
      </div>

      <div v-if="errorMsg" class="alert alert-error mt-4">
        <span>{{ errorMsg }}</span>
      </div>
    </div>

    <div v-if="quote" class="rounded-2xl bg-base-200 p-5 mt-6">
      <div class="flex items-baseline justify-between gap-6">
        <div>
          <div class="text-sm text-base-content/60">Symbol</div>
          <div class="text-xl font-semibold">{{ quote.symbol }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-base-content/60">Open</div>
          <div class="text-3xl font-bold tabular-nums">
            {{ quote.open.toFixed(2) }}
          </div>
        </div>
      </div>

      <div v-if="quote.ts" class="text-xs text-base-content/60 mt-3">
        Price updated: {{ quoteDateLabel }}
      </div>
    </div>

    <div v-else class="text-sm text-base-content/60 mt-6">
      Enter a symbol and press Search.
    </div>
  </BaseCard>
</template>
