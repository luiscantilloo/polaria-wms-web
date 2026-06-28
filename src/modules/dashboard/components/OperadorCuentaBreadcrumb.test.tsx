import { describe, expect, it } from "vitest";
import { ROUTES } from "@/config/routes";
import { getOperadorCuentaBreadcrumbTrail } from "./OperadorCuentaBreadcrumb";

describe("getOperadorCuentaBreadcrumbTrail", () => {
  it("no muestra breadcrumb en inicio", () => {
    expect(getOperadorCuentaBreadcrumbTrail(ROUTES.dashboard)).toBeNull();
  });

  it("genera Inicio / Compras", () => {
    expect(getOperadorCuentaBreadcrumbTrail(ROUTES.dashboardCompras)).toEqual([
      { label: "Inicio", href: ROUTES.dashboard },
      { label: "Compras" },
    ]);
  });

  it("genera Inicio / Bodega externa", () => {
    expect(
      getOperadorCuentaBreadcrumbTrail(ROUTES.dashboardIntegracionCuenta),
    ).toEqual([
      { label: "Inicio", href: ROUTES.dashboard },
      { label: "Bodega externa" },
    ]);
  });

  it("devuelve null en rutas no mapeadas", () => {
    expect(getOperadorCuentaBreadcrumbTrail(ROUTES.dashboardMapa)).toBeNull();
  });
});
