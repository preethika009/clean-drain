import type { Metadata } from "next";
import Link from "next/link";
import { Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Clear Drain Privacy Policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-dark py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <Droplets className="w-5 h-5 text-primary-400" />
            <span className="font-display font-bold text-white">ClearDrain</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: October 2026</p>
        </div>

        <div className="glass-card p-8 space-y-8 text-slate-300 leading-relaxed">
          {[
            {
              title: "1. Information We Collect",
              content: `We collect the following types of information when you use Clear Drain:
• Personal Information: Name, email address, phone number, and ward/location details provided during registration.
• Location Data: GPS coordinates and address information you provide when reporting drain issues. This is essential for geotagging complaints.
• Photos & Media: Images you upload as part of drain issue reports.
• Usage Data: How you interact with our platform, including pages visited, features used, and time spent.
• Device Information: Browser type, operating system, and IP address for security and analytics.`
            },
            {
              title: "2. How We Use Your Information",
              content: `Your information is used to:
• Process and track your civic complaint submissions
• Send acknowledgement emails with your ticket details
• Route complaints to the appropriate municipal zone and field technicians
• Send bi-monthly drain maintenance reminders (you can opt out in Settings)
• Improve our AI categorization and prioritization systems
• Generate anonymized analytics for municipality planning
• Comply with legal obligations and government audit requirements`
            },
            {
              title: "3. Data Sharing",
              content: `We do not sell your personal data. We share information only with:
• Municipal Corporation officials and assigned sanitation workers — to resolve your complaint
• AI processing services (Google Gemini) — for complaint analysis only, under strict data processing agreements
• Email service providers — solely for sending notifications related to your tickets
• Government authorities — when legally required by law enforcement or court order`
            },
            {
              title: "4. Data Security",
              content: `We implement industry-standard security measures including:
• Password hashing using bcrypt with 12 rounds
• HTTPS encryption for all data in transit
• Database access controls and role-based permissions
• Regular security audits and vulnerability assessments
• Uploaded media stored in access-controlled storage`
            },
            {
              title: "5. Your Rights",
              content: `You have the right to:
• Access: Request a copy of all personal data we hold about you
• Correction: Update incorrect or incomplete information via your account settings
• Deletion: Request deletion of your account and associated data (tickets may be retained for government records)
• Opt-out: Unsubscribe from bi-monthly reminders and non-essential notifications
• Portability: Export your ticket history in JSON format

To exercise these rights, contact: privacy@cleardrain.gov.in`
            },
            {
              title: "6. Cookies",
              content: `We use essential cookies for authentication (session management) and optional analytics cookies to understand platform usage. You can disable analytics cookies in your browser settings. Essential cookies cannot be disabled as they are required for login functionality.`
            },
            {
              title: "7. Data Retention",
              content: `Personal account data is retained for as long as your account is active. Closed complaint tickets are retained for 5 years as required by municipal record-keeping regulations. You may request account deletion, after which personal data is anonymized within 30 days.`
            },
            {
              title: "8. Contact",
              content: `For privacy-related inquiries:
Email: privacy@cleardrain.gov.in
Phone: 1800-DRAIN-HELP
Address: Municipal Sanitation Office, Civic Centre, Chennai — 600 001`
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
          <Link href="/terms-and-conditions" className="text-primary-400 hover:underline">Terms & Conditions</Link>
          {" · "}
          <Link href="/support" className="text-primary-400 hover:underline">Support</Link>
        </div>
      </div>
    </div>
  );
}
