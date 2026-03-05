// lib/actions/email.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function sendDueReminders(): Promise<{ sent: number; errors: number; details?: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY || RESEND_API_KEY.trim() === "") {
    return { sent: 0, errors: 0, details: "RESEND_API_KEY manquant dans .env" };
  }

  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);
  in3Days.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingLoans = await prisma.loan.findMany({
    where: {
      status: "ACTIVE",
      dueAt: { gte: today, lte: in3Days },
    },
    include: { book: true, user: true },
  });

  if (upcomingLoans.length === 0) {
    return { sent: 0, errors: 0, details: "Aucun emprunt avec échéance dans les 3 prochains jours" };
  }

  let sent = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  for (const loan of upcomingLoans) {
    const daysLeft = Math.ceil(
      (new Date(loan.dueAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const payload = {
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: [loan.user.email],
      subject: `📚 Rappel : "${loan.book.title}" à retourner dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`,
      html: buildReminderEmail(loan.user.name, loan.book.title, loan.dueAt, daysLeft),
    };

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        sent++;
      } else {
        errors++;
        errorDetails.push(`${loan.user.email} → ${json.message ?? json.name ?? JSON.stringify(json)}`);
      }
    } catch (err: any) {
      errors++;
      errorDetails.push(`${loan.user.email} → ${err.message}`);
    }
  }

  return {
    sent,
    errors,
    details: errorDetails.length > 0 ? errorDetails.join(" | ") : undefined,
  };
}

function buildReminderEmail(userName: string, bookTitle: string, dueAt: Date, daysLeft: number): string {
  const formattedDate = new Date(dueAt).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const urgencyColor = daysLeft <= 1 ? "#f87171" : daysLeft <= 2 ? "#fbbf24" : "#c9a96e";

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:40px auto;background:#1a1728;border-radius:16px;overflow:hidden;border:1px solid #2a2540;">
    <div style="background:linear-gradient(135deg,#c9a96e,#e8c87a);padding:28px 32px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">📚</div>
      <h1 style="margin:0;color:#0f1117;font-size:22px;font-weight:700;">Bibliotheca</h1>
      <p style="margin:4px 0 0;color:#0f1117;opacity:.7;font-size:13px;">Rappel d'échéance</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#e8e0d5;font-size:16px;margin:0 0 20px;">Bonjour <strong>${userName}</strong>,</p>
      <p style="color:#9b92a8;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Vous avez emprunté <strong style="color:#e8e0d5;">"${bookTitle}"</strong> et la date de retour approche.
      </p>
      <div style="background:#13111e;border-radius:12px;padding:20px;border-left:4px solid ${urgencyColor};margin-bottom:24px;">
        <div style="font-size:13px;color:#6b6475;margin-bottom:6px;">Date de retour</div>
        <div style="font-size:18px;font-weight:700;color:${urgencyColor};">
          ${daysLeft <= 1 ? "⚠️ " : "📅 "}${formattedDate}
        </div>
        <div style="font-size:13px;color:#9b92a8;margin-top:6px;">
          ${daysLeft === 0 ? "C'est aujourd'hui !" : `Dans <strong>${daysLeft} jour${daysLeft > 1 ? "s" : ""}</strong>`}
        </div>
      </div>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #2a2540;text-align:center;">
      <p style="color:#4a4258;font-size:12px;margin:0;">Bibliotheca · Gestion de bibliothèque</p>
    </div>
  </div>
</body>
</html>`;
}
