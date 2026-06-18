# src/app/

Directorio raíz del **App Router** de Next.js. Aquí viven las páginas, layouts y rutas API de la aplicación.

## Propósito

Define la estructura de rutas basada en el sistema de archivos. Cada carpeta representa un segmento de URL.

## Archivos actuales

| Archivo        | Descripción                                      |
|----------------|--------------------------------------------------|
| `layout.tsx`   | Layout raíz: fuentes, metadatos y estructura HTML |
| `page.tsx`     | Página de inicio (`/`)                           |
| `globals.css`  | Estilos globales y configuración de Tailwind     |

## Convenciones previstas

```
app/
├── (auth)/          # Grupo de rutas de autenticación (login, registro)
├── (dashboard)/     # Grupo de rutas protegidas del panel principal
│   ├── inventory/
│   ├── sales/
│   └── ...
├── api/             # Route Handlers (endpoints API)
├── layout.tsx
└── page.tsx
```

## Notas

- Los grupos de rutas con paréntesis `(nombre)` organizan layouts sin afectar la URL.
- Los archivos `loading.tsx`, `error.tsx` y `not-found.tsx` manejan estados de UI por segmento.
