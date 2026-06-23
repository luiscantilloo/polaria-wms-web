import { AUTH_STORAGE_KEY } from "@/lib/auth-storage";

/**
 * Script síncrono que corre antes de React.
 * - Fuerza polaria-auth solo en localStorage (nunca sessionStorage).
 * - Evita que bfcache muestre rutas protegidas sin sesión.
 */
export function AuthSessionScript() {
  const script = `
(function () {
  var KEY = ${JSON.stringify(AUTH_STORAGE_KEY)};

  function purgeSessionAuth() {
    try {
      sessionStorage.removeItem(KEY);
    } catch (e) {}
  }

  function migrateToLocal() {
    try {
      if (!localStorage.getItem(KEY)) {
        var legacy = sessionStorage.getItem(KEY);
        if (legacy) localStorage.setItem(KEY, legacy);
      }
      purgeSessionAuth();
    } catch (e) {}
  }

  function isProtected(path) {
    return path === "/configurador" || path.indexOf("/configurador/") === 0
      || path === "/dashboard" || path.indexOf("/dashboard/") === 0
      || path === "/platform" || path.indexOf("/platform/") === 0;
  }

  function readToken() {
    try {
      migrateToLocal();
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.state && parsed.state.accessToken
        ? parsed.state.accessToken
        : null;
    } catch (e) {
      return null;
    }
  }

  function guardProtectedRoute() {
    migrateToLocal();
    if (!isProtected(window.location.pathname)) return;
    if (!readToken()) {
      window.location.replace("/login");
    }
  }

  window.addEventListener("pageshow", function (event) {
    migrateToLocal();
    if (event.persisted) guardProtectedRoute();
  });

  migrateToLocal();
  guardProtectedRoute();
})();
`;

  return (
    <script
      id="polaria-auth-session-guard"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
