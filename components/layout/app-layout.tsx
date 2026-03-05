// components/layout/app-layout.tsx
import { Navbar } from "@/components/layout/navbar";
import { DemoBanner } from "@/components/layout/demo-banner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117" }}>
      {isDemo && <DemoBanner />}
      <Navbar />
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1.5rem 1rem",
      }}>
        {children}
      </main>
    </div>
  );
}
