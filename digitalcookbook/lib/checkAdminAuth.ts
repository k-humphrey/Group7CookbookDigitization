// lib/checkAdminAuth.ts
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function isAdminAuthenticated(cookieStore: ReadonlyRequestCookies) {
  const authCookie = cookieStore.get("admin-auth");
  return authCookie?.value === "true";
}
