# src/components/layouts/

Estructuras de página y layouts compartidos.

## Propósito

Define el esqueleto visual de las distintas secciones de la aplicación: panel principal, autenticación, impresión, etc.

## Ejemplos previstos

- `DashboardLayout` — sidebar + header + área de contenido
- `AuthLayout` — layout centrado para login/registro
- `PageHeader` — título, breadcrumbs y acciones de página
- `Sidebar` — navegación principal del WMS

## Convención

- Los layouts se usan en `src/app/` mediante composición o grupos de rutas.
- La navegación del sidebar debe reflejar los módulos definidos en `src/config/routes.ts`.
