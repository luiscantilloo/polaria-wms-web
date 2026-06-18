# src/styles/

Estilos globales adicionales.

## Propósito

Complementa `src/app/globals.css` con hojas de estilo que no encajan en el archivo principal: temas, animaciones, utilidades CSS personalizadas.

## Contenido típico

- `animations.css` — keyframes y clases de animación
- `print.css` — estilos para impresión de documentos (facturas, guías)
- Variables CSS adicionales no cubiertas por Tailwind

## Convención

- Los estilos base y configuración de Tailwind viven en `src/app/globals.css`.
- Usa esta carpeta solo cuando `globals.css` crezca demasiado o necesites separación por responsabilidad.
- Evita CSS modules aquí; los componentes usan Tailwind inline o CSS modules en su propia carpeta.
