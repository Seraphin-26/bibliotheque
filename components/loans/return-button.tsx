// components/loans/return-button.tsx
"use client";

import { useTransition, useState } from "react";
import { returnBook } from "@/lib/actions/loans";

export function ReturnButton({ loanId }: { loanId: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleReturn() {
    if (!confirm("Confirmer le retour de ce livre ?")) return;
    startTransition(async () => {
      const res = await returnBook(loanId);
      if (res.success) setDone(true);
    });
  }

  if (done) return <span style={{ fontSize: "12px", color: "#4ade80" }}>✓ Retourné</span>;

  return (
    <button
      onClick={handleReturn}
      disabled={isPending}
      style={{
        padding: "7px 14px",
        background: isPending ? "#2a2540" : "transparent",
        border: "1px solid #3a3555",
        borderRadius: "8px",
        color: isPending ? "#6b6475" : "#9b92a8",
        fontSize: "12px",
        cursor: isPending ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {isPending ? "..." : "Retourner"}
    </button>
  );
}
