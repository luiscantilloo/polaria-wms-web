"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      void hydrateSession();
    }
  }, [hydrateSession, isHydrated]);

  return <>{children}</>;
}
