"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, MapPin, Droplets, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-6 relative overflow-hidden">
      {/* Orbs */}
      <div className="bg-orb w-96 h-96 bg-primary-800 -top-20 -right-20" />
      <div className="bg-orb w-64 h-64 bg-secondary-800 bottom-20 -left-20" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Animated drain */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary-700/40" />
          <div className="absolute inset-4 rounded-full border-2 border-primary-600/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplets className="w-10 h-10 text-primary-400" />
          </div>
        </motion.div>

        <h1 className="text-8xl font-display font-black text-white mb-2">
          <span className="gradient-text glow-text">404</span>
        </h1>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Page Went Down the Drain</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for couldn&apos;t be found. It may have been moved, deleted, or you might have a typo in the URL.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/track" className="btn-secondary">
            <Search className="w-4 h-4" /> Track a Ticket
          </Link>
          <Link href="/report" className="btn-secondary">
            <MapPin className="w-4 h-4" /> Report an Issue
          </Link>
        </div>

        <div className="mt-8 p-4 glass rounded-xl text-sm text-slate-500">
          <strong className="text-slate-400">Need help?</strong> Contact{" "}
          <Link href="/support" className="text-primary-400 hover:underline">support@cleardrain.gov.in</Link>
          {" "}or call{" "}
          <a href="tel:18001234567" className="text-primary-400 hover:underline">1800-DRAIN-HELP</a>
        </div>
      </div>
    </div>
  );
}
