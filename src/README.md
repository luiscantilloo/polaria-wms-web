# src/

Código fuente de la aplicación Polaria WMS.

## Propósito

Contiene toda la lógica, interfaz y configuración del frontend. Next.js resuelve las rutas desde `app/` y el resto de carpetas organizan el código por responsabilidad.

## Mapa de carpetas

```
src/
├── app/          → Páginas y rutas (Next.js App Router)
├── assets/       → Imágenes e iconos importables
├── components/   → Componentes UI reutilizables
├── config/       → Configuración (env, rutas)
├── constants/    → Roles, permisos y constantes
├── hooks/        → Custom hooks de React
├── lib/          → Utilidades puras
├── modules/      → Lógica de negocio por dominio WMS
├── providers/    → Context providers de React
├── services/     → Clientes API y Supabase
├── stores/       → Estado global
├── styles/       → Estilos adicionales
└── types/        → Tipos TypeScript compartidos
```

Cada carpeta incluye un `README.md` con su propósito, convenciones y ejemplos previstos.

## Alias de importación

El proyecto usa el alias `@/` que apunta a `src/`:

```typescript
import { Button } from '@/components/ui/button';
import { ROLES } from '@/constants/roles';
```
