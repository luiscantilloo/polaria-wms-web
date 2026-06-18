# src/components/

Componentes React reutilizables de la interfaz de usuario.

## Propósito

Centraliza la UI compartida entre módulos. Los componentes aquí no contienen lógica de negocio del WMS; esa vive en `src/modules/`.

## Subcarpetas

| Carpeta    | Descripción                                              |
|------------|----------------------------------------------------------|
| `ui/`      | Primitivos de UI: botones, inputs, modales, tablas       |
| `forms/`   | Componentes de formulario compuestos y validación        |
| `layouts/` | Estructuras de página: sidebar, header, contenedores     |
| `shared/`  | Componentes compartidos entre módulos (badges, cards)    |
| `auth/`    | Componentes específicos de autenticación (login form)    |

## Convención

- Un componente por archivo, exportación nombrada o por defecto según el patrón del proyecto.
- Los componentes de `ui/` son agnósticos al dominio; no conocen inventario, ventas, etc.
- Importa desde `@/components/ui/button`, no con rutas relativas profundas.
