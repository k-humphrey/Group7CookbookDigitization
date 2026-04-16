import { decrypt } from "@/lib/session";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function isAdminAuthenticated(cookieStore: ReadonlyRequestCookies) {
  const encrypted = cookieStore.get("session")?.value; //get session

  if (!encrypted) return false; //if it doesn't exist, not logged in

  try {
    const session = await decrypt(encrypted); //try to decrypt session

    //these are stateless cookies,, so we only check if it can be decrypted, this is pretty secure because
    //nobody can really forge this exact value without knowing a username and the secret token
    return Boolean(session?.email);
  } catch {
    return false; // invalid or tampered cookie
  }
}