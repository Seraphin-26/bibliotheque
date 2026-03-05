// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Bibliotheca — Gestion de Bibliothèque",
  description: "Application de gestion de bibliothèque moderne avec Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
