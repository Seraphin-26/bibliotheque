// lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string; // "USER" | "ADMIN"
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}

export async function getAdminSession() {
  const session = await getRequiredSession();
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");
  return session;
}
