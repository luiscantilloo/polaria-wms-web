import { describe, expect, it } from "vitest";
import type { SolicitudCompraRow } from "../types/purchases.types";
import {
  compareSolicitudCompraByCodigoDesc,
  nombresProductosSolicitud,
  pesosProductosSolicitud,
} from "./solicitud-compra-display";

const baseSolicitud: SolicitudCompraRow = {
  id_solicitud_compra: "sol-1",
  codigo_cuenta: "165V7",
  id_bodega: "bod-1",
  id_proveedor: "prov-1",
  id_orden_compra: null,
  codigo: "SOL-0002",
  estado: "borrador",
  id_solicitante: "usr-1",
  observaciones: null,
  created_at: "2026-06-28T12:00:00.000Z",
  updated_at: "2026-06-28T12:00:00.000Z",
  lineas: [
    {
      id_linea_solicitud_compra: "line-1",
      id_producto: "prod-1",
      cantidad: 15.5,
      producto: {
        sku: "DEMO-PRI",
        descripcion: "Salmón demo",
        codigo_almacen: "PRI-01",
        metadatos_catalogo: { titulo: "Salmón entero demo" },
      },
    },
  ],
};

describe("solicitud-compra-display", () => {
  it("resume nombres y pesos de líneas", () => {
    expect(nombresProductosSolicitud(baseSolicitud)).toBe("Salmón entero demo");
    expect(pesosProductosSolicitud(baseSolicitud)).toContain("kg");
  });

  it("ordena por código SOL descendente", () => {
    const rows = [
      { ...baseSolicitud, codigo: "SOL-0001" },
      { ...baseSolicitud, codigo: "SOL-0010" },
    ];

    rows.sort(compareSolicitudCompraByCodigoDesc);
    expect(rows[0]?.codigo).toBe("SOL-0010");
  });
});
