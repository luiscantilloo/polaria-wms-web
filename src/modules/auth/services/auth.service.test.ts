import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMe, login, prelogin } from "@/modules/auth/services/auth.service";

vi.mock("@/config/env", () => ({
  env: { apiBaseUrl: "http://localhost:3000" },
  getApiBaseUrl: () => "/api",
}));

describe("auth service happy path", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("completes prelogin for configurador (platform flow)", async () => {
    const mockPreview = {
      flow: "platform" as const,
      userPreview: {
        nombre: "Configurador",
        identificador: "configurador",
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPreview,
      }),
    );

    const result = await prelogin({ identificador: "configurador" });

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/prelogin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ identificador: "configurador" }),
      }),
    );
    expect(result.flow).toBe("platform");
    expect(result.userPreview.nombre).toBe("Configurador");
  });

  it("completes login and returns tokens with context", async () => {
    const mockLoginResponse = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      context: { scope: "platform" as const },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockLoginResponse,
      }),
    );

    const result = await login({
      identificador: "configurador",
      password: "secret",
    });

    expect(result.accessToken).toBe("access-token");
    expect(result.context.scope).toBe("platform");
  });

  it("calls GET /auth/me with Bearer token", async () => {
    const { setAccessTokenGetter } = await import("@/services/api");
    setAccessTokenGetter(() => "test-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          idUsuario: "1",
          idAuth: "auth-1",
          nombre: "Administrador",
          username: "admin.acme",
          correo: "admin@acme.com",
          idRol: "admin",
          nombreRol: "Administrador",
          nivelRol: "empresa",
          codigoEmpresa: "ACME",
          razonSocialEmpresa: "ACME Corp",
          codigoCuenta: null,
          nombreComercialCuenta: null,
          scope: "tenant",
        }),
      }),
    );

    const session = await getMe();

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );

    const call = vi.mocked(fetch).mock.calls[0];
    const headers = call[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer test-token");
    expect(session.scope).toBe("tenant");
    expect(session.nombre).toBe("Administrador");
    expect(session.username).toBe("admin.acme");
  });
});
