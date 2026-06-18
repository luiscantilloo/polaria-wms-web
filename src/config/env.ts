export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
} as const;

/** En el navegador usa el proxy `/api` de Next.js para evitar CORS en dev. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return env.apiBaseUrl;
}
