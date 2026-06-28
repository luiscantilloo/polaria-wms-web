import {
  DEFAULT_LIST_LIMIT,
  runDomainQuery,
} from "@/lib/supabase/domain-query";
import type { TipoIntegracion } from "@/modules/account-integration/constants/integration-types";
import {
  mapSolicitudIntegracionRow,
  SOLICITUD_INTEGRACION_SELECT_COLUMNS,
  type SolicitudIntegracionDbRow,
} from "@/modules/account-integration/services/integracion-bodega.service";

const CONFIGURATOR_SOLICITUD_INTEGRACION_SELECT = `${SOLICITUD_INTEGRACION_SELECT_COLUMNS},cuenta(nombre_comercial)`;

interface ConfiguratorSolicitudIntegracionDbRow extends SolicitudIntegracionDbRow {
  cuenta: { nombre_comercial: string } | null;
}

export interface ConfiguratorSolicitudIntegracionRow {
  idSolicitudIntegracion: string;
  codigoCuenta: string;
  cuentaNombre: string;
  bodegaExternaId: string;
  bodegaNombre: string;
  tipoIntegracion: TipoIntegracion | null;
  estado: string;
  createdAt: string;
}

function mapConfiguratorSolicitudIntegracionRow(
  row: ConfiguratorSolicitudIntegracionDbRow,
): ConfiguratorSolicitudIntegracionRow {
  const base = mapSolicitudIntegracionRow(row);

  return {
    ...base,
    codigoCuenta: row.codigo_cuenta,
    cuentaNombre: row.cuenta?.nombre_comercial?.trim() || row.codigo_cuenta,
  };
}

/** Lista solicitudes de integración visibles para el configurador (scope platform, solo lectura). */
export async function listSolicitudesIntegracionConfigurator(): Promise<
  ConfiguratorSolicitudIntegracionRow[]
> {
  const rows = await runDomainQuery<ConfiguratorSolicitudIntegracionDbRow[]>(
    (client) => {
      const query = client
        .from("solicitud_integracion")
        .select(CONFIGURATOR_SOLICITUD_INTEGRACION_SELECT)
        .order("created_at", { ascending: false })
        .limit(DEFAULT_LIST_LIMIT);

      return query as unknown as Promise<{
        data: ConfiguratorSolicitudIntegracionDbRow[] | null;
        error: { message: string } | null;
      }>;
    },
  );

  return rows.map(mapConfiguratorSolicitudIntegracionRow);
}
