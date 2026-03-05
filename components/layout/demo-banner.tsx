// components/layout/demo-banner.tsx
"use client";

import { useState } from "react";

export function DemoBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #1a1728, #2a2540, #1a1728)",
      borderBottom: "1px solid #c9a96e44",
      padding: "8px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", flex: 1 }}>
          <span style={{
            padding: "2px 10px", background: "#c9a96e22", border: "1px solid #c9a96e",
            borderRadius: "20px", fontSize: "10px", fontWeight: 700, color: "#c9a96e",
            letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0,
          }}>🎓 Demo</span>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "11px", color: "#6b6475" }}>Admin :</span>
              <code onClick={() => navigator.clipboard?.writeText("admin@library.com")}
                style={{ fontSize: "11px", background: "#13111e", border: "1px solid #2a2540", borderRadius: "4px", padding: "1px 5px", color: "#c9a96e", cursor: "pointer" }}
                title="Copier">admin@library.com</code>
              <code onClick={() => navigator.clipboard?.writeText("admin123")}
                style={{ fontSize: "11px", background: "#13111e", border: "1px solid #2a2540", borderRadius: "4px", padding: "1px 5px", color: "#9b92a8", cursor: "pointer" }}
                title="Copier">admin123</code>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "11px", color: "#6b6475" }}>Membre :</span>
              <code onClick={() => navigator.clipboard?.writeText("user@library.com")}
                style={{ fontSize: "11px", background: "#13111e", border: "1px solid #2a2540", borderRadius: "4px", padding: "1px 5px", color: "#818cf8", cursor: "pointer" }}
                title="Copier">user@library.com</code>
              <code onClick={() => navigator.clipboard?.writeText("user123")}
                style={{ fontSize: "11px", background: "#13111e", border: "1px solid #2a2540", borderRadius: "4px", padding: "1px 5px", color: "#9b92a8", cursor: "pointer" }}
                title="Copier">user123</code>
            </div>
          </div>
        </div>
        <button onClick={() => setVisible(false)} style={{ background: "transparent", border: "none", color: "#4a4258", cursor: "pointer", fontSize: "16px", padding: "0 4px", flexShrink: 0 }}>✕</button>
      </div>
    </div>
  );
}
