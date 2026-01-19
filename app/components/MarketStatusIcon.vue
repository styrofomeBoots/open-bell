<script setup lang="ts">
import { Icon } from "@iconify/vue";

type Props = {
  timeZone?: string;
};

const props = withDefaults(defineProps<Props>(), {
  timeZone: "America/New_York",
});

type MarketStatus = {
  isOpen: boolean;
  icon: string;
  tooltip: string;
};

const marketStatus = computed<MarketStatus>(() => {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: props.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minuteStr = parts.find((p) => p.type === "minute")?.value ?? "00";

  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);

  const mins = hour * 60 + minute;
  const openMins = 9 * 60 + 30;
  const closeMins = 16 * 60;

  const isOpen = isWeekday && mins >= openMins && mins < closeMins;

  return isOpen
    ? { isOpen: true, icon: "cbi:neon-open", tooltip: "Market is open" }
    : { isOpen: false, icon: "cbi:neon-closed", tooltip: "Market is closed" };
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
    class="tooltip inline-flex tooltip-left"
    :class="tooltipClass"
    :data-tip="marketStatus.tooltip"
  >
    <Icon
      :icon="marketStatus.icon"
      class="size-12 align-top mt-[-.5rem]"
      :class="iconClass"
    />
  </div>
</template>
