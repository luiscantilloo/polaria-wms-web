"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isHydrated && !isLoading && !accessToken) {
      router.replace(ROUTES.login);
    }
  }, [accessToken, isHydrated, isLoading, router]);

  if (!isHydrated || isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-screen items-center justify-center bg-polaria-bg">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-polaria-teal border-t-transparent" />
        </div>
      )
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
