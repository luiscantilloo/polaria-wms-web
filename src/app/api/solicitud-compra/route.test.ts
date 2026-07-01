import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

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

describe("POST /api/solicitud-compra", () => {
  beforeEach(() => {
    vi.stubEnv(
      "SOLICITUD_COMPRA_WEBHOOK_URL",
      "https://polariatech.app.n8n.cloud/webhook-test/solicitudcompra",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("responde 503 si falta la URL del webhook", async () => {
    vi.stubEnv("SOLICITUD_COMPRA_WEBHOOK_URL", "");

    const response = await POST(
      new Request("http://localhost/api/solicitud-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Integración de solicitud de compra no configurada.",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reenvía el payload al webhook n8n", async () => {
    const response = await POST(
      new Request("http://localhost/api/solicitud-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "https://polariatech.app.n8n.cloud/webhook-test/solicitudcompra",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"codigo_cuenta":"49M04"'),
      }),
    );

    const json = await response.json();
    expect(json).toMatchObject({
      ok: true,
      n8nStatus: 200,
    });
    expect(json.correlationId).toEqual(expect.any(String));
  });

  it("responde 502 si n8n devuelve error HTTP", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const response = await POST(
      new Request("http://localhost/api/solicitud-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      n8nStatus: 500,
    });
  });
});

describe("GET /api/solicitud-compra", () => {
  it("responde 405", async () => {
    const response = GET();

    expect(response.status).toBe(405);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Method not allowed.",
    });
  });
});
