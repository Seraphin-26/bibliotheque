// app/catalogue/page.tsx
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-helpers";
import { BookGrid } from "@/components/books/book-grid";

export default async function CataloguePage() {
  const session = await getRequiredSession();
  const userId = (session.user as any).id;

  const books = await prisma.book.findMany({
    include: {
      loans: { where: { status: { in: ["ACTIVE", "OVERDUE"] } } },
      notifications: { where: { userId } },
    },
    orderBy: { createdAt: "desc" },
  });

  const booksWithStatus = books.map(book => ({
    ...book,
    availableCopies: book.totalCopies - book.loans.length,
    isAvailable: book.loans.length < book.totalCopies,
    isSubscribed: book.notifications.length > 0,
  }));

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8c87a", marginBottom: "6px", fontFamily: "Georgia, serif" }}>
          Catalogue
        </h1>
        <p style={{ color: "#6b6475", fontSize: "14px" }}>
          {books.length} ouvrages · {booksWithStatus.filter(b => b.isAvailable).length} disponibles
        </p>
      </div>
      <BookGrid books={booksWithStatus} />
    </div>
  );
}
