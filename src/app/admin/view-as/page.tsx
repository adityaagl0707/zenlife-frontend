"use client";

/**
 * Admin "view-as-patient" landing page.
 *
 * Opens in a new tab from the admin patient-list. Calls the backend
 * /admin/patients/{user_id}/impersonate endpoint to mint a short-lived
 * patient JWT, stashes it in sessionStorage (so this tab acts as the
 * patient without clobbering the admin tab's localStorage token),
 * then redirects to the requested patient-facing URL (e.g. /report/123).
 */
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function ViewAsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = params.get("user");
    const redirect = params.get("redirect") || "/dashboard";
    if (!userId) {
      setError("Missing user id");
      return;
    }
    fetch(`${BASE}/admin/patients/${userId}/impersonate`, { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Impersonation failed (${res.status})`);
        }
        const data = (await res.json()) as { access_token: string };
        sessionStorage.setItem("zenlife_token", data.access_token);
        router.replace(redirect);
      })
      .catch((e: Error) => setError(e.message));
  }, [params, router]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center max-w-md">
          <p className="font-bold text-red-800">Couldn&apos;t open patient report</p>
          <p className="mt-1 text-[13px] text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-gray-500 text-[13px]">Opening patient report…</p>
    </main>
  );
}

export default function ViewAsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ViewAsInner />
    </Suspense>
  );
}
