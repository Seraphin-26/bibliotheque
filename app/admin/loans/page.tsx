// app/admin/loans/page.tsx
import { prisma } from "@/lib/prisma";
import { formatDate, isOverdue } from "@/lib/utils";

export default async function AdminLoansPage() {
  const loans = await prisma.loan.findMany({
    include: { book: true, user: true },
    orderBy: { borrowedAt: "desc" },
  });

  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === "ACTIVE").length,
    overdue: loans.filter(l => l.status === "OVERDUE" || (l.status === "ACTIVE" && isOverdue(l.dueAt))).length,
    returned: loans.filter(l => l.status === "RETURNED").length,
  };

  return (
    <div>
      <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, color: "#e8c87a", marginBottom: "24px", fontFamily: "Georgia, serif" }}>
        Gestion des emprunts
      </h1>

      {/* Stats — 2 colonnes sur mobile, 4 sur desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
        {[
          { label: "Total", value: stats.total, color: "#9b92a8" },
          { label: "Actifs", value: stats.active, color: "#818cf8" },
          { label: "En retard", value: stats.overdue, color: "#f87171" },
          { label: "Retournés", value: stats.returned, color: "#4ade80" },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1728", borderRadius: "12px", padding: "14px 16px", border: "1px solid #2a2540" }}>
            <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#6b6475", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards sur mobile, table sur desktop */}
      <div className="loans-table-wrapper" style={{ background: "#1a1728", borderRadius: "14px", border: "1px solid #2a2540", overflow: "hidden" }}>
        {/* Table desktop */}
        <table className="loans-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2540", background: "#13111e" }}>
              {["Livre", "Utilisateur", "Emprunté le", "Échéance", "Statut"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#6b6475", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => {
              const overdue = loan.status === "ACTIVE" && isOverdue(loan.dueAt);
              const displayStatus = overdue ? "OVERDUE" : loan.status;
              return (
                <tr key={loan.id} style={{ borderBottom: "1px solid #1f1c2e" }}>
                  <td style={{ padding: "12px 16px", color: "#e8e0d5", fontSize: "13px", fontWeight: 600 }}>{loan.book.title}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "13px", color: "#9b92a8" }}>{loan.user.name}</div>
                    <div style={{ fontSize: "11px", color: "#4a4258" }}>{loan.user.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "12px" }}>{formatDate(loan.borrowedAt)}</td>
                  <td style={{ padding: "12px 16px", color: overdue ? "#f87171" : "#6b6475", fontSize: "12px" }}>{formatDate(loan.dueAt)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                      background: displayStatus === "RETURNED" ? "#1c3a2a" : displayStatus === "OVERDUE" ? "#450a0a" : "#1e1a38",
                      color: displayStatus === "RETURNED" ? "#4ade80" : displayStatus === "OVERDUE" ? "#f87171" : "#818cf8",
                    }}>
                      {displayStatus === "RETURNED" ? "✓ Rendu" : displayStatus === "OVERDUE" ? "⚠ Retard" : "● Actif"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Cards mobile */}
        <div className="loans-cards">
          {loans.map(loan => {
            const overdue = loan.status === "ACTIVE" && isOverdue(loan.dueAt);
            const displayStatus = overdue ? "OVERDUE" : loan.status;
            return (
              <div key={loan.id} style={{ padding: "14px 16px", borderBottom: "1px solid #1f1c2e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700, color: "#e8e0d5", fontSize: "14px", flex: 1, marginRight: "10px" }}>{loan.book.title}</span>
                  <span style={{
                    padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, flexShrink: 0,
                    background: displayStatus === "RETURNED" ? "#1c3a2a" : displayStatus === "OVERDUE" ? "#450a0a" : "#1e1a38",
                    color: displayStatus === "RETURNED" ? "#4ade80" : displayStatus === "OVERDUE" ? "#f87171" : "#818cf8",
                  }}>
                    {displayStatus === "RETURNED" ? "✓ Rendu" : displayStatus === "OVERDUE" ? "⚠ Retard" : "● Actif"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#9b92a8" }}>{loan.user.name}</div>
                <div style={{ fontSize: "11px", color: "#4a4258", marginTop: "4px" }}>
                  Emprunté {formatDate(loan.borrowedAt)} · Échéance {formatDate(loan.dueAt)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .loans-table { display: table; }
        .loans-cards { display: none; }
        @media (max-width: 640px) {
          .loans-table { display: none; }
          .loans-cards { display: block; }
        }
      `}</style>
    </div>
  );
}
