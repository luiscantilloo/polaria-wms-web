"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginFlow } from "@/components/auth/LoginFlow";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginFlow />
    </AuthLayout>
  );
}
