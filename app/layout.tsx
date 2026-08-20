import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "anterGo Admin",
  description: "Dashboard operasional resmi anterGo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

