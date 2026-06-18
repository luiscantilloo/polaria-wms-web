# src/providers/

Proveedores de contexto React (Context Providers).

## Propósito

Envuelve la aplicación con contextos globales que comparten estado o servicios entre componentes sin prop drilling.

## Ejemplos previstos

- `AuthProvider` — estado de sesión y usuario autenticado
- `ThemeProvider` — tema claro/oscuro
- `QueryProvider` — cliente de React Query / TanStack Query
- `ToastProvider` — notificaciones globales
- `CompanyProvider` — empresa activa en contexto multi-tenant

## Convención

- Los providers se componen en `src/app/layout.tsx` o en un `Providers.tsx` dedicado.
- Mantén los providers ligeros; la lógica pesada va en hooks o stores.
- Un provider por contexto, un archivo por provider.
