import type { AuthSession } from "@/types/auth";

/** URL base del chatbot Mateo desplegado en Vercel */
const MATEO_BASE_URL = "https://chatbot-mateo.vercel.app";

/**
 * Estructura del payload de usuario que el chatbot Mateo espera
 * en el parámetro de URL `polaria_user` (base64 JSON).
 *
 * El chatbot debe leer este param en su `useAuth.js` al montarse
 * y guardarlo en localStorage bajo la clave `polaria_user`.
 */
export interface MateoChatUser {
  name: string;
  email: string;
  username: string;
  role: string;
}

/**
 * Construye la URL del chatbot con los datos del usuario
 * codificados en base64 como query param `polaria_user`.
 */
export function buildMateoUrl(session: AuthSession): string {
  const payload: MateoChatUser = {
    name: session.nombre,
    email: session.correo,
    username: session.username,
    role: session.nombreRol,
  };

  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return `${MATEO_BASE_URL}?polaria_user=${encodeURIComponent(encoded)}`;
}

/**
 * Abre el chatbot Mateo en una nueva pestaña con el usuario
 * pre-autenticado vía SSO (URL param).
 */
export function openMateoInNewTab(session: AuthSession): void {
  window.open(buildMateoUrl(session), "_blank", "noopener,noreferrer");
}

/**
 * Determina si un identificador de login es correo electrónico.
 * Correo → WMS web.  Username/identificador → Mateo chatbot.
 */
export function isEmailIdentificador(value: string): boolean {
  return value.includes("@");
}
