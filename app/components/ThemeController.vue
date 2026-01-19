<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" value="nord" />
    <Icon icon="heroicons:sun" class="swap-off size-6" />
    <Icon icon="heroicons:moon" class="swap-on size-6" />
  </label>
</template>
