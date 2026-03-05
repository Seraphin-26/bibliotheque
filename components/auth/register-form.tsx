// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await registerUser(new FormData(e.currentTarget));

    if (result.success) {
      setMessage({ type: "success", text: result.message! });
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage({ type: "error", text: result.error! });
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "#13111e",
    border: "1px solid #2a2540",
    borderRadius: "10px",
    color: "#e8e0d5",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={{ display: "block", fontSize: "13px", color: "#9b92a8", marginBottom: "6px" }}>Nom complet</label>
        <input name="name" required placeholder="Alice Martin" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", fontSize: "13px", color: "#9b92a8", marginBottom: "6px" }}>Email</label>
        <input name="email" type="email" required placeholder="vous@example.com" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", fontSize: "13px", color: "#9b92a8", marginBottom: "6px" }}>Mot de passe</label>
        <input name="password" type="password" required placeholder="Minimum 6 caractères" style={inputStyle} />
      </div>

      {message && (
        <div style={{
          padding: "10px 14px",
          background: message.type === "success" ? "#14532d" : "#450a0a",
          borderRadius: "8px",
          color: message.type === "success" ? "#4ade80" : "#f87171",
          fontSize: "13px",
        }}>
          {message.text}
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        padding: "12px",
        background: loading ? "#2a2540" : "#c9a96e",
        color: loading ? "#6b6475" : "#0f1117",
        border: "none",
        borderRadius: "10px",
        fontWeight: "700",
        fontSize: "15px",
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
      }}>
        {loading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
