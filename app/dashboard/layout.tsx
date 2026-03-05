// app/dashboard/layout.tsx
import { AppLayout } from "@/components/layout/app-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
