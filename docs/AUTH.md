# Autenticación — Polaria WMS Web

Flujo de login en 3 escenas conectado al backend `polaria-wms-api`.

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | URL base del API de auth | `http://localhost:3000` |

En desarrollo, el frontend proxea las peticiones del navegador vía `/api/*` → backend, evitando errores de CORS cuando front y back corren en puertos distintos (ej. front `:3001`, back `:3000`).

## Cómo correr en local

1. Levanta el backend (`polaria-wms-api`) en el puerto **3000** (o el que configures en `.env.local`).
2. Configura `.env.local` con la URL del API.
3. Arranca el frontend:

```bash
npm install
npm run dev
```

4. Abre [http://localhost:3001/login](http://localhost:3001/login).

## Flujo de prueba manual

### Configurador (scope platform)

1. Ir a `/login`.
2. Ingresar identificador: `configurador`.
3. Clic en **Continuar** → escena de contraseña con preview del usuario.
4. Ingresar contraseña y **Iniciar sesión**.
5. Ver escena de éxito → redirección automática a `/platform`.

### Usuario tenant (requiere empresa)

1. Ingresar identificador: `admin.acme` (o el username configurado).
2. Clic en **Continuar**.
3. Si el API responde `422`, aparece el campo **Código de empresa** en la misma escena.
4. Ingresar código: `ACME` y **Continuar** de nuevo.
5. Ingresar contraseña → **Iniciar sesión**.
6. Redirección a `/dashboard`.

## Arquitectura

```
components/auth/     → UI (LoginStepUser, LoginStepPassword, LoginStepSuccess, LoginFlow)
modules/auth/        → Servicio API (prelogin, login, me, logout)
services/api.ts      → Cliente HTTP + interceptor Bearer + errores tipados
stores/auth.store.ts → Estado de sesión (sessionStorage)
providers/           → AuthProvider (hidrata sesión al cargar)
components/auth/     → AuthGuard (protege /platform y /dashboard)
```

## Endpoints consumidos

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/auth/prelogin` | Validar usuario y obtener preview |
| POST | `/auth/login` | Autenticación con contraseña |
| GET | `/auth/me` | Hidratar contexto de sesión |
| POST | `/auth/logout` | Cerrar sesión |

## Errores manejados en UI

| HTTP | Mensaje |
|------|---------|
| 401 | Credenciales inválidas |
| 403 | No autorizado para esta empresa/cuenta |
| 404 | Usuario no encontrado o inactivo |
| 422 | Debes ingresar código de empresa |
| 5xx | Error del servidor |

## Tests

```bash
npm test
```

Incluye pruebas del mapeo de errores y del happy path del servicio de auth (con `fetch` mockeado en tests; la app en runtime usa el backend real).
