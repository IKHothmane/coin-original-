"use client";

import { SiteFooter } from "@/components/homepage-sections";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, loginWithGoogle } from "@/lib/firebase/auth";
import {
  DesktopTopBar,
  MobileTopBar,
} from "@/components/homepage-sections";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const glow = document.querySelector(".urban-gradient") as HTMLElement;
    if (glow) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 77, 0, 0.12) 0%, rgba(15, 15, 15, 1) 80%)`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-on-surface dark">
      {/* Navbar */}
      <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <div className="md:hidden">
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>

      {/* Background Decoration */}
      <div
        className="urban-gradient fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 53.75% 99.3164%, rgba(255, 77, 0, 0.12) 0%, rgb(15, 15, 15) 80%)",
        }}
      />
      <div className="fixed inset-0 grainy-overlay z-0 pointer-events-none" />

      {/* Main Content Canvas */}
      <main className="page-with-header relative z-10 flex flex-grow items-center justify-center px-5 pb-12 md:px-20">
        {/* Login Card */}
        <div className="w-full max-w-md bg-surface-container border-2 border-outline-variant p-6 shadow-[10px_10px_0px_0px_rgba(255,77,0,0.5)]">
          {/* Logo Header */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl uppercase tracking-tighter text-primary-container leading-none">
              COIN ORIGINAL
            </h1>
            <span className="font-mono text-xs text-on-surface-variant mt-1 tracking-widest uppercase border-t border-outline-variant pt-1 px-4">
              Admin Portal
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 border border-red-500 bg-red-500/10 px-4 py-3 text-xs text-red-400 uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" onMouseMove={handleMouseMove}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-primary-container tracking-widest">
                Admin Identifier
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@coin-original.ma"
                  required
                  className="w-full bg-surface-container-high border-2 border-outline-variant focus:border-primary-container focus:ring-0 text-sm font-body-md p-3 text-on-surface placeholder:text-on-surface-variant transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-primary-container tracking-widest">
                Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container-high border-2 border-outline-variant focus:border-primary-container focus:ring-0 text-sm font-body-md p-3 text-on-surface placeholder:text-on-surface-variant transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-surface-container-high border-2 border-outline-variant text-primary-container focus:ring-offset-0 focus:ring-0"
                />
                <span className="font-mono text-xs text-on-surface-variant group-hover:text-on-surface transition-colors tracking-widest">
                  REMEMBER ME
                </span>
              </label>
              <Link href="#" className="font-mono text-xs text-primary-container hover:underline tracking-tight">
                FORGOT PASSWORD?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-container hover:bg-inverse-primary text-on-primary-container font-display-lg text-sm uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 group border-2 border-primary-container disabled:opacity-50"
            >
              {loading ? "CONNECTING..." : "LOGIN TO DASHBOARD"}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
                arrow_forward
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-grow h-px bg-outline-variant/30" />
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">OU</span>
              <div className="flex-grow h-px bg-outline-variant/30" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-2 border-outline-variant disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuer avec Google
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20">
        <SiteFooter />
      </footer>

      <style jsx>{`
        .grainy-overlay {
          background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
          opacity: 0.05;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
