"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // Redirect based on role — session will carry role
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        {/* Orbs */}
        <div className="bg-orb w-96 h-96 bg-primary-600 -top-20 -left-20" />
        <div className="bg-orb w-64 h-64 bg-secondary-600 bottom-20 right-10" />
        <div className="relative z-10 max-w-md px-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-glow-lg mb-8 animate-float">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-display font-black text-white mb-4 leading-tight">
            Clear<span className="text-primary-400">Drain</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Your AI-powered civic drain maintenance platform. Keeping cities clean, one report at a time.
          </p>
          {/* Role pills */}
          <div className="space-y-3">
            {[
              { icon: "👤", label: "Citizen", desc: "Report & track drain issues" },
              { icon: "🔧", label: "Technician", desc: "Manage field tasks" },
              { icon: "🏛️", label: "Admin", desc: "City-wide oversight" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-left">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{r.label}</div>
                  <div className="text-slate-400 text-xs">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Droplets className="w-7 h-7 text-primary-400" />
            <span className="text-2xl font-display font-bold text-white">Clear<span className="text-primary-400">Drain</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your ClearDrain account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="label-field">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label-field mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 p-4 rounded-xl bg-slate-800/40 border border-white/5 text-xs text-slate-500">
            <strong className="text-slate-400">Demo Accounts:</strong><br />
            👤 citizen@demo.com / demo1234<br />
            🔧 tech@demo.com / demo1234<br />
            🏛️ admin@demo.com / demo1234
          </div>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
