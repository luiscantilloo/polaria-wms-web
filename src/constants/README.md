# src/constants/

Constantes globales de la aplicación.

## Propósito

Valores fijos que se usan en múltiples módulos: roles de usuario, permisos, estados de órdenes, límites de paginación, etc.

## Archivos previstos

| Archivo           | Descripción                                      |
|-------------------|--------------------------------------------------|
| `roles.ts`        | Roles del sistema (admin, operador, supervisor)  |
| `permissions.ts`  | Permisos granulares por acción y recurso         |

## Convención

- Usa `as const` para inferencia estricta de tipos.
- Exporta tipos derivados: `type Role = (typeof ROLES)[keyof typeof ROLES]`.
- No incluyas lógica aquí; solo datos inmutables.
