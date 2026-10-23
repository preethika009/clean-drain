"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets, Search, Hash } from "lucide-react";

export default function TrackIndexPage() {
  const router = useRouter();
  const [ackId, setAckId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ackId.trim()) router.push(`/track/${ackId.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Droplets className="w-7 h-7 text-primary-400" />
        <span className="text-2xl font-display font-bold text-white">Clear<span className="text-primary-400">Drain</span></span>
      </Link>
      <div className="glass-card p-10 max-w-md w-full text-center shadow-elevated">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center mb-5">
          <Search className="w-7 h-7 text-primary-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Track Your Issue</h1>
        <p className="text-slate-400 text-sm mb-7">Enter your Acknowledgement ID to view real-time status updates.</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={ackId}
              onChange={(e) => setAckId(e.target.value)}
              className="input-field pl-10 text-center tracking-widest font-mono text-lg uppercase"
              placeholder="CD-2026-XXXX"
              maxLength={12}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3.5">
            <Search className="w-4 h-4" /> Track Issue
          </button>
        </form>
      </div>
    </div>
  );
}
