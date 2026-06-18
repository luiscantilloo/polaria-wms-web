# src/assets/

Recursos estáticos internos importados directamente en componentes.

## Propósito

Almacena imágenes, iconos y otros archivos que se importan con `import` en el código TypeScript/JSX. Next.js los optimiza automáticamente al compilar.

## Subcarpetas

| Carpeta   | Contenido                                      |
|-----------|------------------------------------------------|
| `icons/`  | Iconos SVG o PNG usados en la interfaz         |
| `images/` | Imágenes de contenido (banners, ilustraciones)|

## Diferencia con `public/`

- **`src/assets/`** — Se importan en componentes (`import logo from '@/assets/images/logo.png'`). Pasan por el bundler y se optimizan.
- **`public/`** — Se referencian por URL (`/logo.png`). No pasan por el bundler.
