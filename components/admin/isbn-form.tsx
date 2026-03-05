// components/admin/isbn-form.tsx
"use client";

import { useState, useTransition } from "react";
import { fetchBookByISBN, searchBooksByTitle, saveBookFromISBN, BookPreview } from "@/lib/actions/books";
import { useRouter } from "next/navigation";

type SearchMode = "isbn" | "title";

export function ISBNForm() {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("title");
  const [query, setQuery] = useState("");
  const [copies, setCopies] = useState(1);
  const [results, setResults] = useState<BookPreview[]>([]);
  const [selected, setSelected] = useState<BookPreview | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [isSaving, startSave] = useTransition();

  function handleSearch() {
    if (!query.trim()) return;
    setError("");
    setResults([]);
    setSelected(null);

    startSearch(async () => {
      const res = mode === "isbn"
        ? await fetchBookByISBN(query)
        : await searchBooksByTitle(query);

      if (res.success) {
        setResults(res.books);
        if (res.books.length === 1) setSelected(res.books[0]);
      } else {
        setError(res.error);
      }
    });
  }

  function handleSave() {
    if (!selected) return;
    startSave(async () => {
      const res = await saveBookFromISBN(selected, copies);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => router.push("/admin/books"), 1500);
      } else {
        setError(res.error);
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    padding: "11px 16px",
    background: "#13111e",
    border: "1px solid #2a2540",
    borderRadius: "10px",
    color: "#e8e0d5",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div>
      {/* Mode switcher */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {(["title", "isbn"] as SearchMode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setQuery(""); setResults([]); setSelected(null); setError(""); }}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
              fontWeight: mode === m ? 700 : 400,
              background: mode === m ? "#c9a96e" : "#1a1728",
              color: mode === m ? "#0f1117" : "#9b92a8",
              border: `1px solid ${mode === m ? "#c9a96e" : "#2a2540"}`,
            }}>
            {m === "title" ? "🔤 Titre / Auteur" : "🔢 ISBN"}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder={mode === "isbn" ? "Ex : 978-0-13-235088-4" : "Ex : Clean Code, Robert Martin..."}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={handleSearch} disabled={isSearching || !query.trim()}
          style={{
            padding: "11px 24px",
            background: isSearching ? "#2a2540" : "#c9a96e",
            color: isSearching ? "#6b6475" : "#0f1117",
            border: "none", borderRadius: "10px",
            cursor: isSearching ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: "14px", fontFamily: "inherit", whiteSpace: "nowrap",
          }}>
          {isSearching ? "Recherche..." : "🔍 Rechercher"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", background: "#450a0a", borderRadius: "10px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
          ❌ {error}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "#14532d", borderRadius: "10px", color: "#4ade80", fontSize: "13px", marginBottom: "16px" }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Results list (when multiple) */}
      {results.length > 1 && !selected && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b6475", marginBottom: "12px" }}>
            {results.length} résultats — cliquez sur un livre pour le sélectionner
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
            {results.map((book, i) => (
              <div key={i} onClick={() => setSelected(book)}
                style={{
                  display: "flex", gap: "14px", alignItems: "center",
                  padding: "12px 16px", background: "#13111e",
                  borderRadius: "10px", border: "1px solid #2a2540",
                  cursor: "pointer", transition: "border-color .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2540")}
              >
                {book.coverUrl
                  ? <img src={book.coverUrl} alt={book.title} style={{ width: "36px", height: "52px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                  : <div style={{ width: "36px", height: "52px", background: "#2a2540", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📗</div>
                }
                <div>
                  <div style={{ fontWeight: 600, color: "#e8e0d5", fontSize: "14px" }}>{book.title}</div>
                  <div style={{ color: "#6b6475", fontSize: "12px" }}>{book.author} {book.publishedAt ? `· ${book.publishedAt.slice(0, 4)}` : ""}</div>
                  {book.isbn && <div style={{ color: "#4a4258", fontSize: "11px", marginTop: "2px" }}>ISBN : {book.isbn}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected preview */}
      {selected && (
        <div style={{ background: "#1a1728", borderRadius: "14px", padding: "24px", border: "1px solid #c9a96e55" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", color: "#c9a96e", textTransform: "uppercase", letterSpacing: "1px" }}>
              Aperçu sélectionné
            </span>
            {results.length > 1 && (
              <button onClick={() => setSelected(null)}
                style={{ fontSize: "12px", color: "#6b6475", background: "transparent", border: "none", cursor: "pointer" }}>
                ← Retour aux résultats
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {selected.coverUrl
              ? <img src={selected.coverUrl} alt={selected.title} style={{ width: "90px", height: "130px", objectFit: "cover", borderRadius: "8px", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,0,0,.4)" }} />
              : <div style={{ width: "90px", height: "130px", background: "#2a2540", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>📗</div>
            }
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#e8e0d5", marginBottom: "8px", lineHeight: 1.3 }}>{selected.title}</h2>
              <p style={{ color: "#9b92a8", fontSize: "14px", marginBottom: "4px" }}>{selected.author}</p>
              <p style={{ color: "#6b6475", fontSize: "13px" }}>
                {selected.publisher}{selected.publisher && selected.publishedAt ? " · " : ""}{selected.publishedAt}
              </p>
              {selected.isbn && <p style={{ color: "#4a4258", fontSize: "12px", marginTop: "4px" }}>ISBN : {selected.isbn}</p>}
            </div>
          </div>

          {selected.description && (
            <p style={{ color: "#9b92a8", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px", padding: "14px", background: "#13111e", borderRadius: "8px" }}>
              {selected.description.length > 400 ? selected.description.slice(0, 400) + "..." : selected.description}
            </p>
          )}

          {/* Copies */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", color: "#9b92a8" }}>Nombre de copies :</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => setCopies(c => Math.max(1, c - 1))} style={{ width: "28px", height: "28px", background: "#2a2540", border: "none", borderRadius: "6px", color: "#e8e0d5", cursor: "pointer", fontSize: "16px" }}>−</button>
              <span style={{ minWidth: "24px", textAlign: "center", fontWeight: 700, color: "#e8e0d5" }}>{copies}</span>
              <button onClick={() => setCopies(c => c + 1)} style={{ width: "28px", height: "28px", background: "#2a2540", border: "none", borderRadius: "6px", color: "#e8e0d5", cursor: "pointer", fontSize: "16px" }}>+</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleSave} disabled={isSaving} style={{
              padding: "11px 24px",
              background: isSaving ? "#2a2540" : "#c9a96e",
              color: isSaving ? "#6b6475" : "#0f1117",
              border: "none", borderRadius: "10px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "14px", fontFamily: "inherit",
            }}>
              {isSaving ? "Sauvegarde..." : "✓ Ajouter au catalogue"}
            </button>
            <button onClick={() => { setSelected(null); setResults([]); setQuery(""); }} style={{
              padding: "11px 18px", background: "transparent",
              border: "1px solid #2a2540", borderRadius: "10px",
              color: "#6b6475", cursor: "pointer", fontFamily: "inherit",
            }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
