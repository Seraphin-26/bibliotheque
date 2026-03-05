// app/api/cron/route.ts
// Appelé automatiquement chaque jour par Vercel Cron (ou manuellement)
// Config dans vercel.json

import { NextResponse } from "next/server";
import { updateOverdueLoans } from "@/lib/actions/loans";
import { sendDueReminders } from "@/lib/actions/email";

export async function GET(request: Request) {
  // Sécurité : vérifier le token secret pour éviter les appels non autorisés
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    // 1. Marquer les emprunts expirés comme OVERDUE
    const overdueResult = await updateOverdueLoans();

    // 2. Envoyer les emails de rappel (J-3 et J-1)
    const emailResult = await sendDueReminders();

    return NextResponse.json({
      success: true,
      overdue: overdueResult,
      emails: emailResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cron]", error);
    return NextResponse.json({ error: "Erreur cron." }, { status: 500 });
  }
}
