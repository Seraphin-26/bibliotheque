// components/admin/test-panel.tsx
"use client";

import { useState, useTransition } from "react";
import {
  simulateNearDueLoan,
  triggerReminderEmails,
  simulateBookReturn,
} from "@/lib/actions/test";
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
    padding: "8px 12px",
    background: "#13111e",
    border: "1px solid #2a2540",
    borderRadius: "8px",
    color: "#e8e0d5",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
  };

  const btnStyle = (color = "#c9a96e"): React.CSSProperties => ({
    padding: "9px 18px",
    background: isPending ? "#2a2540" : color === "#c9a96e" ? "#c9a96e22" : "#1e1a38",
    border: `1px solid ${isPending ? "#2a2540" : color}`,
    borderRadius: "8px",
    color: isPending ? "#6b6475" : color,
    fontSize: "13px",
    fontWeight: 600,
    cursor: isPending ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Scénario 1 : Email de rappel */}
      <div style={{ background: "#1a1728", borderRadius: "14px", padding: "20px", border: "1px solid #2a2540" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e0d5", marginBottom: "6px" }}>
              📧 Test — Email de rappel d'échéance
            </h3>
            <p style={{ fontSize: "13px", color: "#6b6475", lineHeight: 1.6 }}>
              Étape 1 : crée un emprunt proche de l'échéance.<br />
              Étape 2 : déclenche l'envoi des emails.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#9b92a8" }}>Échéance dans</span>
          <select
            value={hours}
            onChange={e => setHours(Number(e.target.value))}
            style={{ ...inputStyle, width: "120px" }}
          >
            <option value={1}>1 heure</option>
            <option value={12}>12 heures</option>
            <option value={24}>1 jour</option>
            <option value={48}>2 jours</option>
            <option value={72}>3 jours</option>
          </select>
          <button
            onClick={() => run(() => simulateNearDueLoan(hours))}
            disabled={isPending}
            style={btnStyle("#c9a96e")}
          >
            1. Créer l'emprunt de test
          </button>
          <button
            onClick={() => run(triggerReminderEmails)}
            disabled={isPending}
            style={btnStyle("#818cf8")}
          >
            2. Envoyer les emails maintenant
          </button>
        </div>
      </div>

      {/* Scénario 2 : Notification disponibilité */}
      <div style={{ background: "#1a1728", borderRadius: "14px", padding: "20px", border: "1px solid #2a2540" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e0d5", marginBottom: "6px" }}>
          🔔 Test — Notification "Livre disponible"
        </h3>
        <p style={{ fontSize: "13px", color: "#6b6475", lineHeight: 1.6, marginBottom: "16px" }}>
          Étape 1 : dans le catalogue, clique sur un livre emprunté → "M'avertir quand disponible".<br />
          Étape 2 : simule le retour du livre ici pour déclencher l'email.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={bookId}
            onChange={e => setBookId(e.target.value)}
            placeholder="ID du livre (dans l'URL ou la BDD)"
            style={{ ...inputStyle, flex: 1, minWidth: "220px" }}
          />
          <button
            onClick={() => {
              if (!bookId.trim()) { addLog("error", "Entrez un Book ID."); return; }
              run(() => simulateBookReturn(bookId.trim()));
            }}
            disabled={isPending}
            style={btnStyle("#4ade80")}
          >
            Simuler le retour → notifier
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#4a4258", marginTop: "8px" }}>
          💡 Trouve l'ID dans Admin → Livres → URL de la page ou via Prisma Studio (<code style={{ background: "#0f1117", padding: "1px 5px", borderRadius: "4px" }}>npm run db:studio</code>)
        </p>
      </div>

      {/* Console de logs */}
      {logs.length > 0 && (
        <div style={{ background: "#0f1117", borderRadius: "14px", padding: "16px", border: "1px solid #2a2540" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#6b6475", textTransform: "uppercase", letterSpacing: ".5px", margin: 0 }}>
              Console
            </h3>
            <button onClick={() => setLogs([])} style={{ fontSize: "11px", color: "#4a4258", background: "none", border: "none", cursor: "pointer" }}>
              Effacer
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
            {logs.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px" }}>
                <span style={{ color: "#4a4258", flexShrink: 0 }}>[{log.time}]</span>
                <span style={{
                  color: log.type === "success" ? "#4ade80" : log.type === "error" ? "#f87171" : "#9b92a8",
                }}>
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
