// components/admin/delete-book-button.tsx
"use client";

import { useTransition } from "react";
import { deleteBook } from "@/lib/actions/books";

export function DeleteBookButton({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer "${bookTitle}" ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      await deleteBook(bookId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        padding: "5px 12px",
        background: "transparent",
        border: "1px solid #450a0a",
        borderRadius: "6px",
        color: "#f87171",
        fontSize: "12px",
        cursor: isPending ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {isPending ? "..." : "Supprimer"}
    </button>
  );
}
