"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

const WARDS = [
  "Ward 1 - North", "Ward 2 - North", "Ward 3 - Central", "Ward 4 - Central",
  "Ward 5 - South", "Ward 6 - South", "Ward 7 - East", "Ward 8 - East",
  "Ward 9 - West", "Ward 10 - West",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "technician" ? "TECHNICIAN" : "CITIZEN";

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", ward: "", role: defaultRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          ward: form.ward,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <Droplets className="w-8 h-8 text-primary-400" />
          <span className="text-2xl font-display font-bold text-white">Clear<span className="text-primary-400">Drain</span></span>
        </Link>

        <div className="glass-card p-5 sm:p-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-6">Join Clear Drain and help keep your city&apos;s drains clean.</p>

          {success ? (
            <div className="text-center py-8">
              <div role="status" aria-live="polite">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Account Created!</h3>
              <p className="text-slate-400">Redirecting you to login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-200" role="alert" aria-live="assertive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Role selector */}
              <div>
                <label className="label-field">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "CITIZEN", label: "Citizen", icon: "👤" },
                    { value: "TECHNICIAN", label: "Technician", icon: "🔧" },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      aria-pressed={form.role === r.value}
                      onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                        ${form.role === r.value
                          ? "border-primary-500 bg-primary-900/30 text-white"
                          : "border-white/10 bg-slate-800/30 text-slate-400 hover:border-white/20"
                        }`}
                    >
                      <span>{r.icon}</span> {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-name" className="label-field">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="name" id="reg-name" value={form.name} onChange={handleChange} className="input-field pl-10" placeholder="John Doe" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-phone" className="label-field">Phone (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="phone" id="reg-phone" value={form.phone} onChange={handleChange} className="input-field pl-10" placeholder="+91 9999999999" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="label-field">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="email" id="reg-email" type="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label htmlFor="reg-ward" className="label-field">Your Ward</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                  <select name="ward" id="reg-ward" value={form.ward} onChange={handleChange} className="select-field pl-10">
                    <option value="">Select your ward</option>
                    {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-password" className="label-field">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="password" id="reg-password" type="password" value={form.password} onChange={handleChange} className="input-field pl-10" placeholder="Min 8 chars" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-confirm" className="label-field">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="confirmPassword" id="reg-confirm" type="password" value={form.confirmPassword} onChange={handleChange} className="input-field pl-10" placeholder="Repeat password" required />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-500">
                <input type="checkbox" id="reg-tos" required className="mt-0.5 accent-primary-500" />
                <label htmlFor="reg-tos">
                  I agree to the <Link href="/terms-and-conditions" className="text-primary-400 hover:underline">Terms & Conditions</Link> and <Link href="/privacy-policy" className="text-primary-400 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" id="reg-submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating account...</>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-dark flex items-center justify-center" role="status">
          <span className="sr-only">Loading registration form</span>
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
