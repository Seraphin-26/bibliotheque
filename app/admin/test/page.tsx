// app/admin/test/page.tsx
import { getAdminSession } from "@/lib/auth-helpers";
import { getTestData } from "@/lib/actions/test";
import { TestPanel } from "@/components/admin/test-panel";
import { formatDate } from "@/lib/utils";

export default async function TestPage() {
  await getAdminSession();
  const data = await getTestData();

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8c87a", fontFamily: "Georgia, serif", margin: 0 }}>
            Environnement de test
          </h1>
          <span style={{ padding: "3px 10px", background: "#450a0a", color: "#f87171", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
            ADMIN ONLY
          </span>
        </div>
        <p style={{ color: "#6b6475", fontSize: "14px" }}>
          Simule les scénarios sans attendre les vraies échéances.
        </p>
      </div>

      <TestPanel />

      {/* État actuel */}
      <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Emprunts actifs */}
        <div style={{ background: "#1a1728", borderRadius: "14px", padding: "20px", border: "1px solid #2a2540" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#9b92a8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "14px" }}>
            📖 Emprunts actifs ({data?.activeLoans.length ?? 0})
          </h2>
          {data?.activeLoans.length === 0 ? (
            <p style={{ color: "#4a4258", fontSize: "13px" }}>Aucun emprunt actif.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data?.activeLoans.map(loan => {
                const overdue = new Date(loan.dueAt) < new Date();
                return (
                  <div key={loan.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", background: "#13111e", borderRadius: "8px",
                    border: `1px solid ${overdue ? "#450a0a" : "#1f1c2e"}`,
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: "#e8e0d5", fontSize: "13px" }}>{loan.book.title}</span>
                      <span style={{ color: "#6b6475", fontSize: "12px", marginLeft: "10px" }}>→ {loan.user.name}</span>
                    </div>
                    <span style={{ fontSize: "12px", color: overdue ? "#f87171" : "#9b92a8" }}>
                      {overdue ? "⚠ " : "📅 "}{formatDate(loan.dueAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications en attente */}
        <div style={{ background: "#1a1728", borderRadius: "14px", padding: "20px", border: "1px solid #2a2540" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#9b92a8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "14px" }}>
            🔔 Notifications en attente ({data?.notifications.length ?? 0})
          </h2>
          {data?.notifications.length === 0 ? (
            <p style={{ color: "#4a4258", fontSize: "13px" }}>Aucune notification en attente.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data?.notifications.map(notif => (
                <div key={notif.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "#13111e", borderRadius: "8px",
                  border: "1px solid #1e1a38",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#e8e0d5", fontSize: "13px" }}>{notif.book.title}</span>
                    <span style={{ color: "#6b6475", fontSize: "12px", marginLeft: "10px" }}>→ {notif.user.name}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#818cf8" }}>En attente</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
