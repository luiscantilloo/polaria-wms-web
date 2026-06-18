export const ROUTES = {
  home: "/",
  login: "/login",
  /** Dominio configurador (scope platform) */
  configurator: "/configurador",
  /** Alias legacy — redirige a configurador */
  platform: "/platform",
  /** Dominio tenant (scope tenant) */
  dashboard: "/dashboard",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function getPostLoginRoute(scope: "platform" | "tenant"): string {
  return scope === "platform" ? ROUTES.configurator : ROUTES.dashboard;
}
