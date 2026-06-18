# src/lib/

Utilidades y funciones helper compartidas.

## Propósito

Funciones puras sin dependencia de React: formateo, validación, manipulación de datos, helpers de fechas, etc.

## Ejemplos previstos

- `cn()` — combinar clases de Tailwind (clsx + tailwind-merge)
- `formatCurrency()` — formatear montos según locale
- `formatDate()` — formatear fechas consistentemente
- `parseSearchParams()` — parsear query strings de URL

## Convención

- Solo funciones puras o utilidades sin efectos secundarios.
- Sin imports de React ni hooks.
- Sin llamadas directas a API (eso va en `src/services/`).
