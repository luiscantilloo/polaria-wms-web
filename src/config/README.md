# src/config/

Configuración centralizada de la aplicación.

## Propósito

Un solo lugar para variables de entorno tipadas, rutas de navegación y ajustes globales que no son constantes de dominio.

## Archivos previstos

| Archivo      | Descripción                                           |
|--------------|-------------------------------------------------------|
| `env.ts`     | Variables de entorno validadas y tipadas              |
| `routes.ts`  | Mapa de rutas y navegación del WMS                    |

## Convención

- Nunca accedas a `process.env` directamente en componentes; usa `env.ts`.
- Las rutas deben ser la fuente única de verdad para links y redirecciones.
- Ejemplo de variable: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
