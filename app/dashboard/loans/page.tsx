// app/dashboard/loans/page.tsx
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-helpers";
import { formatDate, isOverdue, daysUntilDue } from "@/lib/utils";
import { ReturnButton } from "@/components/loans/return-button";
import { BookCover } from "@/components/books/book-cover";

export default async function DashboardLoansPage() {
  const session = await getRequiredSession();
  const userId = (session.user as any).id;

  const loans = await prisma.loan.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { borrowedAt: "desc" },
  });

  const active = loans.filter(l => l.status === "ACTIVE" || l.status === "OVERDUE");
  const history = loans.filter(l => l.status === "RETURNED");

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8c87a", marginBottom: "6px", fontFamily: "Georgia, serif" }}>
        Mes emprunts
      </h1>
      <p style={{ color: "#6b6475", fontSize: "14px", marginBottom: "32px" }}>
        {active.length} emprunt{active.length !== 1 ? "s" : ""} actif{active.length !== 1 ? "s" : ""}
      </p>

      {active.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: "#9b92a8", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            EN COURS
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {active.map(loan => {
              const overdue = isOverdue(loan.dueAt);
              const days = daysUntilDue(loan.dueAt);
              return (
                <div key={loan.id} style={{
                  background: "#1a1728",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  border: `1px solid ${overdue ? "#450a0a" : "#2a2540"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}>
                  <BookCover src={loan.book.coverUrl} alt={loan.book.title} width={45} height={62} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#e8e0d5", marginBottom: "4px" }}>{loan.book.title}</div>
                    <div style={{ fontSize: "13px", color: "#6b6475" }}>{loan.book.author}</div>
                    <div style={{ fontSize: "12px", marginTop: "6px", color: overdue ? "#f87171" : days <= 3 ? "#fbbf24" : "#9b92a8" }}>
                      {overdue
                        ? `⚠ En retard de ${Math.abs(days)} jour${Math.abs(days) > 1 ? "s" : ""}`
                        : `📅 Retour avant le ${formatDate(loan.dueAt)} (${days}j)`}
                    </div>
                  </div>
                  <ReturnButton loanId={loan.id} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: "#9b92a8", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            HISTORIQUE
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map(loan => (
              <div key={loan.id} style={{
                background: "#13111e",
                borderRadius: "10px",
                padding: "12px 18px",
                border: "1px solid #1f1c2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: 0.7,
              }}>
                <div>
                  <span style={{ fontWeight: 600, color: "#9b92a8", fontSize: "14px" }}>{loan.book.title}</span>
                  <span style={{ fontSize: "12px", color: "#4a4258", marginLeft: "12px" }}>
                    Rendu le {formatDate(loan.returnedAt!)}
                  </span>
                </div>
                <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "#1c3a2a", color: "#4ade80" }}>
                  ✓ Rendu
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {loans.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b6475" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
          <p style={{ fontSize: "16px" }}>Vous n'avez pas encore emprunté de livre.</p>
          <a href="/catalogue" style={{ display: "inline-block", marginTop: "16px", padding: "10px 24px", background: "#c9a96e", color: "#0f1117", borderRadius: "10px", textDecoration: "none", fontWeight: 700 }}>
            Explorer le catalogue →
          </a>
        </div>
      )}
    </div>
  );
}
