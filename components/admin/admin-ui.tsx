import Link from "next/link";

export function PageTitle({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-black text-slate-950">{title}</h1><p className="mt-1 text-sm text-slate-500">{description}</p></div>{action}</div>;
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "red" | "amber" | "blue" }) {
  const tones = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-100 text-emerald-700", red: "bg-rose-100 text-rose-700", amber: "bg-amber-100 text-amber-800", blue: "bg-blue-100 text-blue-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

export function StatusBadge({ value }: { value: string }) {
  const tone = ["approved", "active", "paid", "completed", "open"].includes(value) ? "green" : ["rejected", "suspended", "inactive", "cancelled", "failed"].includes(value) ? "red" : ["pending", "searching_driver"].includes(value) ? "amber" : "blue";
  return <Badge tone={tone}>{value.replaceAll("_", " ")}</Badge>;
}

export function LoadingRows() { return <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>; }
export function EmptyState({ message = "Belum ada data." }: { message?: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">{message}</div>; }
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700">{message}{retry ? <button className="ml-3 font-bold underline" onClick={retry}>Coba lagi</button> : null}</div>; }
export function DetailLink({ href }: { href: string }) { return <Link className="font-bold text-amber-700 hover:text-amber-900" href={href}>Detail</Link>; }

export function Pagination({ page, lastPage, onPage }: { page: number; lastPage: number; onPage: (page: number) => void }) {
  return <div className="mt-5 flex items-center justify-between text-sm"><button className="admin-btn-secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Sebelumnya</button><span className="text-slate-500">Halaman {page} dari {lastPage}</span><button className="admin-btn-secondary" disabled={page >= lastPage} onClick={() => onPage(page + 1)}>Berikutnya</button></div>;
}
