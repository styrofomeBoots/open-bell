<script setup lang="ts">
import { Icon } from "@iconify/vue";

type LoginForm = {
  email: string;
  password: string;
};

const form = reactive<LoginForm>({
  email: "",
  password: "",
});

const showPassword = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const errorMsg = ref<string>("");

const canSubmit = computed<boolean>(() => {
  if (!form.email || !form.password) return false;
  return true;
});

const submit = async (): Promise<void> => {
  errorMsg.value = "";
  if (!canSubmit.value) return;

  isSubmitting.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: form.email, password: form.password },
    });

    await navigateTo("/");
  } catch (err: unknown) {
    errorMsg.value =
      (err as any)?.data?.message ||
      (err as any)?.message ||
      "Could not log in. Please check your email and password.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="pt-16">
    <BaseCard class="mx-auto max-w-lg min-w-sm">
      <div class="flex items-start justify-between gap-6">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p class="text-base-content/70">
            Log in to search opening prices in OpenBell.
          </p>
        </div>
      </div>
      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <label class="floating-label form-control w-full">
          <input v-model="form.email" type="email" autocomplete="email" class="input input-bordered w-full"
            placeholder="Email" required />
          <span class="label-text">Email</span>
        </label>


        <div class="relative">
          <label class="floating-label form-control w-full">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
              class="input input-bordered w-full pr-12" placeholder="Password" required />
            <span class="label-text">Password</span>
            <button type="button"
              class="btn btn-sm btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
              <Icon :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="size-5" />
            </button>
          </label>
        </div>

        <div class="pt-1">
          <button type="submit" class="btn btn-primary w-full"
            :disabled="!canSubmit || isSubmitting || form.password.length < 8">
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
            <span>{{ isSubmitting ? "Logging in..." : "Log in" }}</span>
          </button>
        </div>

        <div v-if="errorMsg" class="alert alert-error mt-6">
          <span>{{ errorMsg }}</span>
        </div>

        <div class="divider my-7">or</div>

        <div class="text-center text-sm text-base-content/70">
          Need an account?
          <NuxtLink class="link link-primary font-medium" to="/signup">Create one</NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
