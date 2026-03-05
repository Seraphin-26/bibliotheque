// app/catalogue/layout.tsx
import { AppLayout } from "@/components/layout/app-layout";

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
