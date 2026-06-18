# src/stores/

Estado global de la aplicación.

## Propósito

Gestiona estado compartido que no pertenece a un solo componente ni se resuelve bien con React Context: carrito de picking, filtros globales, preferencias de UI, etc.

## Tecnología prevista

Zustand, Jotai o similar (por definir según necesidades del proyecto).

## Ejemplos previstos

- `useAuthStore` — usuario y sesión (si no se usa solo Context)
- `useUIStore` — sidebar abierto/cerrado, tema
- `useFiltersStore` — filtros activos en listados
- `useNotificationStore` — cola de notificaciones toast

## Convención

- Un store por dominio de estado.
- Los stores no llaman a API directamente; delegan en `src/services/`.
- Prefiere estado local o Context para estado que solo usa un subárbol de componentes.
