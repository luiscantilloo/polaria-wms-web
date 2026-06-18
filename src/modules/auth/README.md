# Módulo: auth

Autenticación y gestión de sesiones.

## Responsabilidades

- Inicio y cierre de sesión
- Registro de usuarios
- Recuperación de contraseña
- Renovación de tokens y persistencia de sesión
- Integración con Supabase Auth

## Funcionalidades previstas

- Login con email/contraseña
- Protección de rutas según estado de autenticación
- Redirección post-login según rol del usuario
- Manejo de sesión expirada

## Relación con otras carpetas

- UI de login → `src/components/auth/`
- Cliente Supabase → `src/services/supabase.ts`
- Roles y permisos → `src/constants/`
