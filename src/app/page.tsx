"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, AlertTriangle, CheckCircle, Clock, ArrowRight,
  Shield, Zap, Globe, Users, BarChart3, Bell, ChevronRight,
  Droplets, Phone, Mail, Star, TrendingUp
} from "lucide-react";

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = end / (duration * 60);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= end) { clearInterval(interval); return end; }
        return prev + step;
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [end, duration]);
  return <span>{Math.floor(count).toLocaleString()}{suffix}</span>;
}

// ── Floating orbs ─────────────────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="bg-orb w-96 h-96 bg-primary-600 -top-20 -left-20 animate-pulse-glow" />
      <div className="bg-orb w-64 h-64 bg-secondary-600 top-1/3 right-10 animate-float" style={{ animationDelay: "1s" }} />
      <div className="bg-orb w-80 h-80 bg-primary-800 bottom-20 left-1/4 animate-pulse-glow" style={{ animationDelay: "2s" }} />
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/10 shadow-card" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-glow-sm">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-white">
            Clear<span className="text-primary-400">Drain</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="#stats" className="hover:text-white transition-colors">Impact</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-5">
            Report Issue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <BackgroundOrbs />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-600/30 text-primary-300 text-sm font-medium mb-8 shadow-glow-sm">
            <Zap className="w-4 h-4 text-primary-400" />
            AI-Powered Civic Drain Management Platform
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[1.05] mb-6 tracking-tight">
            Keep Your City&apos;s
            <span className="block gradient-text glow-text">Drains Clear</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Report drain blockages instantly, track resolution progress in real-time, 
            and help your municipality maintain clean sanitation infrastructure — 
            powered by AI and geolocation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4 shadow-glow-lg animate-pulse-glow">
              <MapPin className="w-5 h-5" />
              Report a Blockage
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/track" className="btn-secondary text-base px-8 py-4">
              <CheckCircle className="w-5 h-5" />
              Track My Issue
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-500 text-sm">
            {["GPS Geotagging", "AI Categorization", "7-Day SLA", "24/7 Tracking"].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary-500" />
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="glass-card p-2 max-w-4xl mx-auto shadow-elevated">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-3 h-5 rounded-full bg-slate-700/50 text-xs text-slate-500 flex items-center px-3">
                cleardrain.gov.in/dashboard
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="grid grid-cols-4 gap-2 p-3 text-left">
              {[
                { label: "Total Reports", value: "1,247", icon: "📋", color: "from-primary-900/50 to-primary-800/30", change: "+12%" },
                { label: "Resolved", value: "983", icon: "✅", color: "from-emerald-900/50 to-emerald-800/30", change: "+8%" },
                { label: "Urgent", value: "14", icon: "🚨", color: "from-red-900/50 to-red-800/30", change: "-3%" },
                { label: "SLA Breached", value: "6", icon: "⏰", color: "from-amber-900/50 to-amber-800/30", change: "-1%" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-3 bg-gradient-to-br ${s.color} border border-white/5`}>
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className={`text-xs mt-1 font-medium ${s.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{s.change}</div>
                </div>
              ))}
            </div>
            {/* Fake map area */}
            <div className="m-3 rounded-xl h-32 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-ping" style={{ animationDelay: "0.5s" }} />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" style={{ animationDelay: "1s" }} />
              <span className="text-xs text-slate-500 ml-4">Live incident map</span>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-primary-600/20 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section id="stats" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { end: 50000, suffix: "+", label: "Issues Resolved", icon: CheckCircle, color: "text-emerald-400" },
            { end: 127, suffix: "", label: "Municipal Zones", icon: Globe, color: "text-primary-400" },
            { end: 98, suffix: "%", label: "Citizen Satisfaction", icon: Star, color: "text-yellow-400" },
            { end: 4.2, suffix: " days", label: "Avg. Resolution Time", icon: Clock, color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <s.icon className={`w-8 h-8 mx-auto mb-3 ${s.color}`} />
              <div className={`text-4xl font-display font-black ${s.color} mb-1`}>
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Smart Geotagging",
      desc: "Auto-detect your location using GPS. Drag the pin to pinpoint the exact drain with interactive map controls.",
      color: "from-primary-600 to-primary-800",
      glow: "shadow-glow",
    },
    {
      icon: Zap,
      title: "AI Prioritization",
      desc: "Gemini AI inspects your photos and description to auto-assess severity — URGENT to LOW — and routes tickets to the right zone.",
      color: "from-purple-600 to-purple-900",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    },
    {
      icon: Shield,
      title: "7-Day SLA Guarantee",
      desc: "Every ticket is tracked against a 7-day resolution SLA. If breached, an escalation button unlocks automatically.",
      color: "from-amber-600 to-amber-900",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    },
    {
      icon: Bell,
      title: "Bi-Monthly Reminders",
      desc: "Residents and ward workers receive automated drain cleaning reminders on the 1st and 15th of each month.",
      color: "from-emerald-600 to-emerald-900",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    },
    {
      icon: Globe,
      title: "Multilingual AI Chat",
      desc: "ClearBot assists citizens in multiple regional languages — submit reports, check status, and get instant answers.",
      color: "from-rose-600 to-rose-900",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    },
    {
      icon: BarChart3,
      title: "City-Wide Analytics",
      desc: "Admins get real-time dashboards with heatmaps, resolution rates, zone performance, and SLA compliance charts.",
      color: "from-indigo-600 to-indigo-900",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.4)]",
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Everything Your City Needs
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A complete civic infrastructure platform built for citizens, field technicians, and administrators.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover group"
            >
              <div className={`stat-icon bg-gradient-to-br ${f.color} ${f.glow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { n: "01", title: "Report the Issue", desc: "Snap a photo, auto-detect GPS location, and describe the blockage. Submit in under 2 minutes.", icon: MapPin },
    { n: "02", title: "AI Analysis", desc: "Our Gemini AI instantly classifies severity, assigns priority, and routes it to the right municipal zone.", icon: Zap },
    { n: "03", title: "Get Your ID", desc: "Receive a unique Acknowledgement ID (CD-XXXX) via email with tracking link and PDF slip.", icon: CheckCircle },
    { n: "04", title: "Track & Escalate", desc: "Monitor real-time status updates. If unresolved in 7 days, escalate with one click.", icon: TrendingUp },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-transparent to-slate-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            How Clear Drain Works
          </h2>
          <p className="text-slate-400 text-lg">From report to resolution in 4 simple steps.</p>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-16 right-16 h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 border border-primary-600/40 flex items-center justify-center mb-6 shadow-glow">
                  <s.icon className="w-10 h-10 text-primary-300" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Role Cards ────────────────────────────────────────────────────────────────
function RolesSection() {
  const roles = [
    {
      icon: "👤",
      title: "Citizen",
      desc: "Report blockages, track tickets, chat with AI, and escalate unresolved issues.",
      href: "/register",
      cta: "Sign Up Free",
      color: "border-primary-600/30 hover:border-primary-500/60",
      badge: "Most Popular",
    },
    {
      icon: "🔧",
      title: "Field Technician",
      desc: "Receive assigned tasks, update status, and upload before/after proof photos from the field.",
      href: "/register?role=technician",
      cta: "Join as Technician",
      color: "border-emerald-600/30 hover:border-emerald-500/60",
    },
    {
      icon: "🏛️",
      title: "Municipality Admin",
      desc: "Manage all complaints, assign teams, view city-wide analytics, and monitor SLA compliance.",
      href: "/login",
      cta: "Admin Login",
      color: "border-purple-600/30 hover:border-purple-500/60",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Built for Everyone
          </h2>
          <p className="text-slate-400 text-lg">Three tailored experiences for every stakeholder.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`glass-card p-8 border ${r.color} transition-all duration-300 relative`}
            >
              {r.badge && (
                <span className="absolute top-4 right-4 badge bg-primary-500/20 text-primary-300 border-primary-500/30 text-xs">
                  {r.badge}
                </span>
              )}
              <div className="text-5xl mb-5">{r.icon}</div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">{r.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{r.desc}</p>
              <Link href={r.href} className="btn-secondary w-full justify-center">
                {r.cta} <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 p-16 text-center shadow-elevated">
          <BackgroundOrbs />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              A Clean City Starts With You
            </h2>
            <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
              Report a blocked drain today and help keep your neighborhood safe, healthy, and flood-free.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="btn-primary px-10 py-4 text-base shadow-glow-lg">
                Get Started — It&apos;s Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/track" className="glass text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                Track Existing Issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-display font-bold text-white">Clear<span className="text-primary-400">Drain</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">AI-powered civic drain maintenance platform for a cleaner, safer city.</p>
          </div>
          {[
            { title: "Platform", links: ["Report Issue", "Track Ticket", "AI Analysis", "Mobile App"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Legal", links: ["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Support"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href={`/${l.toLowerCase().replace(/ /g, "-").replace(/&/g, "and")}`} className="text-slate-500 hover:text-primary-400 text-sm transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Clear Drain Civic Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 1800-DRAIN-HELP</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> support@cleardrain.gov.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-dark">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
