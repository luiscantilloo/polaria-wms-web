# src/components/forms/

Componentes de formulario reutilizables.

## Propósito

Formularios y campos compuestos que se usan en varios módulos del WMS: creación de productos, órdenes de compra, usuarios, etc.

## Ejemplos previstos

- `FormField` — wrapper con label, error y descripción
- `SearchInput` — campo de búsqueda con debounce
- `DateRangePicker` — selector de rango de fechas
- `FileUpload` — carga de archivos (facturas, guías)

## Convención

- La validación de esquemas (Zod) puede vivir junto al formulario o en el módulo que lo consume.
- Los formularios específicos de un módulo (ej. `CreatePurchaseOrderForm`) van en `src/modules/purchases/`, no aquí.
