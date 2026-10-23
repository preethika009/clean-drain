"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  Globe,
  MapPin,
  Menu,
  Phone,
  Shield,
  Users,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  { href: "#features", label: "What you can do" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#stats", label: "Our approach" },
  { href: "/support", label: "Support" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/10 shadow-card" : ""}`}>
      <nav aria-label="Main navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ClearDrain home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 shadow-glow-sm">
            <Droplets className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Clear<span className="text-primary-300">Drain</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link href="/register" className="btn-primary px-5 py-2.5 text-sm">
            Report an issue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-100 transition hover:bg-white/5 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-slate-950/95 px-4 pb-5 pt-3 shadow-card backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm">Sign in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm">Report an issue</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ReportJourneyCard() {
  const stages = [
    { icon: FileText, title: "Report received", detail: "Your acknowledgement ID keeps everything together.", tone: "text-teal-200 bg-teal-400/10" },
    { icon: Zap, title: "Reviewed and routed", detail: "Issue details help staff assess priority and location.", tone: "text-sky-200 bg-sky-400/10" },
    { icon: Activity, title: "Progress shared", detail: "Follow status updates and next steps in one place.", tone: "text-emerald-200 bg-emerald-400/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.12 }}
      className="relative mx-auto w-full max-w-xl lg:ml-auto"
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-primary-600/10 blur-3xl" aria-hidden="true" />
      <div className="glass-card relative overflow-hidden rounded-3xl p-4 shadow-elevated sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-200">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">A report, clearly followed</p>
              <p className="mt-0.5 text-xs text-slate-400">From location details to resolution updates</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:inline-flex">
            Transparent process
          </span>
        </div>

        <div
          className="relative mt-4 h-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 sm:h-52"
          style={{ backgroundImage: "linear-gradient(rgba(144, 190, 208, .055) 1px, transparent 1px), linear-gradient(90deg, rgba(144, 190, 208, .055) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          aria-label="Illustration of a geotagged neighborhood report"
          role="img"
        >
          <div className="absolute left-[12%] top-[24%] h-px w-[76%] rotate-[15deg] bg-sky-200/20" />
          <div className="absolute left-[10%] top-[68%] h-px w-[82%] -rotate-[11deg] bg-sky-200/20" />
          <div className="absolute left-[28%] top-[6%] h-[90%] w-px rotate-[18deg] bg-sky-200/15" />
          <div className="absolute left-[68%] top-[3%] h-[92%] w-px -rotate-[21deg] bg-sky-200/15" />
          <div className="absolute left-[47%] top-[34%] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-primary-300/20 bg-slate-900/90 px-3 py-2 shadow-card">
            <MapPin className="h-4 w-4 text-primary-300" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-100">Report location</span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-primary-300" /> Location attached to report
          </div>
          <div className="absolute right-[15%] top-[68%] h-3 w-3 rounded-full border-2 border-white bg-primary-400 shadow-glow" />
        </div>

        <div className="mt-4 space-y-2.5">
          {stages.map((stage, index) => (
            <div key={stage.title} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stage.tone}`}>
                <stage.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100">{stage.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{stage.detail}</p>
              </div>
              <span className="hidden text-xs font-medium text-slate-500 sm:inline">0{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_18%,rgba(13,148,136,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute -left-40 top-32 -z-10 h-80 w-80 rounded-full bg-primary-700/15 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-400/[0.08] px-3.5 py-2 text-xs font-semibold tracking-wide text-primary-100 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-primary-300" />
            CIVIC DRAIN MAINTENANCE, MADE CLEARER
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.15rem]">
            Cleaner drains.
            <span className="mt-1 block gradient-text">Stronger neighborhoods.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Report a blockage with its location and details, then follow the response from your municipality—all in one straightforward place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary px-6 py-3.5 text-base">
              <MapPin className="h-5 w-5" aria-hidden="true" /> Report a drain issue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/track" className="btn-secondary px-6 py-3.5 text-base">
              <CheckCircle className="h-5 w-5" aria-hidden="true" /> Track a report
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            {[
              { icon: MapPin, label: "Location-aware reports" },
              { icon: Shield, label: "Clear status history" },
              { icon: Clock, label: "SLA visibility" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary-300" aria-hidden="true" /> {item.label}
              </span>
            ))}
          </div>
        </motion.div>

        <ReportJourneyCard />
      </div>
    </section>
  );
}

function StatsSection() {
  const points = [
    { icon: MapPin, title: "Start with the place", detail: "Attach a location so a drain issue is easier to find and assess." },
    { icon: Zap, title: "Make reports actionable", detail: "Structured details and AI assistance help staff review incoming complaints." },
    { icon: Bell, title: "Keep the follow-through visible", detail: "Use a single acknowledgement ID to check progress and updates." },
    { icon: Clock, title: "Know what happens next", detail: "See SLA timing and escalation options for eligible complaints." },
  ];

  return (
    <section id="stats" className="border-y border-white/[0.07] bg-slate-950/20 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300">A practical civic workflow</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">A clearer path from report to response</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div key={point.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <point.icon className="h-5 w-5 text-primary-300" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: MapPin, title: "Location-aware reporting", desc: "Mark the affected drain on an interactive map and include ward details to help teams find the issue." },
    { icon: Zap, title: "AI-assisted triage", desc: "Use the report description and optional photo to support severity and priority assessment." },
    { icon: Shield, title: "Complaint tracking", desc: "Follow the acknowledgement ID, status timeline, assignment, updates, and SLA information." },
    { icon: Bell, title: "Escalation workflow", desc: "Citizens can raise an escalation for eligible overdue complaints and share the reason." },
    { icon: Globe, title: "Multilingual support", desc: "Get help from ClearBot and the support area while navigating the reporting process." },
    { icon: BarChart3, title: "Municipal oversight", desc: "Authorized staff can manage complaints, assign technicians, and review operational analytics." },
  ];

  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300">Tools for coordinated maintenance</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Designed around the work that matters</h2>
          <p className="mt-4 text-base leading-7 text-slate-400">ClearDrain connects residents and municipal teams around useful information, accountable updates, and accessible reporting.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="glass-card rounded-2xl p-6 sm:p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-300/15 bg-primary-400/10 text-primary-200">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { title: "Report the issue", desc: "Share what is happening, add the location, and attach photos if useful.", icon: MapPin },
    { title: "Review and prioritize", desc: "The report is assessed and routed for municipal follow-up.", icon: Zap },
    { title: "Receive an ID", desc: "Use your acknowledgement ID to return to the report and its updates.", icon: FileText },
    { title: "Track the response", desc: "Review the status timeline and escalation eligibility as the work progresses.", icon: CheckCircle },
  ];

  return (
    <section id="how-it-works" className="border-y border-white/[0.06] bg-slate-950/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300">Simple, visible steps</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">From a neighborhood report to a tracked response</h2>
          <p className="mt-4 text-base leading-7 text-slate-400">Every step keeps the issue, location, and follow-up connected.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="relative rounded-2xl border border-white/[0.08] bg-slate-900/55 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 text-primary-200">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  const roles = [
    { icon: Users, title: "Residents", desc: "Report local issues, follow complaint status, and share relevant information with municipal teams.", href: "/register", cta: "Create a resident account" },
    { icon: Activity, title: "Field technicians", desc: "Review assigned tasks, update progress, and document work from the field.", href: "/register?role=technician", cta: "Join as a technician" },
    { icon: BarChart3, title: "Municipal teams", desc: "Coordinate complaint assignments and review maintenance activity with role-based access.", href: "/login", cta: "Staff sign in" },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300">One shared service</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Useful for every part of the response</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <article key={role.title} className="glass-card flex flex-col rounded-2xl p-6 sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-300/15 bg-primary-400/10 text-primary-200">
                <role.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{role.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{role.desc}</p>
              <Link href={role.href} className="btn-secondary mt-6 w-full justify-between text-sm">
                {role.cta} <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-primary-200/15 bg-gradient-to-br from-primary-950 via-slate-900 to-sky-950 px-6 py-12 shadow-elevated sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-200">Make the next report count</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Help your city respond, one issue at a time.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Share the details, keep your acknowledgement ID, and follow the work through its status updates.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/register" className="btn-primary justify-center px-6 py-3.5">
              Create an account <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/track" className="btn-secondary justify-center px-6 py-3.5">Track a report</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    { title: "Platform", links: [{ href: "/report", label: "Report an issue" }, { href: "/track", label: "Track a report" }, { href: "/dashboard", label: "My dashboard" }, { href: "/support", label: "Support" }] },
    { title: "Information", links: [{ href: "/privacy-policy", label: "Privacy policy" }, { href: "/terms-and-conditions", label: "Terms and conditions" }] },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/25 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg">
              <Droplets className="h-6 w-6 text-primary-300" aria-hidden="true" />
              <span className="font-display text-xl font-bold text-white">Clear<span className="text-primary-300">Drain</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">A civic maintenance platform that helps residents report drain issues and follow municipal responses.</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-200">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-primary-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.08] pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ClearDrain Civic Platform</p>
          <Link href="/support" className="inline-flex items-center gap-2 transition-colors hover:text-slate-300">
            <Phone className="h-4 w-4" aria-hidden="true" /> Contact support
          </Link>
        </div>
      </div>
    </footer>
  );
}

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
