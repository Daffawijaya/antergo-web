"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { errorMessage } from "@/lib/api/client";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSubmitting(true); setError("");
    try { await login({ email, password }); router.replace("/dashboard"); }
    catch (reason) { setError(errorMessage(reason)); }
    finally { setSubmitting(false); }
  }

  return (
    <main className="flex min-h-screen flex-col justify-between px-6 py-10 text-white">
      <div><div className="mb-10 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-slate-950"><ShieldCheck /><span className="text-xl font-black">AnterGo</span></div><h1 className="text-4xl font-black leading-tight">Kendalikan operasi<br /><span className="text-amber-400">dengan aman.</span></h1><p className="mt-3 max-w-xs text-slate-400">Dashboard resmi untuk tim administrator AnterGo.</p></div>
      <form onSubmit={submit} className="mt-12 rounded-[2rem] bg-white p-5 text-slate-900 shadow-2xl">
        <h2 className="text-xl font-extrabold">Masuk sebagai admin</h2><p className="mb-5 mt-1 text-sm text-slate-500">Gunakan akun yang memiliki role admin.</p>
        {error ? <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <label className="label">Email</label><input className="field mb-4" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label">Password</label><input className="field mb-5" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={submitting} className="btn-primary w-full gap-2">{submitting ? "Memproses…" : <>Masuk <ArrowRight size={18} /></>}</button>
      </form>
    </main>
  );
}



