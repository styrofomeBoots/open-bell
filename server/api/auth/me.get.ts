import { getUserFromSession, type AuthUser } from "../../utils/session";

type MeResponse = { user: AuthUser | null };

export default defineEventHandler(async (event): Promise<MeResponse> => {
  const user = await getUserFromSession(event);
  return { user };
});
