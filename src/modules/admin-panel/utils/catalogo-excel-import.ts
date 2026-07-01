import * as XLSX from "xlsx";
import {
  CATALOGO_ESTADO_DEFAULT,
  CATALOGO_TIPO_PRIMARIO,
  CATALOGO_TIPO_SECUNDARIO,
  createEmptyCatalogoMetadatos,
  type CatalogoProductoMetadatos,
} from "../constants/catalogo-producto";

export interface CatalogoExcelImportRow {
  sku: string;
  titulo: string;
  tipo: "primario" | "secundario";
  skuPrimario?: string;
  unidadVisualizacion: string;
  metadatos: CatalogoProductoMetadatos;
}

export interface CatalogoExcelParseResult {
  rows: CatalogoExcelImportRow[];
  errors: string[];
}

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function parseSiNo(value: string): boolean | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (["si", "sí", "yes", "true", "1"].includes(normalized)) return true;
  if (["no", "false", "0"].includes(normalized)) return false;
  return undefined;
}

function resolveTipo(value: string): "primario" | "secundario" {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("secund")) return "secundario";
  return "primario";
}

function resolveHeaderKey(header: string): string | null {
  const key = normalizeHeader(header);

  if (["sku"].includes(key)) return "sku";
  if (["titulo", "title"].includes(key)) return "titulo";
  if (["slug"].includes(key)) return "slug";
  if (["descripcion", "description"].includes(key)) return "descripcion";
  if (["proveedor", "vendor"].includes(key)) return "proveedor";
  if (["categoria", "category"].includes(key)) return "categoria";
  if (["tipo", "type"].includes(key)) return "tipo";
  if (["etiquetas", "tags"].includes(key)) return "etiquetas";
  if (["publicado", "published"].includes(key)) return "publicado";
  if (["estado", "status"].includes(key)) return "estado";
  if (["codigo", "code"].includes(key)) return "codigo";
  if (["cod barras", "codigo barras", "barcode"].includes(key)) {
    return "codigoBarras";
  }
  if (["precio", "price"].includes(key)) return "precio";
  if (["impuesto", "tax"].includes(key)) return "impuesto";
  if (["tracker inv", "tracker inventario", "inventory tracker"].includes(key)) {
    return "rastreadorInventario";
  }
  if (["stock", "cantidad inventario"].includes(key)) return "cantidadInventario";
  if (["vinculado", "sku primario", "primario", "incluido primario"].includes(key)) {
    return "skuPrimario";
  }
  if (["unidad visualizacion", "unidad"].includes(key)) {
    return "unidadVisualizacion";
  }

  return null;
}

function mapRecordToRow(
  record: Record<string, unknown>,
  lineNumber: number,
): { row?: CatalogoExcelImportRow; error?: string } {
  const mapped: Record<string, string> = {};

  for (const [header, value] of Object.entries(record)) {
    const field = resolveHeaderKey(header);
    if (!field) continue;
    mapped[field] = cellValue(value);
  }

  const sku = mapped.sku ?? "";
  const titulo = mapped.titulo || mapped.descripcion || "";
  const tipo = resolveTipo(mapped.tipo ?? "");

  if (!sku && !titulo) {
    return {};
  }

  if (!sku) {
    return { error: `Fila ${lineNumber}: falta SKU.` };
  }

  if (!titulo) {
    return { error: `Fila ${lineNumber}: falta Título.` };
  }

  if (tipo === "secundario" && !mapped.skuPrimario) {
    return {
      error: `Fila ${lineNumber}: el secundario "${sku}" requiere SKU primario en columna Vinculado.`,
    };
  }

  const publicado = parseSiNo(mapped.publicado ?? "");
  const impuesto = parseSiNo(mapped.impuesto ?? "");
  const unidadVisualizacion =
    mapped.unidadVisualizacion?.toLowerCase() === "peso" ? "peso" : "cantidad";

  const metadatos: CatalogoProductoMetadatos = {
    ...createEmptyCatalogoMetadatos(),
    titulo,
    slug: mapped.slug || undefined,
    descripcion: mapped.descripcion || titulo,
    proveedor: mapped.proveedor || undefined,
    categoria: mapped.categoria || undefined,
    tipo: tipo === "secundario" ? CATALOGO_TIPO_SECUNDARIO : CATALOGO_TIPO_PRIMARIO,
    etiquetas: mapped.etiquetas || undefined,
    estado: mapped.estado || CATALOGO_ESTADO_DEFAULT,
    codigoBarras: mapped.codigoBarras || undefined,
    precio: mapped.precio || undefined,
    rastreadorInventario: mapped.rastreadorInventario || undefined,
    cantidadInventario: mapped.cantidadInventario || undefined,
    vinculadoOpcion1: mapped.skuPrimario || undefined,
    ...(publicado !== undefined ? { publicadoTienda: publicado } : {}),
    ...(impuesto !== undefined ? { cobrarImpuesto: impuesto } : {}),
  };

  return {
    row: {
      sku,
      titulo,
      tipo,
      skuPrimario: mapped.skuPrimario || undefined,
      unidadVisualizacion,
      metadatos,
    },
  };
}

/** Parsea la primera hoja de un Excel/CSV exportado del catálogo. */
export async function parseCatalogoSpreadsheetFile(
  file: File,
): Promise<CatalogoExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { rows: [], errors: ["El archivo no tiene hojas."] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  const rows: CatalogoExcelImportRow[] = [];
  const errors: string[] = [];

  rawRows.forEach((record, index) => {
    const result = mapRecordToRow(record, index + 2);
    if (result.error) {
      errors.push(result.error);
      return;
    }
    if (result.row) {
      rows.push(result.row);
    }
  });

  if (!rows.length && !errors.length) {
    errors.push("No se encontraron filas con SKU y Título.");
  }

  return { rows, errors };
}
