"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MapPin, Clock, CheckCircle, AlertTriangle, Loader2,
  AlertCircle, ChevronLeft, Upload, Send, Sparkles,
  Calendar, User, FileImage, TrendingUp
} from "lucide-react";
import { formatDate, getStatusClass, getPriorityClass, isSLABreached, daysUntilSLA } from "@/lib/utils";
import ChatbotWidget from "@/components/ChatbotWidget";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

interface TicketDetail {
  id: string; ackId: string; title: string; description: string;
  status: string; priority: string; severity: string; tags: string[];
  latitude: number; longitude: number; address: string; ward: string; zone: string;
  aiAnalysis: Record<string, unknown> | null; aiConfidence: number | null;
  slaDeadline: string; slaBreached: boolean; resolvedAt: string | null;
  createdAt: string; updatedAt: string;
  reportedBy: { name: string; email: string };
  assignedTo: { name: string; email: string } | null;
  media: { id: string; url: string; type: string; filename: string }[];
  escalations: { id: string; status: string; reason: string; createdAt: string; raisedBy: { name: string } }[];
  updates: { id: string; content: string; status: string | null; createdAt: string; isPublic: boolean }[];
}

function SLABadge({ slaDeadline, slaBreached, status }: { slaDeadline: string; slaBreached: boolean; status: string }) {
  const resolved = ["RESOLVED", "CLOSED"].includes(status);
  if (resolved) return <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><CheckCircle className="w-3 h-3" /> Resolved within SLA</span>;
  if (slaBreached) return <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"><AlertCircle className="w-3 h-3" /> SLA Breached</span>;
  const days = daysUntilSLA(slaDeadline);
  const color = days <= 1 ? "text-red-400 border-red-500/30 bg-red-500/10" : days <= 3 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-blue-400 border-blue-500/30 bg-blue-500/10";
  return <span className={`badge border ${color}`}><Clock className="w-3 h-3" /> {days}d until SLA</span>;
}

