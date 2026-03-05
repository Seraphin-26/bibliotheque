// lib/actions/test.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendDueReminders } from "@/lib/actions/email";
import { notifyWaitingUsers } from "@/lib/actions/notifications";
import { revalidatePath } from "next/cache";

type TestResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function simulateNearDueLoan(hoursFromNow: number = 12): Promise<TestResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Admin uniquement." };
  }

  const userId = (session.user as any).id;

  // Vérifier que l'user existe bien en base
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "Utilisateur introuvable — déconnectez-vous et reconnectez-vous." };

  const book = await prisma.book.findFirst({
    include: { loans: { where: { status: { in: ["ACTIVE", "OVERDUE"] } } } },
  });

  if (!book) return { success: false, error: "Aucun livre trouvé." };

  const dueAt = new Date();
  dueAt.setHours(dueAt.getHours() + hoursFromNow);

  const existingLoan = await prisma.loan.findFirst({
    where: { userId, bookId: book.id, status: "ACTIVE" },
  });

  if (existingLoan) {
    await prisma.loan.update({
      where: { id: existingLoan.id },
      data: { dueAt },
    });
  } else {
    await prisma.loan.create({
      data: { userId, bookId: book.id, dueAt, status: "ACTIVE" },
    });
  }

  revalidatePath("/dashboard/loans");

  return {
    success: true,
    message: `Emprunt de "${book.title}" créé — échéance dans ${hoursFromNow}h (${dueAt.toLocaleString("fr-FR")}).`,
  };
}

export async function triggerReminderEmails(): Promise<TestResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Admin uniquement." };
  }

  const result = await sendDueReminders();

  // Afficher les détails d'erreur dans la console
  if (result.details) {
    console.error("[triggerReminderEmails] Détails:", result.details);
  }

  if (result.sent === 0 && result.errors === 0) {
    return { success: true, message: `ℹ️ ${result.details ?? "Aucun emprunt éligible."}` };
  }

  const detail = result.details ? ` — ${result.details}` : "";
  return {
    success: result.errors === 0,
    ...(result.errors === 0
      ? { message: `📧 ${result.sent} email(s) envoyé(s) avec succès.` }
      : { error: `📧 ${result.sent} envoyé(s), ${result.errors} erreur(s)${detail}` }),
  };
}

export async function simulateBookReturn(bookId: string): Promise<TestResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Admin uniquement." };
  }

  const loan = await prisma.loan.findFirst({
    where: { bookId, status: { in: ["ACTIVE", "OVERDUE"] } },
    include: { book: true },
  });

  if (!loan) return { success: false, error: "Aucun emprunt actif pour ce livre." };

  await prisma.loan.update({
    where: { id: loan.id },
    data: { returnedAt: new Date(), status: "RETURNED" },
  });

  await notifyWaitingUsers(bookId);

  revalidatePath("/catalogue");
  revalidatePath("/admin/loans");

  return {
    success: true,
    message: `"${loan.book.title}" marqué comme retourné — notifications envoyées aux abonnés.`,
  };
}

export async function getTestData() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return null;

  const [activeLoans, notifications, books] = await Promise.all([
    prisma.loan.findMany({
      where: { status: { in: ["ACTIVE", "OVERDUE"] } },
      include: { book: true, user: true },
      orderBy: { dueAt: "asc" },
    }),
    prisma.bookNotification.findMany({
      where: { notified: false },
      include: { book: true, user: true },
    }),
    prisma.book.findMany({
      include: { loans: { where: { status: { in: ["ACTIVE", "OVERDUE"] } } } },
      orderBy: { title: "asc" },
    }),
  ]);

  return { activeLoans, notifications, books };
}
