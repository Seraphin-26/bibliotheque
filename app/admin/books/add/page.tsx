// app/admin/books/add/page.tsx
import { ISBNForm } from "@/components/admin/isbn-form";

export default function AddBookPage() {
  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8c87a", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
        Ajouter un livre via ISBN
      </h1>
      <p style={{ color: "#6b6475", fontSize: "14px", marginBottom: "32px" }}>
        Connecté à l'API Google Books — les informations sont récupérées automatiquement.
      </p>
      <ISBNForm />
    </div>
  );
}
