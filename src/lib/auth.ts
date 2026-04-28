"use client";

export function setToken(token: string) {
  localStorage.setItem("zenlife_token", token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zenlife_token");
}

export function clearToken() {
  localStorage.removeItem("zenlife_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
