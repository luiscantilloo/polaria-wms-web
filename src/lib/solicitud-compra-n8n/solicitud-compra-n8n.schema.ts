import { z } from "zod";

export const solicitudCompraN8nLineaSchema = z.object({
  id_producto: z.string().trim().uuid("id_producto debe ser un UUID válido."),
  sku: z.string().trim().min(1, "El SKU es obligatorio."),
  descripcion: z.string().trim().min(1, "La descripción es obligatoria."),
  cantidad: z.number().finite().positive("La cantidad debe ser mayor a cero."),
});

export const solicitudCompraN8nBodySchema = z.object({
  codigo_cuenta: z.string().trim().min(1, "codigo_cuenta es obligatorio."),
  telefono: z.string().trim().min(1, "telefono es obligatorio."),
  id_proveedor: z.string().trim().uuid("id_proveedor debe ser un UUID válido."),
  razon_social: z.string().trim().min(1, "razon_social es obligatoria."),
  codigo: z.string().trim().min(1, "codigo es obligatorio."),
  estado: z.string().trim().min(1, "estado es obligatorio."),
  solicitud_compra_linea: z
    .array(solicitudCompraN8nLineaSchema)
    .min(1, "Debe incluir al menos una línea."),
  mensaje_final: z.string().trim().min(1, "mensaje_final es obligatorio."),
});

export type SolicitudCompraN8nLinea = z.infer<
  typeof solicitudCompraN8nLineaSchema
>;
export type SolicitudCompraN8nBody = z.infer<typeof solicitudCompraN8nBodySchema>;

export const SOLICITUD_COMPRA_N8N_MENSAJE_DEFAULT =
  "Hola, solicito cotización de los productos detallados.";

export function parseSolicitudCompraN8nBody(input: unknown) {
  return solicitudCompraN8nBodySchema.safeParse(input);
}

export function formatSolicitudCompraN8nValidationError(
  error: z.ZodError,
): string {
  return error.issues.map((issue) => issue.message).join(" ");
}

/** Etiqueta de negocio para n8n al crear la solicitud (estado borrador en BD). */
export function mapSolicitudCompraEstadoN8n(estadoDb: string): string {
  if (estadoDb === "borrador") {
    return "Iniciado";
  }

  return estadoDb;
}
