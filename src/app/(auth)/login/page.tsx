"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPostLoginRoute } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginFlow } from "@/components/auth/LoginFlow";

export default function LoginPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const context = useAuthStore((s) => s.context);
  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const didCheckExistingSession = useRef(false);

  // Solo redirige si el usuario YA tenía sesión al abrir /login (no tras un login nuevo).
  useEffect(() => {
    if (!isHydrated || didCheckExistingSession.current) return;
    didCheckExistingSession.current = true;

    if (!accessToken) return;

    const scope = session?.scope ?? context?.scope;
    if (scope) {
      router.replace(getPostLoginRoute(scope));
    }
  }, [accessToken, context?.scope, isHydrated, router, session?.scope]);

  return (
    <AuthLayout>
      <LoginFlow />
    </AuthLayout>
  );
}
