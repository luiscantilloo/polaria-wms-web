# src/types/

Definiciones de tipos TypeScript compartidos.

## Propósito

Tipos, interfaces y enums usados en múltiples módulos. Evita duplicar definiciones de entidades entre carpetas.

## Archivos previstos

| Archivo     | Descripción                                    |
|-------------|------------------------------------------------|
| `index.ts`  | Re-exportación de todos los tipos públicos     |
| `api.ts`    | Tipos de respuestas y errores de API           |
| `common.ts` | Tipos genéricos (PaginatedResponse, ID, etc.)  |

## Convención

- Los tipos específicos de un módulo van en `src/modules/<modulo>/types/`.
- Solo los tipos transversales (usados en 2+ módulos) van aquí.
- Prefiere `interface` para objetos y `type` para uniones y utilidades.

## Ejemplo

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```
