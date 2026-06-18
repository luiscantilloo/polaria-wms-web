# src/components/shared/

Componentes compartidos entre módulos de negocio.

## Propósito

Componentes con algo de contexto de dominio pero usados en más de un módulo. Distintos de `ui/` (primitivos) y de los componentes internos de cada módulo.

## Ejemplos previstos

- `StatusBadge` — badge de estado de órdenes (pendiente, completado, cancelado)
- `EmptyState` — estado vacío con ilustración y CTA
- `ConfirmDialog` — diálogo de confirmación genérico
- `DataTable` — tabla con ordenamiento, filtros y paginación
- `UserAvatar` — avatar con iniciales o foto del usuario

## Convención

- Si un componente solo lo usa un módulo, muévelo a ese módulo.
- Si solo es un primitivo visual, muévelo a `ui/`.
