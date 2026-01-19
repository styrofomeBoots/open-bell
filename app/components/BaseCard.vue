<template>
  <div class="mx-auto max-w-lg min-w-[320px] px-10 sm:px-0">
    <section
      class="relative overflow-hidden rounded-2xl border bg-base-100/80 shadow-sm backdrop-blur"
    >
      <div
        class="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-secondary/15 blur-3xl"
      />
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-base-300/60"
      />
      <div class="relative p-6">
        <slot />
      </div>
    </section>
  </div>
</template>
