<script setup lang="ts">
import { Icon } from "@iconify/vue";

type SignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const form = reactive<SignupForm>({
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const errorMsg = ref<string>("");

const canSubmit = computed<boolean>(() => {
  if (!form.email || !form.password || !form.confirmPassword) return false;
  if (form.password.length < 8) return false;
  if (form.password !== form.confirmPassword) return false;
  return true;
});

const submit = async (): Promise<void> => {
  errorMsg.value = "";
  if (!canSubmit.value) return;

  isSubmitting.value = true;
  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: { email: form.email, password: form.password },
    });

    await navigateTo("/");
  } catch (err: unknown) {
    errorMsg.value =
      (err as any)?.data?.statusMessage ||
      (err as any)?.data?.message ||
      (err as any)?.message ||
      "Could not create your account. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Create your account</h1>
        <p class="text-base-content/70">
          Sign up to search opening prices in OpenBell.
        </p>
      </div>
    </div>

    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <label class="floating-label form-control w-full">
        <input
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="input input-bordered w-full"
          placeholder="Email"
          required
        />
        <span class="label-text">Email</span>
      </label>

      <div class="form-control w-full mb-[0.75rem]">
        <div class="relative">
          <label class="floating-label form-control w-full">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input input-bordered w-full pr-12"
              placeholder="Password"
              required
              minlength="8"
            />
            <span class="label-text">Password</span>

            <button
              type="button"
              class="btn btn-sm btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <Icon
                :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                class="size-5"
              />
            </button>
          </label>
        </div>
        <p class="label text-base-content/60 text-xs ml-1">
          Minimum 8 characters
        </p>
      </div>

      <div class="form-control w-full mb-[0.5rem]">
        <div class="relative">
          <label class="floating-label form-control w-full">
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="input input-bordered w-full"
              placeholder="Confirm password"
              minlength="8"
              required
            />
            <span class="label-text">Confirm password</span>
          </label>
        </div>

        <p
          class="label text-xs ml-1"
          :class="
            form.password &&
            form.confirmPassword &&
            form.password !== form.confirmPassword
              ? 'text-error'
              : 'text-base-content/60'
          "
        >
          {{
            form.password &&
            form.confirmPassword &&
            form.password !== form.confirmPassword
              ? "Passwords do not match."
              : ""
          }}
        </p>
      </div>

      <div>
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="!canSubmit || isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="loading loading-spinner loading-sm"
          />
          <span>{{
            isSubmitting ? "Creating account..." : "Create account"
          }}</span>
        </button>
      </div>

      <div v-if="errorMsg" class="alert alert-error mt-6">
        <span>{{ errorMsg }}</span>
      </div>

      <div class="divider my-7">or</div>

      <div class="text-center text-sm text-base-content/70">
        Already have an account?
        <NuxtLink class="link link-primary font-medium" to="/login"
          >Log in</NuxtLink
        >
      </div>
    </form>
  </BaseCard>
</template>
