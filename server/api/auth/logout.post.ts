import { destroySession } from "../../utils/session";

export default defineEventHandler(async (event) => {
  await destroySession(event);
  return sendRedirect(event, "/login", 302);
});
