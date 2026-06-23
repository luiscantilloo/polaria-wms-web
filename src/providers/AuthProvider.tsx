"use client";

import { useEffect, useRef } from "react";
import {
  installAuthSyncListeners,
  revalidateAuthSession,
} from "@/lib/auth-sync";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hasInitialValidated = useRef(false);

  useEffect(() => installAuthSyncListeners(), []);

  useEffect(() => {
    if (!isHydrated || hasInitialValidated.current) return;
    hasInitialValidated.current = true;
    void revalidateAuthSession();
  }, [isHydrated]);

  return <>{children}</>;
}
