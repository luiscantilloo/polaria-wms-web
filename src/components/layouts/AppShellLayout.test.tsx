import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/services/api";

const { mockMateoHandoff, mockPerformLogout } = vi.hoisted(() => ({
  mockMateoHandoff: vi.fn(),
  mockPerformLogout: vi.fn(),
}));

vi.mock("@/components/auth/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/modules/auth", () => ({
  mateoHandoff: () => mockMateoHandoff(),
}));

vi.mock("@/stores/auth.store", () => ({
  useAuthStore: (
    selector: (state: {
      performLogout: () => Promise<void>;
      session: { nombre: string; identificador: string; scope: string };
    }) => unknown,
  ) =>
    selector({
      performLogout: mockPerformLogout,
      session: {
        nombre: "Usuario Test",
        identificador: "test@polaria.tech",
        scope: "platform",
      },
    }),
}));

vi.mock("@/config/env", () => ({
  env: { mateoUrl: "https://mateo.example.com/" },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { AppShellLayout } from "./AppShellLayout";

describe("AppShellLayout — Mateo IA", () => {
  let locationReplace: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMateoHandoff.mockResolvedValue({ code: "sso-code-123" });
    mockPerformLogout.mockResolvedValue(undefined);

    locationReplace = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { replace: locationReplace, href: "" },
    });
  });

  it("invoca mateoHandoff, performLogout y redirige al SSO de Mateo", async () => {
    const user = userEvent.setup();

    render(
      <AppShellLayout>
        <div>contenido</div>
      </AppShellLayout>,
    );

    await user.click(screen.getByRole("button", { name: "Abrir Mateo IA" }));

    await waitFor(() => {
      expect(mockMateoHandoff).toHaveBeenCalledOnce();
      expect(mockPerformLogout).toHaveBeenCalledOnce();
    });

    expect(mockMateoHandoff.mock.invocationCallOrder[0]).toBeLessThan(
      mockPerformLogout.mock.invocationCallOrder[0],
    );
    expect(locationReplace).toHaveBeenCalledWith(
      "https://mateo.example.com/auth/sso?code=sso-code-123",
    );
  });

  it("no hace logout ni redirect si mateoHandoff falla", async () => {
    const user = userEvent.setup();
    mockMateoHandoff.mockRejectedValue(
      new ApiError("mateo-handoff no disponible", 404),
    );

    render(
      <AppShellLayout>
        <div>contenido</div>
      </AppShellLayout>,
    );

    await user.click(screen.getByRole("button", { name: "Abrir Mateo IA" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(mockPerformLogout).not.toHaveBeenCalled();
    expect(locationReplace).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Abrir Mateo IA" }),
    ).not.toBeDisabled();
  });
});
