// components/books/book-grid.tsx
"use client";

import { useState, useMemo } from "react";
import { BookCard } from "@/components/books/book-card";

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

export function BookGrid({ books }: { books: Book[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    ), [books, search]);

  return (
    <div>
      {/* Search bar uniquement */}
      <div style={{ position: "relative", maxWidth: "440px", marginBottom: "28px" }}>
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b6475" }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par titre ou auteur..."
          style={{
            width: "100%",
            padding: "10px 14px 10px 40px",
            background: "#1a1728",
            border: "1px solid #2a2540",
            borderRadius: "10px",
            color: "#e8e0d5",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {search && (
        <p style={{ color: "#6b6475", fontSize: "13px", marginBottom: "16px" }}>
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour "{search}"
        </p>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b6475" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p>Aucun livre trouvé.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
        }}>
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
