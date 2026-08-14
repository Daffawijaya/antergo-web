"use client";

import { Bike, LayoutDashboard, LogOut, Menu, PackageSearch, Store, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard], ["/users", "Users", Users],
  ["/drivers", "Drivers", Bike], ["/merchants", "Merchants", Store], ["/orders", "Orders", PackageSearch],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!loading && (!user || !user.roles.includes("admin"))) router.replace("/login");
  }, [loading, router, user]);
  if (loading || !user || !user.roles.includes("admin")) return <LoadingScreen />;

  return <div className="min-h-screen bg-slate-50">
    <button className="fixed left-4 top-4 z-40 rounded-xl bg-slate-950 p-2 text-white lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-950 p-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/10 p-3"><span className="rounded-xl bg-amber-400 p-2 text-slate-950"><Bike /></span><div><strong>AnterGo</strong><p className="text-xs text-slate-400">Admin Operations</p></div></div>
      <nav className="space-y-1">{links.map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${pathname === href || pathname.startsWith(`${href}/`) ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={19} />{label}</Link>)}</nav>
      <button className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10" onClick={() => void logout()}><LogOut size={19} />Logout</button>
    </aside>
    <main className="min-h-screen p-5 pt-20 lg:ml-64 lg:p-8"><div className="mx-auto max-w-7xl">{children}</div></main>
  </div>;
}
