"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppTopbar } from "./AppTopbar";

interface AppShellLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout global de la aplicación autenticada.
 * Incluye topbar compartido para todos los roles y vistas.
 */
export function AppShellLayout({ children }: AppShellLayoutProps) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col bg-polaria-bg">
        <div
          aria-hidden
          className="polaria-aurora pointer-events-none absolute inset-0"
        />
        <AppTopbar />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-polaria-teal opacity-40"
        />
      </div>
    </AuthGuard>
  );
}
