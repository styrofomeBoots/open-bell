export default defineNuxtRouteMiddleware(async (to) => {
  if (process.env.NODE_ENV === "test" || import.meta.env.MODE === "test") {
    return;
  }

  const publicPaths = new Set<string>(["/login", "/signup"]);

  const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  const me = await $fetch<{ user: { id: string; email: string } | null }>(
    `/api/auth/me?_=${Date.now()}`,
    { headers }
  );

  const isAuthed = Boolean(me.user);

  if (isAuthed && publicPaths.has(to.path)) return navigateTo("/");
  if (!isAuthed && !publicPaths.has(to.path)) return navigateTo("/login");
});
