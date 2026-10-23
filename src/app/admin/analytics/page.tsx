"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
import {
  TrendingUp, FileText, CheckCircle, AlertTriangle, Clock,
  Zap, ChevronRight, LogOut, Droplets
} from "lucide-react";
import { signOut } from "next-auth/react";
import { formatDate, getPriorityClass, getStatusClass } from "@/lib/utils";
import ChatbotWidget from "@/components/ChatbotWidget";

interface AnalyticsData {
  stats: {
    totalTickets: number; resolvedTickets: number; pendingTickets: number;
    urgentTickets: number; slaBreachedTickets: number; escalatedTickets: number;
    resolutionRate: number;
  };
  charts: {
    byPriority: { priority: string; _count: { _all: number } }[];
    byStatus: { status: string; _count: { _all: number } }[];
    byZone: { zone: string; _count: { _all: number } }[];
    weeklyTrend: { date: string; count: number }[];
  };
  recentTickets: {
    id: string; ackId: string; title: string; status: string; priority: string;
    createdAt: string; reportedBy: { name: string };
  }[];
}

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#64748b", ACKNOWLEDGED: "#3b82f6", ASSIGNED: "#a855f7",
  IN_PROGRESS: "#f59e0b", RESOLVED: "#22c55e", CLOSED: "#475569", ESCALATED: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, color, subtext }: {
  icon: React.ElementType; label: string; value: number | string; color: string; subtext?: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        <p className="text-slate-400 text-sm">{label}</p>
        {subtext && <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const user = session?.user as { role?: string; name?: string } | undefined;

  useEffect(() => {
    if (status === "authenticated" && user?.role === "ADMIN") {
      fetch("/api/analytics")
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || "Unable to load analytics.");
          setData(d);
        })
        .catch(() => setLoadError("We couldn’t load analytics right now. Please refresh the page and try again."))
        .finally(() => setLoading(false));
    }
  }, [status, user?.role]);

  if (status === "loading" || (status === "authenticated" && user?.role === "ADMIN" && loading)) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (status === "unauthenticated" || user?.role !== "ADMIN") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const priorityChartData = data?.charts.byPriority.map((p) => ({
    name: p.priority, value: p._count._all, fill: PRIORITY_COLORS[p.priority],
  })) ?? [];
  const statusChartData = data?.charts.byStatus.map((s) => ({
    name: s.status.replace("_", " "), value: s._count._all, fill: STATUS_COLORS[s.status],
  })) ?? [];
  const zoneChartData = data?.charts.byZone.map((z) => ({
    name: z.zone?.replace(" Zone", "") ?? "Other", tickets: z._count._all,
  })) ?? [];

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar */}
      <aside className="w-[4.25rem] flex-shrink-0 glass border-r border-white/5 min-h-screen flex flex-col lg:w-64">
        <div className="border-b border-white/5 p-3 lg:p-6">
          <Link href="/" aria-label="ClearDrain home" className="flex items-center justify-center gap-2.5 lg:justify-start">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-glow-sm">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="hidden text-xl font-display font-bold text-white lg:inline">Clear<span className="text-primary-400">Drain</span></span>
          </Link>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-2 lg:p-4">
          {[
            { href: "/dashboard", icon: TrendingUp, label: "Overview" },
            { href: "/admin/tickets", icon: FileText, label: "All Tickets" },
            { href: "/admin/analytics", icon: BarChart as React.ElementType, label: "Analytics", active: true },
          ].map((item) => (
            <Link key={item.href} href={item.href} aria-label={item.label} title={item.label} className={`sidebar-link justify-center px-2 lg:justify-start lg:px-4 ${item.active ? "active" : ""}`}>
              <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" /> <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 p-2 lg:p-4">
          <button onClick={() => signOut({ callbackUrl: "/login" })} aria-label="Sign out" title="Sign out" className="sidebar-link w-full justify-center px-2 text-red-400 hover:bg-red-900/10 hover:text-red-300 lg:justify-start lg:px-4">
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" /> <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white sm:text-3xl">City Analytics</h1>
            <p className="text-slate-400 mt-1">Real-time drain maintenance insights for <span className="text-primary-400">{user?.name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-slate-400">Current snapshot</span>
          </div>
        </div>

        {loadError && <div className="mb-6 rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100" role="alert">{loadError}</div>}
        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <StatCard icon={FileText} label="Total Tickets" value={data?.stats.totalTickets ?? 0} color="bg-gradient-to-br from-primary-600 to-primary-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatCard icon={CheckCircle} label="Resolved" value={data?.stats.resolvedTickets ?? 0} color="bg-gradient-to-br from-emerald-600 to-emerald-800" subtext={`${data?.stats.resolutionRate ?? 0}% rate`} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard icon={AlertTriangle} label="Urgent Open" value={data?.stats.urgentTickets ?? 0} color="bg-gradient-to-br from-red-600 to-red-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard icon={Clock} label="SLA Breached" value={data?.stats.slaBreachedTickets ?? 0} color="bg-gradient-to-br from-amber-600 to-amber-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard icon={Zap} label="Escalated" value={data?.stats.escalatedTickets ?? 0} color="bg-gradient-to-br from-orange-600 to-orange-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <StatCard icon={Clock} label="Pending" value={data?.stats.pendingTickets ?? 0} color="bg-gradient-to-br from-blue-600 to-blue-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-to-br from-primary-600 to-secondary-800">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-display font-bold text-white">{data?.stats.resolutionRate ?? 0}%</p>
                <p className="text-slate-400 text-sm">Resolution Rate</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2">
                  <div className="h-1.5 bg-emerald-500 rounded-full transition-all" style={{ width: `${data?.stats.resolutionRate ?? 0}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6">
          {/* Weekly Trend */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Weekly Report Trend</h2>
            {data?.charts.weeklyTrend.length ? <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.charts.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#9aacbf", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9aacbf", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#19ad9e" strokeWidth={2} dot={{ fill: "#19ad9e", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer> : <div className="flex h-[200px] items-center justify-center text-sm text-slate-400" role="status">No trend data is available yet.</div>}
          </div>

          {/* By Zone */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Tickets by Zone</h2>
            {zoneChartData.length ? <ResponsiveContainer width="100%" height={200}>
              <BarChart data={zoneChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#9aacbf", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9aacbf", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tickets" fill="#19ad9e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer> : <div className="flex h-[200px] items-center justify-center text-sm text-slate-400" role="status">No zone data is available yet.</div>}
          </div>

          {/* By Priority */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">By Priority</h2>
            <div className="flex items-center">{priorityChartData.length ? <>
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie data={priorityChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {priorityChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {priorityChartData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                    <span className="text-slate-400">{d.name}</span>
                    <span className="text-white font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </> : <p className="mx-auto text-center text-sm text-slate-400" role="status">No priority data is available yet.</p>}</div>
          </div>

          {/* By Status */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">By Status</h2>
            <div className="space-y-2.5">{statusChartData.length ? statusChartData.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24 text-right">{s.name}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${data?.stats.totalTickets ? (s.value / data.stats.totalTickets) * 100 : 0}%`,
                        background: s.fill,
                      }}
                    />
                  </div>
                  <span className="text-white text-sm font-semibold w-8 text-right">{s.value}</span>
                </div>
              )) : <p className="py-12 text-center text-sm text-slate-400" role="status">No status data is available yet.</p>}</div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="glass-card">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
            <Link href="/admin/tickets" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {data?.recentTickets.length ? data.recentTickets.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="table-row flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="font-mono text-primary-400 text-xs font-semibold w-28 flex-shrink-0">{t.ackId}</span>
                <span className="text-white text-sm flex-1 truncate">{t.title}</span>
                <span className="text-slate-500 text-xs hidden md:block">{t.reportedBy.name}</span>
                <span className={getPriorityClass(t.priority)}>{t.priority}</span>
                <span className={getStatusClass(t.status)}>{t.status.replace("_", " ")}</span>
                <span className="text-slate-500 text-xs hidden lg:block">{formatDate(t.createdAt)}</span>
                <Link href={`/track/${t.ackId}`} className="btn-ghost text-xs py-1 px-2 flex-shrink-0">
                  View <ChevronRight className="w-3 h-3" />
                </Link>
              </motion.div>
            )) : <div className="p-8 text-center text-sm text-slate-400" role="status">No recent tickets are available yet.</div>}
          </div>
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}
