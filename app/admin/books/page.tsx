// app/admin/books/page.tsx
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { DeleteBookButton } from "@/components/admin/delete-book-button";
import { BookCover } from "@/components/books/book-cover";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    include: {
      _count: { select: { loans: true } },
      loans: { where: { status: "ACTIVE" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, color: "#e8c87a", fontFamily: "Georgia, serif", margin: 0 }}>Gestion des livres</h1>
          <p style={{ color: "#6b6475", fontSize: "14px", marginTop: "4px" }}>{books.length} ouvrages</p>
        </div>
        <Link href="/admin/books/add" style={{
          padding: "9px 18px", background: "#c9a96e", color: "#0f1117",
          borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "13px", flexShrink: 0,
        }}>
          + Ajouter
        </Link>
      </div>

      <div style={{ background: "#1a1728", borderRadius: "14px", border: "1px solid #2a2540", overflow: "hidden" }}>
        {/* Table desktop */}
        <table className="books-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2540", background: "#13111e" }}>
              {["", "Titre & Auteur", "ISBN", "Copies", "Dispo", "Ajouté", ""].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "12px 16px", color: "#6b6475", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: "1px solid #1f1c2e" }}>
                <td style={{ padding: "10px 16px" }}>
                  <BookCover src={book.coverUrl} alt={book.title} width={36} height={50} style={{ borderRadius: "4px" }} />
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ fontWeight: 600, color: "#e8e0d5", fontSize: "14px" }}>{book.title}</div>
                  <div style={{ color: "#6b6475", fontSize: "12px" }}>{book.author}</div>
                </td>
                <td style={{ padding: "10px 16px", color: "#6b6475", fontSize: "12px" }}>{book.isbn ?? "—"}</td>
                <td style={{ padding: "10px 16px", color: "#9b92a8", fontSize: "13px" }}>{book.totalCopies}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{
                    padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                    background: book.loans.length > 0 ? "#1e1a38" : "#1c3a2a",
                    color: book.loans.length > 0 ? "#818cf8" : "#4ade80",
                  }}>
                    {book.loans.length}/{book.totalCopies}
                  </span>
                </td>
                <td style={{ padding: "10px 16px", color: "#6b6475", fontSize: "12px" }}>{formatDate(book.createdAt)}</td>
                <td style={{ padding: "10px 16px" }}>
                  <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Cards mobile */}
        <div className="books-cards">
          {books.map(book => (
            <div key={book.id} style={{ padding: "14px 16px", borderBottom: "1px solid #1f1c2e", display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <BookCover src={book.coverUrl} alt={book.title} width={40} height={56} style={{ borderRadius: "4px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ fontWeight: 700, color: "#e8e0d5", fontSize: "13px", lineHeight: 1.3 }}>{book.title}</div>
                  <span style={{
                    padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, flexShrink: 0,
                    background: book.loans.length > 0 ? "#1e1a38" : "#1c3a2a",
                    color: book.loans.length > 0 ? "#818cf8" : "#4ade80",
                  }}>
                    {book.loans.length}/{book.totalCopies}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#6b6475", marginTop: "2px" }}>{book.author}</div>
                {book.isbn && <div style={{ fontSize: "11px", color: "#4a4258", marginTop: "2px" }}>{book.isbn}</div>}
              </div>
              <DeleteBookButton bookId={book.id} bookTitle={book.title} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .books-table { display: table; }
        .books-cards { display: none; }
        @media (max-width: 640px) {
          .books-table { display: none; }
          .books-cards { display: block; }
        }
      `}</style>
    </div>
  );
}
