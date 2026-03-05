// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { loans: true } },
      loans: { where: { status: "ACTIVE" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, color: "#e8c87a", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
        Utilisateurs
      </h1>
      <p style={{ color: "#6b6475", fontSize: "14px", marginBottom: "24px" }}>
        {users.length} membre{users.length !== 1 ? "s" : ""} inscrits
      </p>

      <div style={{ background: "#1a1728", borderRadius: "14px", border: "1px solid #2a2540", overflow: "hidden" }}>
        {/* Table desktop */}
        <table className="users-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2540", background: "#13111e" }}>
              {["Nom", "Email", "Rôle", "Actifs", "Total", "Inscrit le"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#6b6475", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: "1px solid #1f1c2e" }}>
                <td style={{ padding: "12px 16px", color: "#e8e0d5", fontWeight: 600, fontSize: "14px" }}>{user.name}</td>
                <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "13px" }}>{user.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                    background: user.role === "ADMIN" ? "#c9a96e22" : "#1e1a38",
                    color: user.role === "ADMIN" ? "#c9a96e" : "#818cf8",
                  }}>{user.role}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#9b92a8", fontSize: "13px" }}>{user.loans.length}</td>
                <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "13px" }}>{user._count.loans}</td>
                <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "12px" }}>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Cards mobile */}
        <div className="users-cards">
          {users.map(user => (
            <div key={user.id} style={{ padding: "14px 16px", borderBottom: "1px solid #1f1c2e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 700, color: "#e8e0d5", fontSize: "14px" }}>{user.name}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
                  background: user.role === "ADMIN" ? "#c9a96e22" : "#1e1a38",
                  color: user.role === "ADMIN" ? "#c9a96e" : "#818cf8",
                }}>{user.role}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#6b6475" }}>{user.email}</div>
              <div style={{ fontSize: "11px", color: "#4a4258", marginTop: "4px" }}>
                {user.loans.length} actif(s) · {user._count.loans} total · Inscrit {formatDate(user.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .users-table { display: table; }
        .users-cards { display: none; }
        @media (max-width: 640px) {
          .users-table { display: none; }
          .users-cards { display: block; }
        }
      `}</style>
    </div>
  );
}
