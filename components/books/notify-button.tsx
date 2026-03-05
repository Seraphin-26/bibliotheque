// components/books/notify-button.tsx
"use client";

import { useState, useTransition } from "react";
import { subscribeNotification, unsubscribeNotification } from "@/lib/actions/notifications";

export function NotifyButton({
  bookId,
  bookTitle,
  isSubscribed,
}: {
  bookId: string;
  bookTitle: string;
  isSubscribed: boolean;
}) {
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  function handleToggle() {
    startTransition(async () => {
      const res = subscribed
        ? await unsubscribeNotification(bookId)
        : await subscribeNotification(bookId);

      if (res.success) {
        setSubscribed(!subscribed);
        setMsg(res.message);
        setTimeout(() => setMsg(""), 3000);
      } else {
        setMsg(res.error);
        setTimeout(() => setMsg(""), 3000);
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={subscribed ? "Annuler la notification" : `M'avertir quand "${bookTitle}" est disponible`}
        style={{
          width: "100%",
          padding: "10px",
          background: subscribed ? "#1e1a38" : "transparent",
          border: `1px solid ${subscribed ? "#818cf8" : "#3a3555"}`,
          borderRadius: "10px",
          color: subscribed ? "#818cf8" : "#6b6475",
          fontSize: "13px",
          cursor: isPending ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          fontWeight: subscribed ? 600 : 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all .15s",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {subscribed ? "🔔 Notifié — Annuler" : "🔕 M'avertir quand disponible"}
      </button>
      {msg && (
        <p style={{ fontSize: "11px", color: "#9b92a8", marginTop: "6px", textAlign: "center" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
