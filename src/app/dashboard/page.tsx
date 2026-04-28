"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ChevronRight, ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api, Order } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  scheduled: { label: "Scheduled", icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
  pending: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
};

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <div className="card flex flex-col gap-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{order.booking_id}</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">{order.patient_name}</h3>
          <p className="text-sm text-gray-500">
            {order.patient_age} yrs · {order.patient_gender} · {order.scan_type}
          </p>
        </div>
        <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", cfg.color)}>
          <Icon className="h-3.5 w-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
        <div>
          <p className="text-xs text-gray-400">Scan Date</p>
          <p className="mt-0.5 font-semibold text-gray-700">
            {order.scan_date ? new Date(order.scan_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Amount Paid</p>
          <p className="mt-0.5 font-semibold text-gray-700">₹{order.amount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* CTA */}
      {order.has_report && order.report_id ? (
        <Link
          href={`/report/${order.report_id}`}
          className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
        >
          View ZenReport <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400">
          <AlertCircle className="h-4 w-4" />
          Report will be available after your scan
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    api.orders
      .list()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Page header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-600">My Account</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-500">Track your ZenScan bookings and access completed reports.</p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="mt-2 h-6 w-40 rounded bg-gray-200" />
                  <div className="mt-1 h-4 w-32 rounded bg-gray-200" />
                  <div className="mt-5 h-16 rounded-xl bg-gray-100" />
                  <div className="mt-5 h-10 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="text-gray-600">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary py-2 text-sm">
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zen-50">
                <ClipboardList className="h-10 w-10 text-zen-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                <p className="mt-2 text-gray-500">Book your ZenScan to start your health intelligence journey.</p>
              </div>
              <Link href="/book" className="btn-primary px-8 py-3">
                Book ZenScan
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
