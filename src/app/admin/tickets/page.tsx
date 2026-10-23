"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, TrendingUp, Users, Settings, LogOut, Search,
  Filter, ChevronRight, CheckCircle, UserCheck, Droplets, Bell
} from "lucide-react";
import { signOut } from "next-auth/react";
import { formatDate, getPriorityClass, getStatusClass } from "@/lib/utils";
import ChatbotWidget from "@/components/ChatbotWidget";

interface Ticket {
  id: string; ackId: string; title: string; status: string; priority: string;
  severity: string; address: string; ward: string; zone: string;
  createdAt: string; slaBreached: boolean;
  reportedBy: { name: string; email: string };
  assignedTo: { name: string } | null;
  _count: { updates: number };
}

interface Technician { id: string; name: string; email: string; }

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as { role?: string } | undefined;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [assignModal, setAssignModal] = useState<{ ticketAckId: string; ticketId: string } | null>(null);
  const [selectedTech, setSelectedTech] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && user?.role === "ADMIN") {
      Promise.all([
        fetch("/api/tickets?limit=50").then((r) => r.json()),
        fetch("/api/users?role=TECHNICIAN").then((r) => r.json()),
      ]).then(([td, ud]) => {
        setTickets(td.tickets ?? []);
        setTechnicians(ud.users ?? []);
        setLoading(false);
      });
    }
  }, [status, user?.role]);

  const handleAssign = async () => {
    if (!assignModal || !selectedTech) return;
    setAssigning(true);
    await fetch(`/api/tickets/${assignModal.ticketAckId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: selectedTech, status: "ASSIGNED" }),
    });
    setTickets((prev) =>
      prev.map((t) =>
        t.ackId === assignModal.ticketAckId
          ? { ...t, status: "ASSIGNED", assignedTo: { name: technicians.find((te) => te.id === selectedTech)?.name ?? "Assigned" } }
          : t
      )
    );
    setAssignModal(null);
    setAssigning(false);
  };

  const filtered = tickets.filter((t) => {
    const matchSearch = !search || t.ackId.toLowerCase().includes(search.toLowerCase()) || t.title.toLowerCase().includes(search.toLowerCase()) || t.reportedBy.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  if (status === "loading" || loading) return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (status === "unauthenticated" || user?.role !== "ADMIN") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/5 min-h-screen flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-glow-sm">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">Clear<span className="text-primary-400">Drain</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/dashboard", icon: TrendingUp, label: "Overview" },
            { href: "/admin/tickets", icon: FileText, label: "All Tickets", active: true },
            { href: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
            { href: "/admin/users", icon: Users, label: "Users" },
            { href: "/settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-link ${item.active ? "active" : ""}`}>
              <item.icon className="w-4.5 h-4.5" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/10">
            <LogOut className="w-4.5 h-4.5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-white">All Tickets</h1>
          <span className="badge bg-primary-900/30 text-primary-300 border-primary-700/30 text-sm">
            {filtered.length} tickets
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, title, reporter…"
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-primary-500/50 w-56" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 text-sm outline-none appearance-none focus:border-primary-500/50">
              <option value="">All Statuses</option>
              {["PENDING","ACKNOWLEDGED","ASSIGNED","IN_PROGRESS","RESOLVED","ESCALATED"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 text-sm outline-none appearance-none focus:border-primary-500/50">
            <option value="">All Priorities</option>
            {["URGENT","HIGH","MEDIUM","LOW"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["ID", "Title", "Reporter", "Priority", "Status", "Zone", "SLA", "Assigned", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="table-row"
                  >
                    <td className="px-4 py-3"><span className="font-mono text-primary-400 text-xs font-semibold">{t.ackId}</span></td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-white text-sm truncate">{t.title}</p>
                      <p className="text-slate-500 text-xs">{formatDate(t.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{t.reportedBy.name}</td>
                    <td className="px-4 py-3"><span className={getPriorityClass(t.priority)}>{t.priority}</span></td>
                    <td className="px-4 py-3"><span className={getStatusClass(t.status)}>{t.status.replace("_", " ")}</span></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{t.zone || "—"}</td>
                    <td className="px-4 py-3">
                      {t.slaBreached
                        ? <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-xs">Breached</span>
                        : <span className="text-slate-500 text-xs">OK</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{t.assignedTo?.name ?? <span className="text-amber-500">Unassigned</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!t.assignedTo && (
                          <button
                            onClick={() => setAssignModal({ ticketAckId: t.ackId, ticketId: t.id })}
                            className="text-xs px-2 py-1 rounded-lg border border-primary-600/40 text-primary-400 hover:bg-primary-900/30 transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" /> Assign
                          </button>
                        )}
                        <Link href={`/track/${t.ackId}`} className="btn-ghost text-xs py-1 px-2">
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-slate-500">No tickets match the current filters.</div>
            )}
          </div>
        </div>
      </main>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 max-w-md w-full shadow-elevated">
            <h3 className="text-lg font-bold text-white mb-1">Assign Technician</h3>
            <p className="text-slate-400 text-sm mb-5">Ticket: <strong className="text-primary-400">{assignModal.ticketAckId}</strong></p>
            <div className="space-y-2 mb-5">
              {technicians.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all
                    ${selectedTech === tech.id ? "border-primary-500 bg-primary-900/30 text-white" : "border-white/10 text-slate-400 hover:border-white/20"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-800/40 flex items-center justify-center text-primary-300 text-xs font-bold">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-xs text-slate-500">{tech.email}</p>
                  </div>
                  {selectedTech === tech.id && <CheckCircle className="w-4 h-4 text-primary-400 ml-auto" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAssignModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleAssign} disabled={!selectedTech || assigning} className="btn-primary flex-1 justify-center">
                {assigning ? "Assigning…" : "Assign & Notify"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ChatbotWidget />
    </div>
  );
}
