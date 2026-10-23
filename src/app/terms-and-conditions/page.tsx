import type { Metadata } from "next";
import Link from "next/link";
import { Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Clear Drain Terms and Conditions of use for citizens, field technicians, and administrators.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-dark py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <Droplets className="w-5 h-5 text-primary-400" />
            <span className="font-display font-bold text-white">ClearDrain</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Terms &amp; Conditions</h1>
          <p className="text-slate-500 text-sm">Effective Date: October 2026 · Version 1.0</p>
        </div>

        <div className="glass-card p-8 space-y-8 text-slate-300 leading-relaxed">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using the Clear Drain platform ('Service'), you agree to be bound by these Terms & Conditions. If you do not agree, you may not use the Service. These terms apply to all users including Citizens, Field Technicians, and Municipality Administrators."
            },
            {
              title: "2. Use of the Platform",
              content: `You agree to use Clear Drain only for lawful purposes. You must not:
• Submit false, misleading, or fraudulent drain complaints
• Upload inappropriate, offensive, or copyrighted media
• Attempt to gain unauthorized access to other user accounts or admin panels
• Use automated scripts to scrape data or flood the complaint system
• Impersonate municipal officials or field technicians
• Interfere with the platform's AI systems or manipulate priority classifications`
            },
            {
              title: "3. Account Registration",
              content: "You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your password. Citizens and Technicians may self-register. Administrator accounts are provisioned exclusively by the Municipality IT department. Notify us immediately of any unauthorized account access."
            },
            {
              title: "4. Complaint Submission",
              content: `When submitting a drain complaint:
• Provide accurate location, description, and photos to the best of your ability
• Acknowledge that AI-based categorization is automated and may be reviewed by staff
• Understand that resolution timelines depend on severity, resource availability, and weather conditions
• False complaints may result in account suspension and potential legal action under relevant civic laws`
            },
            {
              title: "5. SLA and Escalation",
              content: "Clear Drain commits to a 7-working-day Service Level Agreement (SLA) for complaint resolution. The escalation feature is available only after the SLA period has lapsed and the issue remains unresolved. Misuse of escalation for frivolous purposes may result in reduced priority for future complaints."
            },
            {
              title: "6. Intellectual Property",
              content: "All content, design elements, AI models, and software on the Clear Drain platform are the intellectual property of the Municipal Corporation. You may not copy, reproduce, or distribute any part of the platform without explicit written permission."
            },
            {
              title: "7. Limitation of Liability",
              content: "Clear Drain is provided as a civic service tool. The Municipal Corporation is not liable for any indirect, incidental, or consequential damages arising from: inability to access the platform, delays in resolution beyond the SLA, or technical failures caused by force majeure events. The platform's total liability shall not exceed INR 1,000."
            },
            {
              title: "8. Termination",
              content: "We reserve the right to suspend or terminate accounts that violate these terms, submit fraudulent complaints, or misuse the escalation system. Users may delete their accounts at any time from Settings. Ticket data may be retained for government compliance purposes."
            },
            {
              title: "9. Modifications",
              content: "We may update these Terms periodically. Material changes will be notified via email. Continued use of the platform after changes constitutes acceptance of the new terms."
            },
            {
              title: "10. Governing Law",
              content: "These Terms are governed by the laws of India and the Information Technology Act, 2000. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu."
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-slate-400 text-sm whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <Link href="/" className="text-primary-400 hover:underline">← Back to Home</Link>
          {" · "}
          <Link href="/privacy-policy" className="text-primary-400 hover:underline">Privacy Policy</Link>
          {" · "}
          <Link href="/support" className="text-primary-400 hover:underline">Support</Link>
        </div>
      </div>
    </div>
  );
}
