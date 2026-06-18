# src/components/ui/

Primitivos de interfaz de usuario (design system base).

## Propósito

Componentes atómicos y reutilizables que forman la base visual de toda la aplicación. Inspirados en patrones como shadcn/ui.

## Ejemplos previstos

- `Button`, `Input`, `Select`, `Checkbox`
- `Dialog`, `Dropdown`, `Tooltip`
- `Table`, `Pagination`, `Badge`
- `Card`, `Skeleton`, `Spinner`

## Convención

- Sin lógica de negocio ni llamadas a API.
- Aceptan props de estilo y accesibilidad (ARIA).
- Usan tokens de Tailwind definidos en `globals.css`.
