// lib/actions/books.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type BookPreview = {
  isbn: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  publisher: string;
  publishedAt: string;
};

type ActionResult =
  | { success: true; message: string; data?: any }
  | { success: false; error: string };

// ── Helper : parser un volume Google Books ────────────────────────────────────
function parseVolume(item: any, fallbackIsbn = ""): BookPreview {
  const v = item.volumeInfo;
  const isbn13 = v.industryIdentifiers?.find((i: any) => i.type === "ISBN_13")?.identifier;
  const isbn10 = v.industryIdentifiers?.find((i: any) => i.type === "ISBN_10")?.identifier;
  return {
    isbn: isbn13 ?? isbn10 ?? fallbackIsbn,
    title: v.title ?? "Titre inconnu",
    author: v.authors?.join(", ") ?? "Auteur inconnu",
    description: v.description ?? "",
    coverUrl:
      v.imageLinks?.extraLarge ??
      v.imageLinks?.large ??
      v.imageLinks?.thumbnail?.replace("http://", "https://") ?? "",
    publisher: v.publisher ?? "",
    publishedAt: v.publishedDate ?? "",
  };
}

// ── Recherche par ISBN ────────────────────────────────────────────────────────
export async function fetchBookByISBN(
  isbn: string
): Promise<{ success: true; books: BookPreview[] } | { success: false; error: string }> {
  const clean = isbn.replace(/[-\s]/g, "");
  if (clean.length < 10) return { success: false, error: "ISBN invalide." };

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey
      ? `https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}&key=${apiKey}`
      : `https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { success: false, error: "Erreur API Google Books." };

    const data = await res.json();
    if (!data.items?.length) return { success: false, error: "Aucun livre trouvé pour cet ISBN." };

    return { success: true, books: data.items.map((item: any) => parseVolume(item, clean)) };
  } catch {
    return { success: false, error: "Impossible de joindre l'API Google Books." };
  }
}

// ── Recherche par titre ou auteur ─────────────────────────────────────────────
export async function searchBooksByTitle(
  query: string
): Promise<{ success: true; books: BookPreview[] } | { success: false; error: string }> {
  if (query.trim().length < 2) return { success: false, error: "Tapez au moins 2 caractères." };

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const encoded = encodeURIComponent(query.trim());
    const url = apiKey
      ? `https://www.googleapis.com/books/v1/volumes?q=${encoded}&maxResults=10&key=${apiKey}`
      : `https://www.googleapis.com/books/v1/volumes?q=${encoded}&maxResults=10`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { success: false, error: "Erreur API Google Books." };

    const data = await res.json();
    if (!data.items?.length) return { success: false, error: "Aucun résultat trouvé." };

    return { success: true, books: data.items.map((item: any) => parseVolume(item)) };
  } catch {
    return { success: false, error: "Impossible de joindre l'API Google Books." };
  }
}

// ── Sauvegarder un livre ──────────────────────────────────────────────────────
export async function saveBookFromISBN(
  book: BookPreview,
  totalCopies: number = 1
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Accès réservé aux administrateurs." };
  }

  try {
    if (book.isbn) {
      const existing = await prisma.book.findUnique({ where: { isbn: book.isbn } });
      if (existing) return { success: false, error: "Ce livre existe déjà dans la bibliothèque." };
    }

    const created = await prisma.book.create({
      data: {
        isbn: book.isbn || null,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        publisher: book.publisher,
        publishedAt: book.publishedAt ? new Date(book.publishedAt) : null,
        totalCopies,
      },
    });

    revalidatePath("/catalogue");
    revalidatePath("/admin/books");

    return { success: true, message: `"${book.title}" ajouté au catalogue.`, data: created };
  } catch (error) {
    console.error("[saveBookFromISBN]", error);
    return { success: false, error: "Erreur lors de la sauvegarde." };
  }
}

// ── Supprimer un livre ────────────────────────────────────────────────────────
export async function deleteBook(bookId: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Accès refusé." };
  }

  try {
    await prisma.book.delete({ where: { id: bookId } });
    revalidatePath("/catalogue");
    revalidatePath("/admin/books");
    return { success: true, message: "Livre supprimé." };
  } catch {
    return { success: false, error: "Impossible de supprimer ce livre." };
  }
}
