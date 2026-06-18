# src/components/auth/

Componentes de interfaz relacionados con autenticación.

## Propósito

UI específica del flujo de login, registro, recuperación de contraseña y sesión. Complementa la lógica del módulo `src/modules/auth/`.

## Ejemplos previstos

- `LoginForm` — formulario de inicio de sesión
- `RegisterForm` — formulario de registro
- `ForgotPasswordForm` — solicitud de restablecimiento
- `AuthGuard` — wrapper que redirige si no hay sesión
- `RoleGate` — renderiza hijos solo si el usuario tiene el rol requerido

## Convención

- La lógica de autenticación (tokens, sesiones) va en `src/modules/auth/` y `src/services/`.
- Estos componentes solo manejan presentación e interacción del usuario.
