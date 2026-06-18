# src/hooks/

Custom hooks de React reutilizables.

## Propósito

Encapsula lógica con estado y efectos que se comparte entre componentes: fetching de datos, debounce, media queries, permisos, etc.

## Ejemplos previstos

- `useDebounce` — retrasa actualizaciones de valor
- `useMediaQuery` — detecta breakpoints responsive
- `usePermissions` — verifica permisos del usuario actual
- `usePagination` — estado de paginación para tablas
- `useLocalStorage` — persistencia en localStorage

## Convención

- Un hook por archivo, prefijo `use`.
- Los hooks específicos de un módulo van en `src/modules/<modulo>/hooks/`.
- Los hooks que llaman a API deben usar servicios de `src/services/`.
