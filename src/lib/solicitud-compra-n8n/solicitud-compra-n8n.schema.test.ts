import { describe, expect, it } from "vitest";
import {
  mapSolicitudCompraEstadoN8n,
  parseSolicitudCompraN8nBody,
} from "./solicitud-compra-n8n.schema";

const VALID_BODY = {
  codigo_cuenta: "49M04",
  telefono: "+573017447947",
  id_proveedor: "88522d67-4de0-428e-8bec-bf2581916df0",
  razon_social: "Pat-lafrieda",
  codigo: "60ERA",
  estado: "Iniciado",
  solicitud_compra_linea: [
    {
      id_producto: "5dbb31df-e070-407e-bb05-d7714afd0a98",
      sku: "OH2WF",
      descripcion: "Frozen-Lamb Racks",
      cantidad: 300,
    },
  ],
  mensaje_final: "Hola, solicito cotización de los productos detallados.",
};

describe("solicitud-compra-n8n.schema", () => {
  it("parseSolicitudCompraN8nBody acepta payload de ejemplo n8n", () => {
    const parsed = parseSolicitudCompraN8nBody(VALID_BODY);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(VALID_BODY);
    }
  });

  it("mapSolicitudCompraEstadoN8n traduce borrador a Iniciado", () => {
    expect(mapSolicitudCompraEstadoN8n("borrador")).toBe("Iniciado");
    expect(mapSolicitudCompraEstadoN8n("aprobada")).toBe("aprobada");
  });
});
