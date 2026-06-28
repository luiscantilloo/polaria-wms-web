"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { WmsRol } from "@/constants/roles";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth.store";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const OPERADOR_CUENTA_BREADCRUMBS: Readonly<Record<string, string>> = {
  [ROUTES.dashboardCompras]: "Compras",
  [ROUTES.dashboardProcesamiento]: "Procesamiento",
  [ROUTES.dashboardVentas]: "Ventas",
  [ROUTES.dashboardIntegracionCuenta]: "Bodega externa",
};

export function getOperadorCuentaBreadcrumbTrail(
  pathname: string,
): BreadcrumbItem[] | null {
  if (pathname === ROUTES.dashboard) {
    return null;
  }

  const currentLabel = OPERADOR_CUENTA_BREADCRUMBS[pathname];
  if (!currentLabel) {
    return null;
  }

  return [
    { label: "Inicio", href: ROUTES.dashboard },
    { label: currentLabel },
  ];
}

export function OperadorCuentaBreadcrumb() {
  const pathname = usePathname();
  const idRol = useAuthStore((state) => state.session?.idRol);
  const trail =
    idRol === WmsRol.operador_cuenta
      ? getOperadorCuentaBreadcrumbTrail(pathname)
      : null;

  if (!trail) {
    return null;
  }

  return (
    <nav
      aria-label="Ruta operativa"
      className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6"
    >
      <ol className="polaria-text-body-sm flex flex-wrap items-center gap-2 text-polaria-w-50">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-polaria-w-20">
                  /
                </span>
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    isLast ? "text-polaria-teal" : "text-polaria-w",
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition hover:text-polaria-teal"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** @deprecated Usar OperadorCuentaBreadcrumb */
export const DashboardBreadcrumb = OperadorCuentaBreadcrumb;
