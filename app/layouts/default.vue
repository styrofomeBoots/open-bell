<script setup lang="ts">
import { Icon } from "@iconify/vue";

const route = useRoute();

const showLogout = computed<boolean>(() => route.path === "/");

const logout = async (): Promise<void> => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/login");
};
</script>

<template>
  <div class="min-h-screen">
    <nav class="navbar w-full bg-base-300">
      <NuxtLink to="/" class="btn btn-ghost gap-2 normal-case text-lg mr-auto">
        <Icon icon="fluent-emoji-high-contrast:bell-pepper" class="size-6" />
        <span class="font-semibold hidden sm:inline">OpenBell</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <button v-if="showLogout" class="btn btn-ghost btn-sm" type="button" @click="logout">
          <Icon icon="heroicons:arrow-right-on-rectangle" class="size-5" />
          <span class="hidden sm:inline">Logout</span>
        </button>
        <ThemeController />
        <a class="btn btn-ghost btn-sm" href="https://github.com/styrofomeBoots/open-bell" target="_blank"
          rel="noopener noreferrer" aria-label="OpenBell GitHub repository" title="View source on GitHub">
          <Icon icon="mdi:github" class="size-5" />
        </a>
      </div>
    </nav>

    <!-- Page content -->
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