export default function TrackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ackId = params?.id as string;
  const showEscalateModal = searchParams.get("escalate") === "1";

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(showEscalateModal);
  const [escalateReason, setEscalateReason] = useState("");
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (!ackId) return;
    fetch(`/api/tickets/${ackId}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((d) => { if (d) setTicket(d.ticket); setLoading(false); });
  }, [ackId]);

  const handleEscalate = async () => {
    if (!escalateReason.trim()) return;
    setEscalating(true);
    try {
      const res = await fetch("/api/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ackId, reason: escalateReason }),
      });
      if (res.ok) { setEscalated(true); setEscalateOpen(false); }
      else { const d = await res.json(); alert(d.error); }
    } catch { alert("Escalation failed."); }
    finally { setEscalating(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center text-center px-6">
      <AlertCircle className="w-16 h-16 text-slate-600 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h1>
      <p className="text-slate-400 mb-6">No ticket with ID <strong className="text-primary-400">{ackId}</strong> was found.</p>
      <Link href="/track" className="btn-primary">Search Again</Link>
    </div>
  );

  if (!ticket) return null;

  const canEscalate = (ticket.slaBreached || isSLABreached(ticket.slaDeadline)) && !["RESOLVED", "CLOSED", "ESCALATED"].includes(ticket.status);

  const TIMELINE = [
    { label: "Reported", done: true, icon: AlertTriangle },
    { label: "Acknowledged", done: ["ACKNOWLEDGED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(ticket.status), icon: CheckCircle },
    { label: "Assigned", done: ["ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(ticket.status), icon: User },
    { label: "In Progress", done: ["IN_PROGRESS", "RESOLVED", "CLOSED"].includes(ticket.status), icon: TrendingUp },
    { label: "Resolved", done: ["RESOLVED", "CLOSED"].includes(ticket.status), icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-surface-dark py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/dashboard" className="btn-ghost mb-6 inline-flex text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-primary-400 font-mono text-sm font-semibold mb-1">{ticket.ackId}</p>
              <h1 className="text-2xl font-display font-bold text-white mb-2">{ticket.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={getStatusClass(ticket.status)}>{ticket.status.replace("_", " ")}</span>
                <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                <SLABadge slaDeadline={ticket.slaDeadline} slaBreached={ticket.slaBreached} status={ticket.status} />
                {escalated && <span className="badge bg-orange-500/20 text-orange-400 border-orange-500/30">Escalated ✓</span>}
              </div>
            </div>
            {canEscalate && !escalated && (
              <button onClick={() => setEscalateOpen(true)} className="btn-danger text-sm">
                <AlertTriangle className="w-4 h-4" /> Escalate Issue
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Resolution Timeline</h2>
              <div className="flex items-center">
                {TIMELINE.map((step, i) => (
                  <div key={step.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                        ${step.done ? "border-primary-500 bg-primary-900/50" : "border-slate-700 bg-slate-800/40"}`}>
                        <step.icon className={`w-4 h-4 ${step.done ? "text-primary-400" : "text-slate-600"}`} />
                      </div>
                      <p className={`text-xs mt-1 text-center ${step.done ? "text-primary-300" : "text-slate-600"}`}>{step.label}</p>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-5 ${TIMELINE[i + 1].done ? "bg-primary-600/50" : "bg-slate-700"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Issue Description</h2>
              <p className="text-slate-300 leading-relaxed">{ticket.description}</p>
              {ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="badge bg-slate-700/40 text-slate-400 border-slate-600/30 text-xs">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {ticket.aiAnalysis && (
              <div className="glass-card p-6 border border-primary-700/20">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-400" /> AI Assessment
                </h2>
                <p className="text-slate-300 text-sm mb-3">{String(ticket.aiAnalysis.summary)}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-slate-500 mb-1">Zone Routing</p>
                    <p className="text-white font-medium">{String(ticket.aiAnalysis.zone)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-slate-500 mb-1">Est. Resolution</p>
                    <p className="text-white font-medium">{String(ticket.aiAnalysis.estimatedResolutionDays)} days</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 col-span-2">
                    <p className="text-slate-500 mb-1">Reasoning</p>
                    <p className="text-slate-300">{String(ticket.aiAnalysis.reasoning)}</p>
                  </div>
                </div>
                {ticket.aiConfidence != null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>AI Confidence</span><span>{(ticket.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full">
                      <div className="h-1.5 bg-primary-500 rounded-full transition-all" style={{ width: `${ticket.aiConfidence * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Photos */}
            {ticket.media.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-purple-400" /> Attached Photos
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {ticket.media.map((m) => (
                    <div key={m.id} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-2 left-2">
                        <span className={`badge text-xs ${m.type === "BEFORE_PHOTO" ? "bg-amber-900/80 text-amber-300" : "bg-emerald-900/80 text-emerald-300"}`}>
                          {m.type === "BEFORE_PHOTO" ? "Before" : "After"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-400" /> Issue Location
              </h2>
              <div className="h-56 rounded-xl overflow-hidden border border-white/10">
                <MapPicker
                  onLocationSelect={() => {}}
                  initialLat={ticket.latitude}
                  initialLng={ticket.longitude}
                  readonly
                />
              </div>
              <p className="text-slate-400 text-sm mt-3">{ticket.address}</p>
            </div>

            {/* Updates */}
            {ticket.updates.filter((u) => u.isPublic).length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Activity Log</h2>
                <div className="space-y-3">
                  {ticket.updates.filter((u) => u.isPublic).map((update) => (
                    <div key={update.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                      <div className="flex-1 pb-3 border-b border-white/5">
                        <p className="text-slate-300 text-sm">{update.content}</p>
                        <p className="text-slate-600 text-xs mt-1">{formatDate(update.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Ticket Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Reported By", value: ticket.reportedBy.name },
                  { label: "Submitted", value: formatDate(ticket.createdAt) },
                  { label: "SLA Deadline", value: formatDate(ticket.slaDeadline) },
                  { label: "Ward", value: ticket.ward || "—" },
                  { label: "Zone", value: ticket.zone || "—" },
                  { label: "Severity", value: ticket.severity.replace(/_/g, " ") },
                  { label: "Assigned To", value: ticket.assignedTo?.name || "Unassigned" },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{d.label}</span>
                    <span className="text-slate-200 font-medium text-right max-w-[60%]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {ticket.escalations.length > 0 && (
              <div className="glass-card p-5 border border-red-700/20">
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Escalations
                </h3>
                {ticket.escalations.map((esc) => (
                  <div key={esc.id} className="p-3 rounded-xl bg-red-900/10 border border-red-700/20 text-sm">
                    <p className="text-slate-300 mb-1">{esc.reason}</p>
                    <p className="text-slate-500 text-xs">{formatDate(esc.createdAt)} · {esc.raisedBy.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      {escalateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 max-w-md w-full shadow-elevated">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Escalate Complaint</h3>
                <p className="text-slate-400 text-sm">Ticket {ackId}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              This will notify senior supervisors and flag your issue for immediate attention. 
              Escalation is available because the 7-day SLA has been breached.
            </p>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              className="input-field resize-none h-24 mb-4 w-full"
              placeholder="Describe why you are escalating — what has not been addressed, impact on residents, etc."
            />
            <div className="flex gap-3">
              <button onClick={() => setEscalateOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleEscalate} disabled={escalating || !escalateReason.trim()} className="btn-danger flex-1 justify-center">
                {escalating ? <><Loader2 className="w-4 h-4 animate-spin" /> Escalating…</> : <><Send className="w-4 h-4" /> Submit Escalation</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ChatbotWidget />
    </div>
  );
}
