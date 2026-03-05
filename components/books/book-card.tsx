// components/books/book-card.tsx
"use client";

import { useState, useTransition } from "react";
import { borrowBook } from "@/lib/actions/loans";
import { BookCover } from "@/components/books/book-cover";
import { NotifyButton } from "@/components/books/notify-button";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  isbn: string | null;
  totalCopies: number;
  isAvailable: boolean;
  availableCopies: number;
  isSubscribed: boolean;
};

const DURATION_OPTIONS = [
  { days: 7,  label: "7 jours" },
  { days: 14, label: "14 jours" },
  { days: 30, label: "30 jours" },
];

export function BookCard({ book }: { book: Book }) {
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(14);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleBorrow() {
    startTransition(async () => {
      const res = await borrowBook(book.id, duration);
      if (res.success) {
        setResult({ type: "success", text: res.message });
        setTimeout(() => { setShowModal(false); setResult(null); }, 2500);
      } else {
        setResult({ type: "error", text: res.error });
      }
    });
  }

  function handleClose() {
    setShowModal(false);
    setResult(null);
    setDuration(14);
  }

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: "#1a1728", borderRadius: "12px", overflow: "hidden",
          cursor: "pointer", border: "1px solid #2a2540",
          transition: "transform .15s, border-color .15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLElement).style.borderColor = "#c9a96e";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.borderColor = "#2a2540";
        }}
      >
        <div style={{ height: "200px", background: "#2a2540", position: "relative", overflow: "hidden" }}>
          <BookCover src={book.coverUrl} alt={book.title} width={180} height={200} style={{ width: "100%", height: "100%", borderRadius: 0 }} />
          <div style={{ position: "absolute", top: "8px", right: "8px" }}>
            <span style={{
              padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
              background: book.isAvailable ? "#14532d" : "#450a0a",
              color: book.isAvailable ? "#4ade80" : "#f87171",
            }}>
              {book.isAvailable ? "Disponible" : "Emprunté"}
            </span>
          </div>
          {/* Icône cloche si abonné aux notifs */}
          {!book.isAvailable && book.isSubscribed && (
            <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "14px" }} title="Vous serez notifié">🔔</div>
          )}
        </div>
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8e0d5", marginBottom: "4px", lineHeight: 1.3 }}>{book.title}</div>
          <div style={{ fontSize: "11px", color: "#6b6475" }}>{book.author}</div>
          <div style={{ marginTop: "8px", fontSize: "11px", color: "#9b92a8" }}>
            {book.availableCopies}/{book.totalCopies} disponible{book.totalCopies > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={handleClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "20px",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1a1728", borderRadius: "16px", padding: "28px",
            maxWidth: "440px", width: "100%", border: "1px solid #2a2540",
          }}>
            {/* Book info */}
            <div style={{ display: "flex", gap: "18px", marginBottom: "20px" }}>
              <BookCover src={book.coverUrl} alt={book.title} width={80} height={115} />
              <div>
                <span style={{
                  padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
                  background: book.isAvailable ? "#14532d" : "#450a0a",
                  color: book.isAvailable ? "#4ade80" : "#f87171",
                }}>
                  {book.isAvailable
                    ? `${book.availableCopies} copie${book.availableCopies > 1 ? "s" : ""} disponible${book.availableCopies > 1 ? "s" : ""}`
                    : "Toutes les copies empruntées"}
                </span>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e8e0d5", marginTop: "10px", marginBottom: "6px", lineHeight: 1.3 }}>
                  {book.title}
                </h2>
                <p style={{ fontSize: "13px", color: "#9b92a8" }}>{book.author}</p>
              </div>
            </div>

            {/* Si disponible : sélecteur de durée */}
            {book.isAvailable && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#6b6475", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "10px" }}>
                  Durée d'emprunt
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {DURATION_OPTIONS.map(opt => (
                    <button key={opt.days} onClick={() => setDuration(opt.days)} style={{
                      flex: 1, padding: "9px 0", borderRadius: "8px",
                      border: `1px solid ${duration === opt.days ? "#c9a96e" : "#2a2540"}`,
                      background: duration === opt.days ? "#c9a96e22" : "transparent",
                      color: duration === opt.days ? "#c9a96e" : "#9b92a8",
                      fontWeight: duration === opt.days ? 700 : 400,
                      fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "#4a4258", marginTop: "8px" }}>
                  📅 Retour prévu le {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + duration);
                    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
                  })()}
                </p>
              </div>
            )}

            {/* Si indisponible : bouton notification */}
            {!book.isAvailable && (
              <div style={{ marginBottom: "20px" }}>
                <NotifyButton
                  bookId={book.id}
                  bookTitle={book.title}
                  isSubscribed={book.isSubscribed}
                />
              </div>
            )}

            {/* Résultat */}
            {result && (
              <div style={{
                padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
                background: result.type === "success" ? "#14532d" : "#450a0a",
                color: result.type === "success" ? "#4ade80" : "#f87171",
                lineHeight: 1.5,
              }}>
                {result.type === "success" ? "✅ " : "❌ "}{result.text}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              {book.isAvailable && (
                <button onClick={handleBorrow} disabled={isPending} style={{
                  flex: 1, padding: "11px",
                  background: !isPending ? "#c9a96e" : "#2a2540",
                  color: !isPending ? "#0f1117" : "#6b6475",
                  border: "none", borderRadius: "10px",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "14px", fontFamily: "inherit",
                }}>
                  {isPending ? "En cours..." : `📖 Emprunter (${duration}j)`}
                </button>
              )}
              <button onClick={handleClose} style={{
                flex: book.isAvailable ? 0 : 1,
                padding: "11px 16px", background: "transparent",
                border: "1px solid #2a2540", borderRadius: "10px",
                color: "#6b6475", cursor: "pointer", fontFamily: "inherit",
              }}>
                {book.isAvailable ? "✕" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
