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
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8c87a", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
        Utilisateurs
      </h1>
      <p style={{ color: "#6b6475", fontSize: "14px", marginBottom: "28px" }}>{users.length} membre{users.length !== 1 ? "s" : ""} inscrits</p>

      <div style={{ background: "#1a1728", borderRadius: "14px", border: "1px solid #2a2540", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2540", background: "#13111e" }}>
              {["Nom", "Email", "Rôle", "Emprunts actifs", "Total emprunts", "Inscrit le"].map(h => (
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
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: user.role === "ADMIN" ? "#c9a96e22" : "#1e1a38",
                    color: user.role === "ADMIN" ? "#c9a96e" : "#818cf8",
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#9b92a8", fontSize: "13px" }}>{user.loans.length}</td>
                <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "13px" }}>{user._count.loans}</td>
                <td style={{ padding: "12px 16px", color: "#6b6475", fontSize: "12px" }}>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
