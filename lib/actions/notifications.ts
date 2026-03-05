// lib/actions/notifications.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ── S'abonner à une notification ──────────────────────────────────────────────
export async function subscribeNotification(bookId: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Non authentifié." };

  const userId = (session.user as any).id;

  try {
    await prisma.bookNotification.create({
      data: { userId, bookId },
    });
    revalidatePath("/catalogue");
    return { success: true, message: "Vous serez notifié par email dès que ce livre sera disponible." };
  } catch {
    // @@unique([userId, bookId]) → déjà inscrit
    return { success: false, error: "Vous êtes déjà inscrit à cette notification." };
  }
}

// ── Se désabonner ─────────────────────────────────────────────────────────────
export async function unsubscribeNotification(bookId: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Non authentifié." };

  const userId = (session.user as any).id;

  try {
    await prisma.bookNotification.deleteMany({ where: { userId, bookId } });
    revalidatePath("/catalogue");
    return { success: true, message: "Notification annulée." };
  } catch {
    return { success: false, error: "Erreur serveur." };
  }
}

// ── Envoyer les notifications quand un livre est rendu (appelé par returnBook) ─
export async function notifyWaitingUsers(bookId: string): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return;

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return;

  // Récupérer les utilisateurs en attente (non encore notifiés)
  const notifications = await prisma.bookNotification.findMany({
    where: { bookId, notified: false },
    include: { user: true },
    orderBy: { createdAt: "asc" }, // Premier inscrit = premier notifié
  });

  if (!notifications.length) return;

  for (const notif of notifications) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "Bibliotheca <onboarding@resend.dev>",
          to: [notif.user.email],
          subject: `📗 "${book.title}" est maintenant disponible !`,
          html: buildAvailabilityEmail(notif.user.name, book.title, book.coverUrl),
        }),
      });

      // Marquer comme notifié
      await prisma.bookNotification.update({
        where: { id: notif.id },
        data: { notified: true },
      });
    } catch (err) {
      console.error("[notifyWaitingUsers]", err);
    }
  }
}

// ── Template email disponibilité ──────────────────────────────────────────────
function buildAvailabilityEmail(userName: string, bookTitle: string, coverUrl: string | null): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:40px auto;background:#1a1728;border-radius:16px;overflow:hidden;border:1px solid #2a2540;">
    <div style="background:linear-gradient(135deg,#c9a96e,#e8c87a);padding:28px 32px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">📗</div>
      <h1 style="margin:0;color:#0f1117;font-size:22px;font-weight:700;">Bonne nouvelle !</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#e8e0d5;font-size:16px;margin:0 0 20px;">Bonjour <strong>${userName}</strong>,</p>
      <p style="color:#9b92a8;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Le livre que vous attendiez est de nouveau disponible :
      </p>
      <div style="background:#13111e;border-radius:12px;padding:20px;display:flex;gap:16px;align-items:center;margin-bottom:24px;">
        ${coverUrl ? `<img src="${coverUrl}" style="width:60px;height:85px;object-fit:cover;border-radius:6px;" />` : "<div style='width:60px;height:85px;background:#2a2540;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:24px;'>📗</div>"}
        <div>
          <div style="font-size:18px;font-weight:700;color:#e8c87a;">"${bookTitle}"</div>
          <div style="font-size:13px;color:#4ade80;margin-top:6px;">✓ Disponible maintenant</div>
        </div>
      </div>
      <p style="color:#6b6475;font-size:13px;">Connectez-vous pour l'emprunter avant qu'il ne soit pris !</p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #2a2540;text-align:center;">
      <p style="color:#4a4258;font-size:12px;margin:0;">Bibliotheca · Gestion de bibliothèque</p>
    </div>
  </div>
</body>
</html>`;
}
