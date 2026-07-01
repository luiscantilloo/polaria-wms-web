import {
  applyTenantFilters,
  DEFAULT_LIST_LIMIT,
  type TenantListParams,
  runDomainQuery,
} from "@/lib/supabase/domain-query";
import { DomainServiceError } from "@/lib/domain-service-error";
import type {
  OrdenCompraRow,
  RecepcionCompraRow,
  SolicitudCompraLineaRow,
  SolicitudCompraRow,
} from "../types/purchases.types";

const SOLICITUD_COLUMNS =
  "id_solicitud_compra,codigo_cuenta,id_bodega,id_proveedor,id_orden_compra,codigo,estado,id_solicitante,observaciones,created_at,updated_at," +
  "solicitud_compra_linea(id_linea_solicitud_compra,id_producto,cantidad,producto(sku,descripcion,codigo_almacen,metadatos_catalogo))";

const ORDEN_COLUMNS =
  "id_orden_compra,codigo_cuenta,id_bodega,id_proveedor,id_solicitud_compra,id_creador,codigo,estado,fecha_emision,fecha_entrega_estimada,destino_tipo,observaciones,created_at,updated_at";

const RECEPCION_COLUMNS =
  "id_recepcion,codigo_cuenta,id_bodega,id_orden_compra,sin_diferencias,notas,cerrada_at,cerrada_por,created_at";

const ORDEN_LINEA_COLUMNS = "cantidad,producto(sku,unidad_medida)";

export interface OrdenCompraLineaRow {
  sku: string;
  cantidad: number;
  unidad: string;
}

interface OrdenCompraLineaDbRow {
  cantidad: string | number;
  producto:
    | { sku: string; unidad_medida: string | null }
    | { sku: string; unidad_medida: string | null }[]
    | null;
}

function resolveProducto(
  producto: OrdenCompraLineaDbRow["producto"],
): { sku: string; unidad_medida: string | null } | null {
  if (!producto) return null;
  return Array.isArray(producto) ? (producto[0] ?? null) : producto;
}

function mapOrdenCompraLineaRow(row: OrdenCompraLineaDbRow): OrdenCompraLineaRow | null {
  const producto = resolveProducto(row.producto);
  const sku = producto?.sku?.trim() ?? "";
  const cantidad = Number(row.cantidad);
  const unidad = producto?.unidad_medida?.trim() || "und";

  if (!sku || !Number.isFinite(cantidad) || cantidad <= 0) {
    return null;
  }

  return { sku, cantidad, unidad };
}

interface SolicitudCompraLineaDbRow {
  id_linea_solicitud_compra: string;
  id_producto: string;
  cantidad: string | number;
  producto:
    | {
        sku: string | null;
        descripcion: string | null;
        codigo_almacen: string | null;
        metadatos_catalogo: unknown;
      }
    | {
        sku: string | null;
        descripcion: string | null;
        codigo_almacen: string | null;
        metadatos_catalogo: unknown;
      }[]
    | null;
}

interface SolicitudCompraDbRow extends Omit<SolicitudCompraRow, "lineas"> {
  solicitud_compra_linea: SolicitudCompraLineaDbRow[] | null;
}

function resolveLineaProducto(
  producto: SolicitudCompraLineaDbRow["producto"],
): SolicitudCompraLineaRow["producto"] {
  if (!producto) {
    return null;
  }

  return Array.isArray(producto) ? (producto[0] ?? null) : producto;
}

function mapSolicitudCompraLineaRow(
  row: SolicitudCompraLineaDbRow,
): SolicitudCompraLineaRow {
  return {
    id_linea_solicitud_compra: row.id_linea_solicitud_compra,
    id_producto: row.id_producto,
    cantidad: Number(row.cantidad),
    producto: resolveLineaProducto(row.producto),
  };
}

function mapSolicitudCompraRow(row: SolicitudCompraDbRow): SolicitudCompraRow {
  const { solicitud_compra_linea, ...solicitud } = row;

  return {
    ...solicitud,
    lineas: (solicitud_compra_linea ?? []).map(mapSolicitudCompraLineaRow),
  };
}

// TODO POL-5+: crear/aprobar solicitudes y órdenes vía apiRequest al API Nest.

export async function listSolicitudesCompra(
  params: TenantListParams,
): Promise<SolicitudCompraRow[]> {
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;

  return runDomainQuery((client) => {
    const query = applyTenantFilters(
      client.from("solicitud_compra").select(SOLICITUD_COLUMNS),
      params,
    )
      .order("created_at", { ascending: false })
      .limit(limit);

    return query as unknown as Promise<{
      data: SolicitudCompraDbRow[] | null;
      error: { message: string } | null;
    }>;
  }).then((rows) => rows.map(mapSolicitudCompraRow));
}

export async function listOrdenesCompra(
  params: TenantListParams,
): Promise<OrdenCompraRow[]> {
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;

  return runDomainQuery((client) => {
    const query = applyTenantFilters(
      client.from("orden_compra").select(ORDEN_COLUMNS),
      params,
    )
      .order("created_at", { ascending: false })
      .limit(limit);

    return query as unknown as Promise<{
      data: OrdenCompraRow[] | null;
      error: { message: string } | null;
    }>;
  });
}

/** Líneas de una orden de compra para notificación al proveedor (lectura Supabase). */
export async function listOrdenCompraLineas(
  idOrdenCompra: string,
): Promise<OrdenCompraLineaRow[]> {
  const ordenId = idOrdenCompra.trim();

  if (!ordenId) {
    throw new DomainServiceError(
      "La orden de compra no es válida.",
      "INVALID_ARGUMENT",
    );
  }

  const rows = await runDomainQuery<OrdenCompraLineaDbRow[]>((client) => {
    const query = client
      .from("orden_compra_linea")
      .select(ORDEN_LINEA_COLUMNS)
      .eq("id_orden_compra", ordenId);

    return query as unknown as Promise<{
      data: OrdenCompraLineaDbRow[] | null;
      error: { message: string } | null;
    }>;
  });

  const lineas = rows
    .map(mapOrdenCompraLineaRow)
    .filter((linea): linea is OrdenCompraLineaRow => linea !== null);

  if (!lineas.length) {
    throw new DomainServiceError(
      "La orden no tiene líneas válidas para notificar.",
      "INVALID_ARGUMENT",
    );
  }

  return lineas;
}

export async function listRecepciones(
  params: TenantListParams,
): Promise<RecepcionCompraRow[]> {
  const limit = params.limit ?? DEFAULT_LIST_LIMIT;

  return runDomainQuery((client) => {
    const query = applyTenantFilters(
      client.from("recepcion_compra").select(RECEPCION_COLUMNS),
      params,
    )
      .order("created_at", { ascending: false })
      .limit(limit);

    return query as unknown as Promise<{
      data: RecepcionCompraRow[] | null;
      error: { message: string } | null;
    }>;
  });
}
