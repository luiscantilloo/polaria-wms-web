import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const VALID_BODY = {
  idOrdenCompra: "oc-1",
  idProveedor: "prov-1",
  lineas: [{ sku: "SKU-001", cantidad: 5, unidad: "kg" }],
};

describe("POST /api/pedido-proveedor", () => {
  beforeEach(() => {
    vi.stubEnv(
      "PEDIDO_PROVEEDOR_WEBHOOK_URL",
      "https://n8n.polaria.tech/webhook/polaria-wms-pedido-proveedor",
    );
    vi.stubEnv("PEDIDO_PROVEEDOR_DOCUMENT_ID", "polaria-oc-proveedor-v1");
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

  it("responde 503 si faltan variables de entorno", async () => {
    vi.stubEnv("PEDIDO_PROVEEDOR_WEBHOOK_URL", "");
    vi.stubEnv("PEDIDO_PROVEEDOR_DOCUMENT_ID", "");

    const response = await POST(
      new Request("http://localhost/api/pedido-proveedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Integración de pedido a proveedor no configurada.",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reenvía el payload enriquecido al webhook n8n", async () => {
    const response = await POST(
      new Request("http://localhost/api/pedido-proveedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "https://n8n.polaria.tech/webhook/polaria-wms-pedido-proveedor",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"documentId":"polaria-oc-proveedor-v1"'),
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
      new Request("http://localhost/api/pedido-proveedor", {
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

  it("responde 502 si no se puede contactar n8n", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));

    const response = await POST(
      new Request("http://localhost/api/pedido-proveedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_BODY),
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "No se pudo contactar el webhook de n8n.",
    });
  });
});

describe("GET /api/pedido-proveedor", () => {
  it("responde 405", async () => {
    const response = GET();

    expect(response.status).toBe(405);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Method not allowed.",
    });
  });
});
