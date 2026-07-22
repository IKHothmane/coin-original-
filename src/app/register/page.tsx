"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/firebase/auth";
import { ThemeLogo } from "@/components/homepage-sections";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password, fullName);
      router.push("/mon-compte");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8">
        <ThemeLogo width={56} height={56} className="border border-[var(--border-soft)] object-cover" />
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="font-[var(--font-display)] text-2xl uppercase tracking-wider mb-6 text-center">
          Créer un compte
        </h1>

        {error && (
          <div className="mb-4 border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-sm text-[#e5e2e1] outline-none focus:border-[#ffb59e]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-sm text-[#e5e2e1] outline-none focus:border-[#ffb59e]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-sm text-[#e5e2e1] outline-none focus:border-[#ffb59e]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-sm text-[#e5e2e1] outline-none focus:border-[#ffb59e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#ffb59e] bg-[#ffb59e] px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#131313] transition-colors hover:bg-transparent hover:text-[#ffb59e] disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-[#a3a1a0] hover:text-[#e5e2e1]">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
