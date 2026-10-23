"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus, MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp,
  FileText, Bell, Settings, LogOut, Droplets, ChevronRight,
  AlertCircle, Calendar, Search
} from "lucide-react";
import { formatDate, getStatusClass, getPriorityClass, daysUntilSLA } from "@/lib/utils";
import ChatbotWidget from "@/components/ChatbotWidget";
import { signOut } from "next-auth/react";

interface Ticket {
  id: string; ackId: string; title: string; status: string; priority: string;
  address: string; createdAt: string; slaDeadline: string; slaBreached: boolean;
  escalations: { id: string; status: string }[];
}

function StatCard({ icon: Icon, label, value, color, trend }: {
  icon: React.ElementType; label: string; value: number | string; color: string; trend?: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        <p className="text-slate-400 text-sm">{label}</p>
        {trend && <p className="text-xs text-emerald-400 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}

function Sidebar({ role }: { role: string }) {
  const navItems = role === "CITIZEN" ? [
    { href: "/dashboard", label: "My Complaints", icon: FileText, active: true },
    { href: "/report", label: "New Report", icon: Plus },
    { href: "/track", label: "Track Ticket", icon: MapPin },
    { href: "/settings", label: "Settings", icon: Settings },
  ] : role === "TECHNICIAN" ? [
    { href: "/dashboard", label: "My Tasks", icon: FileText, active: true },
    { href: "/dashboard/map", label: "Field Map", icon: MapPin },
    { href: "/settings", label: "Settings", icon: Settings },
  ] : [
    { href: "/dashboard", label: "Overview", icon: TrendingUp, active: true },
    { href: "/admin/tickets", label: "All Tickets", icon: FileText },
    { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/admin/users", label: "Users", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 glass border-r border-white/5 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-glow-sm">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-white">
            Clear<span className="text-primary-400">Drain</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`sidebar-link ${item.active ? "active" : ""}`}>
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/10">
          <LogOut className="w-4.5 h-4.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const user = session?.user as { id?: string; name?: string; email?: string; role?: string } | undefined;
  const role = user?.role ?? "CITIZEN";

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tickets?limit=20")
        .then((r) => r.json())
        .then((d) => { setTickets(d.tickets ?? []); setLoading(false); });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const filteredTickets = tickets.filter((t) =>
    t.ackId.toLowerCase().includes(search.toLowerCase()) ||
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tickets.length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    pending: tickets.filter((t) => ["PENDING", "ACKNOWLEDGED", "IN_PROGRESS"].includes(t.status)).length,
    breached: tickets.filter((t) => t.slaBreached && !["RESOLVED", "CLOSED"].includes(t.status)).length,
  };

  return (
    <div className="min-h-screen bg-surface-dark flex">
      <Sidebar role={role} />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {role === "CITIZEN" ? "My Complaints" : role === "TECHNICIAN" ? "Assigned Tasks" : "Municipality Dashboard"}
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, <span className="text-primary-400">{user?.name ?? "User"}</span>
            </p>
          </div>
          {role === "CITIZEN" && (
            <Link href="/report" className="btn-primary">
              <Plus className="w-4 h-4" /> New Report
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <StatCard icon={FileText} label="Total Issues" value={stats.total} color="bg-gradient-to-br from-primary-600 to-primary-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="bg-gradient-to-br from-emerald-600 to-emerald-800" trend={stats.total > 0 ? `${((stats.resolved / stats.total) * 100).toFixed(0)}% rate` : ""} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard icon={Clock} label="In Progress" value={stats.pending} color="bg-gradient-to-br from-amber-600 to-amber-800" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard icon={AlertTriangle} label="SLA Breached" value={stats.breached} color="bg-gradient-to-br from-red-600 to-red-800" />
          </motion.div>
        </div>

        {/* Tickets List */}
        <div className="glass-card">
          {/* Table header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">
              {role === "CITIZEN" ? "Your Reported Issues" : "Assigned Tasks"}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-primary-500/50 w-52"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 mt-4">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No issues found</p>
              {role === "CITIZEN" && (
                <Link href="/report" className="btn-primary mt-4 inline-flex">
                  <Plus className="w-4 h-4" /> Report First Issue
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredTickets.map((ticket, i) => {
                const daysLeft = daysUntilSLA(ticket.slaDeadline);
                const canEscalate = ticket.slaBreached && !["RESOLVED", "CLOSED", "ESCALATED"].includes(ticket.status);
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-primary-400 text-xs font-semibold">{ticket.ackId}</span>
                          <span className={getStatusClass(ticket.status)}>{ticket.status.replace("_", " ")}</span>
                          <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                          {ticket.slaBreached && (
                            <span className="badge bg-red-900/30 text-red-400 border-red-700/30">
                              <AlertCircle className="w-3 h-3" /> SLA Breached
                            </span>
                          )}
                        </div>
                        <p className="text-white font-medium truncate">{ticket.title}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ticket.address.substring(0, 40)}…</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(ticket.createdAt)}</span>
                          {!ticket.slaBreached && (
                            <span className="flex items-center gap-1 text-amber-500">
                              <Clock className="w-3 h-3" /> {daysLeft}d SLA remaining
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {canEscalate && (
                          <Link href={`/track/${ticket.ackId}?escalate=1`} className="btn-danger text-xs py-1.5 px-3">
                            Escalate
                          </Link>
                        )}
                        <Link href={`/track/${ticket.ackId}`} className="btn-ghost text-xs py-1.5">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}
