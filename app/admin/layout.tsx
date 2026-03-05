// app/admin/layout.tsx
import { AppLayout } from "@/components/layout/app-layout";
import { getAdminSession } from "@/lib/auth-helpers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await getAdminSession(); // redirects non-admins
  return <AppLayout>{children}</AppLayout>;
}
