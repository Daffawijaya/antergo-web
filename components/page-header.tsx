import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, back, action }: { title: string; back?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur">
      <div className="flex items-center gap-2">{back ? <Link href={back} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><ChevronLeft /></Link> : null}<h1 className="text-lg font-extrabold">{title}</h1></div>{action}
    </header>
  );
}
