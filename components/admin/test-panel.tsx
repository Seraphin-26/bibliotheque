// components/admin/test-panel.tsx
"use client";

import { useState, useTransition } from "react";
import { simulateNearDueLoan, triggerReminderEmails, simulateBookReturn } from "@/lib/actions/test";
import { useRouter } from "next/navigation";

type Log = { type: "success" | "error" | "info"; text: string; time: string };

export function TestPanel() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [bookId, setBookId] = useState("");
  const [hours, setHours] = useState(12);
  const [isPending, startTransition] = useTransition();

  function addLog(type: Log["type"], text: string) {
    const time = new Date().toLocaleTimeString("fr-FR");
    setLogs(prev => [{ type, text, time }, ...prev]);
  }

  function run(action: () => Promise<{ success: boolean; message?: string; error?: string }>) {
    startTransition(async () => {
      const res = await action();
      addLog(res.success ? "success" : "error", res.success ? res.message! : res.error!);
      router.refresh();
    });
  }

  const inputStyle: React.CSSProperties = {
    padding: "9px 12px",
    background: "#13111e",
    border: "1px solid #2a2540",
    borderRadius: "8px",
    color: "#e8e0d5",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Scénario 1 */}
      <div style={{ background: "#1a1728", borderRadius: "14px", padding: "18px", border: "1px solid #2a2540" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e0d5", marginBottom: "6px" }}>
          📧 Test — Email de rappel
        </h3>
        <p style={{ fontSize: "13px", color: "#6b6475", lineHeight: 1.6, marginBottom: "14px" }}>
          Étape 1 : crée un emprunt proche de l'échéance.<br />
          Étape 2 : déclenche l'envoi des emails.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "#9b92a8", flexShrink: 0 }}>Échéance dans</span>
            <select value={hours} onChange={e => setHours(Number(e.target.value))}
              style={{ ...inputStyle, width: "auto", flex: 1, minWidth: "120px" }}>
              <option value={1}>1 heure</option>
              <option value={12}>12 heures</option>
              <option value={24}>1 jour</option>
              <option value={48}>2 jours</option>
              <option value={72}>3 jours</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => run(() => simulateNearDueLoan(hours))} disabled={isPending}
              style={{ flex: 1, padding: "9px 14px", background: isPending ? "#2a2540" : "#c9a96e22", border: `1px solid ${isPending ? "#2a2540" : "#c9a96e"}`, borderRadius: "8px", color: isPending ? "#6b6475" : "#c9a96e", fontSize: "13px", fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer", fontFamily: "inherit", minWidth: "140px" }}>
              1. Créer l'emprunt
            </button>
            <button onClick={() => run(triggerReminderEmails)} disabled={isPending}
              style={{ flex: 1, padding: "9px 14px", background: isPending ? "#2a2540" : "#1e1a38", border: `1px solid ${isPending ? "#2a2540" : "#818cf8"}`, borderRadius: "8px", color: isPending ? "#6b6475" : "#818cf8", fontSize: "13px", fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer", fontFamily: "inherit", minWidth: "140px" }}>
              2. Envoyer les emails
            </button>
          </div>
        </div>
      </div>

      {/* Scénario 2 */}
      <div style={{ background: "#1a1728", borderRadius: "14px", padding: "18px", border: "1px solid #2a2540" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e0d5", marginBottom: "6px" }}>
          🔔 Test — Notification disponibilité
        </h3>
        <p style={{ fontSize: "13px", color: "#6b6475", lineHeight: 1.6, marginBottom: "14px" }}>
          Étape 1 : dans le catalogue, abonnez-vous à un livre emprunté.<br />
          Étape 2 : simulez le retour ici pour déclencher l'email.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input value={bookId} onChange={e => setBookId(e.target.value)}
            placeholder="ID du livre (Prisma Studio → table books)"
            style={inputStyle} />
          <button onClick={() => { if (!bookId.trim()) { addLog("error", "Entrez un Book ID."); return; } run(() => simulateBookReturn(bookId.trim())); }} disabled={isPending}
            style={{ padding: "9px 14px", background: isPending ? "#2a2540" : "#14532d", border: `1px solid ${isPending ? "#2a2540" : "#4ade80"}`, borderRadius: "8px", color: isPending ? "#6b6475" : "#4ade80", fontSize: "13px", fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            Simuler le retour → notifier
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#4a4258", marginTop: "8px" }}>
          💡 Trouve l'ID via <code style={{ background: "#0f1117", padding: "1px 5px", borderRadius: "4px" }}>npm run db:studio</code>
        </p>
      </div>

      {/* Console */}
      {logs.length > 0 && (
        <div style={{ background: "#0f1117", borderRadius: "14px", padding: "16px", border: "1px solid #2a2540" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#6b6475", textTransform: "uppercase", letterSpacing: ".5px", margin: 0 }}>Console</h3>
            <button onClick={() => setLogs([])} style={{ fontSize: "11px", color: "#4a4258", background: "none", border: "none", cursor: "pointer" }}>Effacer</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
            {logs.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", fontSize: "12px", flexWrap: "wrap" }}>
                <span style={{ color: "#4a4258", flexShrink: 0 }}>[{log.time}]</span>
                <span style={{ color: log.type === "success" ? "#4ade80" : log.type === "error" ? "#f87171" : "#9b92a8", flex: 1 }}>
                  {log.type === "success" ? "✅" : log.type === "error" ? "❌" : "ℹ️"} {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
