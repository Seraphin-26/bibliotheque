// lib/actions/loans.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyWaitingUsers } from "@/lib/actions/notifications";

type ActionResult =
  | { success: true; message: string; data?: any }
  | { success: false; error: string };

export async function borrowBook(
  bookId: string,
  durationDays: number = 14
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Non authentifié." };

    const userId = (session.user as any).id;

    // 1. Bloquer si emprunts en retard
    const activeLoans = await prisma.loan.findMany({
      where: { userId, status: { in: ["ACTIVE", "OVERDUE"] } },
      include: { book: true },
    });

    const overdueLoans = activeLoans.filter(
      l => l.status === "OVERDUE" || new Date(l.dueAt) < new Date()
    );

    if (overdueLoans.length > 0) {
      const titles = overdueLoans.map(l => `"${l.book.title}"`).join(", ");
      return {
        success: false,
        error: `Emprunts en retard : ${titles}. Retournez-les avant d'emprunter un nouveau livre.`,
      };
    }

    // 2. Vérifier disponibilité
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { loans: { where: { status: { in: ["ACTIVE", "OVERDUE"] } } } },
    });

    if (!book) return { success: false, error: "Livre introuvable." };
    if (book.loans.length >= book.totalCopies) {
      return { success: false, error: "Toutes les copies sont déjà empruntées." };
    }

    // 3. Vérifier doublon
    const existingLoan = await prisma.loan.findFirst({
      where: { bookId, userId, status: { in: ["ACTIVE", "OVERDUE"] } },
    });
    if (existingLoan) return { success: false, error: "Vous empruntez déjà ce livre." };

    // 4. Créer l'emprunt
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + durationDays);

    const loan = await prisma.loan.create({
      data: { bookId, userId, dueAt, status: "ACTIVE" },
    });

    revalidatePath("/catalogue");
    revalidatePath("/dashboard/loans");

    return {
      success: true,
      message: `"${book.title}" emprunté pour ${durationDays} jours. Retour avant le ${dueAt.toLocaleDateString("fr-FR")}.`,
      data: loan,
    };
  } catch (error) {
    console.error("[borrowBook]", error);
    return { success: false, error: "Erreur serveur." };
  }
}

export async function returnBook(loanId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Non authentifié." };

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { book: true },
    });

    if (!loan) return { success: false, error: "Emprunt introuvable." };

    await prisma.loan.update({
      where: { id: loanId },
      data: { returnedAt: new Date(), status: "RETURNED" },
    });

    // Notifier les utilisateurs en attente pour ce livre
    await notifyWaitingUsers(loan.bookId);

    revalidatePath("/catalogue");
    revalidatePath("/dashboard/loans");
    revalidatePath("/admin/loans");

    return { success: true, message: `"${loan.book.title}" retourné avec succès.` };
  } catch (error) {
    console.error("[returnBook]", error);
    return { success: false, error: "Erreur serveur." };
  }
}

export async function updateOverdueLoans(): Promise<ActionResult> {
  try {
    const updated = await prisma.loan.updateMany({
      where: { status: "ACTIVE", dueAt: { lt: new Date() } },
      data: { status: "OVERDUE" },
    });

    revalidatePath("/admin/loans");
    revalidatePath("/dashboard/loans");

    return { success: true, message: `${updated.count} emprunt(s) marqué(s) en retard.` };
  } catch (error) {
    return { success: false, error: "Erreur serveur." };
  }
}
