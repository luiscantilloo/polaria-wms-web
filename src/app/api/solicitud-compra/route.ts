import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  formatSolicitudCompraN8nValidationError,
  parseSolicitudCompraN8nBody,
  type SolicitudCompraN8nBody,
} from "@/lib/solicitud-compra-n8n/solicitud-compra-n8n.schema";

export interface SolicitudCompraRouteResponse {
  ok: boolean;
  n8nStatus?: number;
  correlationId?: string;
  error?: string;
}

function getSolicitudCompraWebhookUrl(): string | null {
  return process.env.SOLICITUD_COMPRA_WEBHOOK_URL?.trim() ?? null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const webhookUrl = getSolicitudCompraWebhookUrl();

  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "Integración de solicitud de compra no configurada.",
      } satisfies SolicitudCompraRouteResponse,
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Body JSON inválido.",
      } satisfies SolicitudCompraRouteResponse,
      { status: 400 },
    );
  }

  const parsed = parseSolicitudCompraN8nBody(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: formatSolicitudCompraN8nValidationError(parsed.error),
      } satisfies SolicitudCompraRouteResponse,
      { status: 400 },
    );
  }

  const correlationId = randomUUID();
  const payload: SolicitudCompraN8nBody & {
    correlationId: string;
    sentAt: string;
  } = {
    ...parsed.data,
    correlationId,
    sentAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: SolicitudCompraRouteResponse = {
      ok: response.ok,
      n8nStatus: response.status,
      correlationId,
    };

    return NextResponse.json(result, {
      status: response.ok ? 200 : 502,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        n8nStatus: 0,
        correlationId,
        error: "No se pudo contactar el webhook de n8n.",
      } satisfies SolicitudCompraRouteResponse,
      { status: 502 },
    );
  }
}

export function GET(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: "Method not allowed.",
    } satisfies SolicitudCompraRouteResponse,
    { status: 405 },
  );
}
