"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getPostLoginRoute } from "@/config/routes";
import { prelogin } from "@/modules/auth";
import { ApiError } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthFlow, AuthSession, UserPreview } from "@/types/auth";
import { LoginStepPassword } from "./LoginStepPassword";
import { LoginStepSuccess } from "./LoginStepSuccess";
import { LoginStepUser } from "./LoginStepUser";

type Step = "user" | "password" | "success";

const REDIRECT_DELAY_MS = 2000;

export function LoginFlow() {
  const router = useRouter();
  const performLogin = useAuthStore((s) => s.performLogin);

  const [step, setStep] = useState<Step>("user");
  const [identificador, setIdentificador] = useState("");
  const [codigoEmpresa, setCodigoEmpresa] = useState("");
  const [password, setPassword] = useState("");
  const [showCodigoEmpresa, setShowCodigoEmpresa] = useState(false);
  const [flow, setFlow] = useState<AuthFlow | null>(null);
  const [userPreview, setUserPreview] = useState<UserPreview | null>(null);
  const [successSession, setSuccessSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrelogin = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const payload: { identificador: string; codigoEmpresa?: string } = {
        identificador: identificador.trim(),
      };

      if (showCodigoEmpresa && codigoEmpresa.trim()) {
        payload.codigoEmpresa = codigoEmpresa.trim();
      }

      const response = await prelogin(payload);
      setFlow(response.flow);
      setUserPreview(response.userPreview);
      setStep("password");
      setPassword("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setShowCodigoEmpresa(true);
        setError(err.message);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  }, [codigoEmpresa, identificador, showCodigoEmpresa]);

  const handleLogin = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const payload: {
        identificador: string;
        password: string;
        codigoEmpresa?: string;
      } = {
        identificador: identificador.trim(),
        password,
      };

      if (flow === "tenant" && codigoEmpresa.trim()) {
        payload.codigoEmpresa = codigoEmpresa.trim();
      }

      const authSession = await performLogin(payload);
      setSuccessSession(authSession);
      setStep("success");

      setTimeout(() => {
        router.replace(getPostLoginRoute(authSession.scope));
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  }, [codigoEmpresa, flow, identificador, password, performLogin, router]);

  const handleBack = () => {
    setStep("user");
    setPassword("");
    setError(null);
  };

  if (step === "success" && successSession) {
    return <LoginStepSuccess session={successSession} />;
  }

  if (step === "password" && userPreview) {
    return (
      <LoginStepPassword
        userPreview={userPreview}
        password={password}
        isLoading={isLoading}
        error={error}
        onPasswordChange={setPassword}
        onBack={handleBack}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <LoginStepUser
      identificador={identificador}
      codigoEmpresa={codigoEmpresa}
      showCodigoEmpresa={showCodigoEmpresa}
      isLoading={isLoading}
      error={error}
      onIdentificadorChange={setIdentificador}
      onCodigoEmpresaChange={setCodigoEmpresa}
      onSubmit={handlePrelogin}
    />
  );
}
