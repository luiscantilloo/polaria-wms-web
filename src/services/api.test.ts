import { describe, expect, it } from "vitest";
import { mapApiError } from "@/services/api";

describe("mapApiError", () => {
  it("maps 401 to credenciales inválidas", () => {
    const error = mapApiError(401);
    expect(error.message).toBe("Credenciales inválidas");
    expect(error.status).toBe(401);
  });

  it("maps 422 to código de empresa requerido", () => {
    const error = mapApiError(422);
    expect(error.message).toBe("Debes ingresar código de empresa");
  });

  it("maps 5xx to server error", () => {
    const error = mapApiError(500);
    expect(error.message).toContain("Error del servidor");
  });
});
