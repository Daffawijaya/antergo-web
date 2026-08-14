import { AdminShell } from "@/components/admin/admin-shell";

export default function LegacyAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
