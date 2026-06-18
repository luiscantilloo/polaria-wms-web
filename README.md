# Polaria WMS Web

Frontend web del **Sistema de Gestión de Almacenes (WMS)** Polaria. Construido con [Next.js 16](https://nextjs.org), React 19 y TypeScript.

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # configurar URL del API
npm run dev
```

Abre [http://localhost:3000/login](http://localhost:3000/login) en el navegador.

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_BASE_URL` | URL del backend `polaria-wms-api` | `http://localhost:3001` |

Ver [docs/AUTH.md](docs/AUTH.md) para el flujo de login completo y pruebas manuales.

## Scripts disponibles

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `npm run dev`  | Servidor de desarrollo               |
| `npm run build`| Compilación de producción            |
| `npm run start`| Servidor de producción               |
| `npm run lint` | Análisis estático con ESLint         |
| `npm test`     | Tests unitarios (Vitest)             |

## Estructura del proyecto

```
polaria-wms-web/
├── public/              # Archivos estáticos públicos (favicon, imágenes, SVG)
├── src/
│   ├── app/             # App Router de Next.js (páginas, layouts, rutas API)
│   ├── assets/          # Recursos estáticos internos (iconos, imágenes)
│   ├── components/      # Componentes React reutilizables
│   ├── config/          # Configuración de la aplicación (env, rutas)
│   ├── constants/       # Constantes globales (roles, permisos)
│   ├── hooks/           # Custom hooks de React
│   ├── lib/             # Utilidades y helpers compartidos
│   ├── modules/         # Módulos de dominio del WMS (lógica por área de negocio)
│   ├── providers/       # Proveedores de contexto React
│   ├── services/        # Capa de servicios (API, Supabase, integraciones)
│   ├── stores/          # Estado global de la aplicación
│   ├── styles/          # Estilos globales adicionales
│   └── types/           # Definiciones de tipos TypeScript
├── next.config.ts       # Configuración de Next.js
├── tsconfig.json        # Configuración de TypeScript
└── postcss.config.mjs   # Configuración de PostCSS / Tailwind CSS
```

Cada carpeta dentro de `src/` tiene su propio `README.md` con detalles sobre su propósito y convenciones.

## Stack tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Lenguaje:** TypeScript 5
- **Backend (previsto):** Supabase

## Estado actual

- **Auth / Login:** flujo de 3 escenas implementado y conectado al API (`/auth/prelogin`, `/auth/login`, `/auth/me`, `/auth/logout`).
- **Resto de módulos WMS:** estructura definida; implementación pendiente.
