const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zenlife_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  auth: {
    sendOtp: (phone: string) => request("/auth/send-otp", { method: "POST", body: JSON.stringify({ phone }) }),
    verifyOtp: (phone: string, otp: string) =>
      request<{ access_token: string; user: AuthUser }>(
        "/auth/verify-otp",
        { method: "POST", body: JSON.stringify({ phone, otp }) }
      ),
    signup: (payload: {
      phone: string;
      first_name: string;
      last_name: string;
      age: number;
      gender: string;
      password: string;
      confirm_password: string;
    }) =>
      request<{ access_token: string; user: AuthUser }>(
        "/auth/signup",
        { method: "POST", body: JSON.stringify(payload) }
      ),
    login: (phone: string, password: string) =>
      request<{ access_token: string; user: AuthUser }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ phone, password }) }
      ),
    changePassword: (new_password: string, confirm_password: string) =>
      request<{ ok: boolean }>(
        "/auth/change-password",
        { method: "POST", body: JSON.stringify({ new_password, confirm_password }) }
      ),
  },
  orders: {
    list: () => request<Order[]>("/orders/"),
  },
  reports: {
    get: (id: number) => request<Report>(`/reports/${id}`),
    organScores: (id: number) => request<OrganScore[]>(`/reports/${id}/organ-scores`),
    findings: (id: number, params?: { severity?: string; test_type?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return request<Finding[]>(`/reports/${id}/findings${q ? `?${q}` : ""}`);
    },
    priorities: (id: number) => request<HealthPriority[]>(`/reports/${id}/priorities`),
    notes: (id: number) => request<ConsultationNote[]>(`/reports/${id}/notes`),
    bodyAge: (id: number) => request<BodyAge | null>(`/reports/${id}/body-age`),
  },
  chat: {
    history: (reportId: number) => request<ChatMessage[]>(`/chat/${reportId}/history`),
    send: (reportId: number, message: string) =>
      request<ChatMessage>(`/chat/${reportId}/message`, { method: "POST", body: JSON.stringify({ message }) }),
    starters: (reportId: number) => request<{ starters: string[] }>(`/chat/${reportId}/starters`),
  },
};

// Types
export interface AuthUser {
  id: number;
  phone: string;
  name: string | null;
  zen_id?: string | null;
  age?: number | null;
  gender?: string | null;
  must_change_password?: boolean;
}

export interface Order {
  id: number;
  booking_id: string;
  zen_id?: string | null;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  scan_type: string;
  status: "pending" | "scheduled" | "completed";
  scan_date: string | null;
  report_date?: string | null;
  next_visit?: string | null;
  amount: number;
  has_report: boolean;
  report_id: number | null;
  is_published: boolean;
  tests_complete: boolean;
  tests_total?: number;
  tests_completed?: number;
  tests_pending?: string[];
}

export interface Report {
  id: number;
  is_published: boolean;
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  booking_id: string;
  coverage_index?: number;
  overall_severity?: string;
  report_date?: string;
  next_visit?: string;
  summary?: string;
  finding_counts?: { critical: number; major: number; minor: number; normal: number };
}

export interface OrganScore {
  id: number;
  organ_name: string;
  severity: string;
  risk_label: string;
  critical_count: number;
  major_count: number;
  minor_count: number;
  normal_count: number;
  icon: string;
}

export interface Finding {
  id: number;
  test_type: string;
  name: string;
  severity: string;
  value: string | null;
  normal_range: string | null;
  unit: string | null;
  description: string | null;
  clinical_findings: string | null;
  recommendations: string | null;
  extra_data: Record<string, unknown> | null;
}

export interface HealthPriority {
  id: number;
  priority_order: number;
  title: string;
  why_important: string;
  diet_recommendations: string[];
  exercise_recommendations: string[];
  sleep_recommendations: string[];
  supplement_recommendations: string[];
}

export interface ConsultationNote {
  id: number;
  note_type: string;
  content: string;
  author: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface BodyAge {
  chronological_age: number | null;
  pheno_age: number | null;
  zen_age: number | null;
  age_difference: number | null;
  confidence: "high" | "medium" | "low";
  interpretation: string;
  markers_used: string[];
  markers_missing: string[];
  sub_ages: {
    metabolic_age?: number | null;
    cardiovascular_age?: number | null;
    bone_age?: number | null;
    inflammatory_age?: number | null;
    renal_age?: number | null;
  };
}
