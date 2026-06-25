import {
  DEFAULT_LIST_LIMIT,
  runDomainMutation,
  runDomainQuery,
} from "@/lib/supabase/domain-query";
import { DomainServiceError } from "@/lib/domain-service-error";
import {
  generateCodigoCuentaFromNombre,
  normalizeCodigoCuentaInput,
} from "@/lib/generate-codigo-cuenta";

export interface CuentaListRow {
  codigoCuenta: string;
  nombreComercial: string;
  bodegaAsignada: string;
  tieneCredenciales: boolean;
}

interface CuentaBodegaDbRow {
  nombre: string;
  esta_activa: boolean;
}

interface CuentaUsuarioDbRow {
  esta_activo: boolean;
}

interface CuentaDbRow {
  codigo_cuenta: string;
  nombre_comercial: string;
  bodega: CuentaBodegaDbRow[] | null;
  usuario: CuentaUsuarioDbRow[] | null;
}

/**
 * PostgREST: cuenta↔usuario tiene dos FK (id_creador y usuario.codigo_cuenta).
 * Hay que nombrar la relación explícita para los usuarios de la cuenta.
 */
const CUENTA_LIST_COLUMNS =
  "codigo_cuenta,nombre_comercial,bodega(nombre,esta_activa),usuario!fk_usuario_cuenta(esta_activo)";

function mapCuentaRow(row: CuentaDbRow): CuentaListRow {
  const bodegasActivas = (row.bodega ?? []).filter((item) => item.esta_activa);
  const usuariosActivos = (row.usuario ?? []).filter((item) => item.esta_activo);

  return {
    codigoCuenta: row.codigo_cuenta,
    nombreComercial: row.nombre_comercial,
    bodegaAsignada:
      bodegasActivas.map((item) => item.nombre).join(", ") || "—",
    tieneCredenciales: usuariosActivos.length > 0,
  };
}

/** Lista cuentas comerciales activas para el configurador (scope platform). */
export async function listCuentasConfigurator(): Promise<CuentaListRow[]> {
  const rows = await runDomainQuery<CuentaDbRow[]>((client) => {
    const query = client
      .from("cuenta")
      .select(CUENTA_LIST_COLUMNS)
      .eq("esta_activa", true)
      .order("nombre_comercial", { ascending: true })
      .limit(DEFAULT_LIST_LIMIT);

    return query as unknown as Promise<{
      data: CuentaDbRow[] | null;
      error: { message: string } | null;
    }>;
  });

  return rows.map(mapCuentaRow);
}

export interface CreateCuentaInput {
  codigoCuenta: string;
  nombreComercial: string;
  idCreador?: string | null;
}

async function resolveDefaultCodigoEmpresa(): Promise<string> {
  const rows = await runDomainQuery<{ codigo_empresa: string }[]>((client) => {
    const query = client
      .from("empresa")
      .select("codigo_empresa")
      .eq("esta_activa", true)
      .order("codigo_empresa", { ascending: true })
      .limit(1);

    return query as unknown as Promise<{
      data: { codigo_empresa: string }[] | null;
      error: { message: string } | null;
    }>;
  });

  const codigoEmpresa = rows[0]?.codigo_empresa;
  if (!codigoEmpresa) {
    throw new DomainServiceError(
      "No hay empresas activas para asociar la cuenta.",
      "INVALID_ARGUMENT",
    );
  }

  return codigoEmpresa;
}

/** Crea una cuenta comercial desde el configurador (scope platform). */
export async function createCuentaConfigurator(
  input: CreateCuentaInput,
): Promise<CuentaListRow> {
  const nombreComercial = input.nombreComercial.trim();
  const codigoCuenta = normalizeCodigoCuentaInput(input.codigoCuenta);

  if (!nombreComercial) {
    throw new DomainServiceError(
      "El nombre de la cuenta es obligatorio.",
      "INVALID_ARGUMENT",
    );
  }

  if (!codigoCuenta) {
    throw new DomainServiceError(
      "El código de la cuenta es obligatorio.",
      "INVALID_ARGUMENT",
    );
  }

  const codigoEmpresa = await resolveDefaultCodigoEmpresa();

  await runDomainMutation<{ codigo_cuenta: string } | null>((client) => {
    const query = client.from("cuenta").insert({
      codigo_cuenta: codigoCuenta,
      codigo_empresa: codigoEmpresa,
      nombre_comercial: nombreComercial,
      id_creador: input.idCreador ?? null,
      esta_activa: true,
    });

    return query as unknown as Promise<{
      data: { codigo_cuenta: string } | null;
      error: { message: string } | null;
    }>;
  });

  return {
    codigoCuenta,
    nombreComercial,
    bodegaAsignada: "—",
    tieneCredenciales: false,
  };
}
