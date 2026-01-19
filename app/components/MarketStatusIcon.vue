<script setup lang="ts">
import { Icon } from "@iconify/vue";

type MarketStatus = {
  isOpen: boolean;
  icon: string;
  tooltip: string;
};

type MarketStatusResponse = {
  exchange: string;
  isOpen: boolean;
  holiday: string | null;
  timestamp: number | null;
};

const { data, pending, error, refresh } = await useFetch<MarketStatusResponse>(
  "/api/stocks/status",
  { query: { exchange: "US" } },
);

onMounted((): void => {
  const id = globalThis.setInterval(() => {
    void refresh();
  }, 60_000);
  onBeforeUnmount(() => globalThis.clearInterval(id));
});

const shouldShow = computed<boolean>(
  () => Boolean(data.value) && !error.value && !pending.value,
);

const marketStatus = computed<MarketStatus>(() => {
  const isOpen = data.value?.isOpen ?? false;
  const holiday = data.value?.holiday ?? null;

  if (isOpen) {
    return { isOpen: true, icon: "cbi:neon-open", tooltip: "Market is open" };
  }

  if (holiday) {
    return {
      isOpen: false,
      icon: "cbi:neon-closed",
      tooltip: `Market is closed`,
    };
  }

  return {
    isOpen: false,
    icon: "cbi:neon-closed",
    tooltip: "Market is closed",
  };
});

const tooltipClass = computed<string>(() =>
  marketStatus.value.isOpen ? "tooltip-success" : "tooltip-error",
);

const iconClass = computed<string>(() =>
  marketStatus.value.isOpen ? "text-success" : "text-error",
);
</script>

<template>
  <div
    v-if="shouldShow"
    class="tooltip inline-flex tooltip-left"
    :class="tooltipClass"
    :data-tip="marketStatus.tooltip"
  >
    <Icon
      :icon="marketStatus.icon"
      class="size-12 align-top mt-[-.25rem]"
      :class="iconClass"
    />
  </div>
</template>
