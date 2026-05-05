"use client";

export function setToken(token: string) {
  localStorage.setItem("zenlife_token", token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // sessionStorage is per-tab. Admin opens a patient-impersonation tab
  // via /admin/view-as which stashes a short-lived patient token here.
  // That tab uses the patient token while the admin tab keeps using
  // localStorage (no clobbering).
  return sessionStorage.getItem("zenlife_token") || localStorage.getItem("zenlife_token");
}

export function clearToken() {
  localStorage.removeItem("zenlife_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
