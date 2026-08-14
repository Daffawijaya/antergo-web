"use client";

import Link from "next/link";
import { Home, ListOrdered, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: ListOrdered },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-20 max-w-md items-center justify-around border-t border-slate-100 bg-white/95 px-6 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/home" && pathname.startsWith(href));
        return <Link key={href} href={href} className={`flex min-w-16 flex-col items-center gap-1 text-xs font-semibold ${active ? "text-amber-600" : "text-slate-400"}`}><Icon size={21} strokeWidth={active ? 2.8 : 2} />{label}</Link>;
      })}
    </nav>
  );
}
