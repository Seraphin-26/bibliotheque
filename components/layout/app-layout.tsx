// app/catalogue/layout.tsx  (shared by catalogue + dashboard + admin)
// We'll use a root layout wrapper instead

// components/layout/app-layout.tsx
import { Navbar } from "@/components/layout/navbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1117" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
