// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/catalogue");
      router.refresh();
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
    transition: "border-color .15s",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={{ display: "block", fontSize: "13px", color: "#9b92a8", marginBottom: "6px" }}>
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="vous@example.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = "#c9a96e")}
          onBlur={e => (e.target.style.borderColor = "#2a2540")}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "13px", color: "#9b92a8", marginBottom: "6px" }}>
          Mot de passe
        </label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = "#c9a96e")}
          onBlur={e => (e.target.style.borderColor = "#2a2540")}
        />
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "#450a0a", borderRadius: "8px", color: "#f87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px",
          background: loading ? "#2a2540" : "#c9a96e",
          color: loading ? "#6b6475" : "#0f1117",
          border: "none",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "15px",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transition: "background .15s",
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
