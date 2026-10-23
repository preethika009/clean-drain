import type { Metadata } from "next";
import Link from "next/link";
import { Droplets, Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Support",
  description: "Get help with Clear Drain civic drain maintenance platform. Contact our support team or browse FAQs.",
};

const FAQS = [
  { q: "How do I report a drain blockage?", a: "Click 'Report Issue' on the homepage or dashboard. Use GPS to pin the location, add photos and a description, and submit. You'll receive an Acknowledgement ID instantly." },
  { q: "How long does resolution take?", a: "Our SLA guarantees resolution within 7 working days. Urgent issues (flooding, sewage overflow) are prioritized and addressed within 24–48 hours." },
  { q: "Can I track my complaint status?", a: "Yes! Use your Acknowledgement ID (CD-XXXX format) on the Track page or in the ClearBot chatbot to get real-time status updates." },
  { q: "What if my issue isn't resolved in 7 days?", a: "An 'Escalate Issue' button will appear on your ticket after the SLA period. Click it, provide a reason, and our senior supervisors will be notified immediately." },
  { q: "How do I upload photos?", a: "During the report submission (Step 3), you can upload up to 3 before-photos. Field technicians upload after-photos upon job completion." },
  { q: "What languages does ClearBot support?", a: "ClearBot supports English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, and Bengali." },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-surface-dark py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors">
            <Droplets className="w-5 h-5 text-primary-400" />
            <span className="font-display font-bold text-white">ClearDrain</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Customer Support</h1>
          <p className="text-slate-400 text-lg">We&apos;re here to help — 24/7 for emergencies, 9 AM–6 PM for general queries.</p>
        </div>

        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: Phone, label: "Call Us", value: "1800-DRAIN-HELP", sub: "Mon–Sat, 9 AM–6 PM", color: "from-primary-600 to-primary-800", href: "tel:18001234567" },
            { icon: Mail, label: "Email Support", value: "support@cleardrain.gov.in", sub: "Response within 24 hours", color: "from-emerald-600 to-emerald-800", href: "mailto:support@cleardrain.gov.in" },
            { icon: MessageCircle, label: "AI Chatbot", value: "ClearBot", sub: "Available 24/7 in 8 languages", color: "from-purple-600 to-purple-800", href: "/" },
          ].map((c) => (
            <a key={c.label} href={c.href} className="glass-card p-6 text-center hover:border-white/15 transition-all group">
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">{c.label}</h3>
              <p className="text-primary-400 font-medium text-sm">{c.value}</p>
              <p className="text-slate-500 text-xs mt-1">{c.sub}</p>
            </a>
          ))}
        </div>

        {/* Office info */}
        <div className="glass-card p-6 mb-12 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-400" /> Municipal Sanitation Office
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              2nd Floor, Civic Centre Building,<br />
              Municipal Corporation Area,<br />
              Chennai — 600 001, Tamil Nadu, India
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" /> Office Hours
            </h2>
            <div className="text-sm text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Monday – Friday</span><span className="text-white">9:00 AM – 6:00 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span className="text-white">9:00 AM – 1:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday & Holidays</span><span className="text-slate-600">Emergency only</span></div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <h2 className="text-2xl font-display font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="glass-card p-5 group">
              <summary className="cursor-pointer list-none text-white font-medium flex items-center justify-between">
                {faq.q}
                <span className="text-primary-400 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center text-slate-500 text-sm">
          <Link href="/" className="text-primary-400 hover:underline">← Back to Home</Link>
          {" · "}
          <Link href="/privacy-policy" className="text-primary-400 hover:underline">Privacy Policy</Link>
          {" · "}
          <Link href="/terms-and-conditions" className="text-primary-400 hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}
