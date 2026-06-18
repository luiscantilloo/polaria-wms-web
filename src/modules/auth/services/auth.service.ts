import { apiRequest } from "@/services/api";
import type {
  AuthSession,
  LoginRequest,
  LoginResponse,
  PreloginRequest,
  PreloginResponse,
} from "@/types/auth";

export async function prelogin(
  payload: PreloginRequest,
): Promise<PreloginResponse> {
  return apiRequest<PreloginResponse>("/auth/prelogin", {
    method: "POST",
    body: payload,
  });
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function getMe(): Promise<AuthSession> {
  return apiRequest<AuthSession>("/auth/me", {
    method: "GET",
    auth: true,
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
    auth: true,
  });
}
