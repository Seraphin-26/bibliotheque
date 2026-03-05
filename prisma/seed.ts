// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@library.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@library.com" },
    update: {},
    create: {
      name: "Alice Martin",
      email: "user@library.com",
      password: userPassword,
      role: "USER",
    },
  });

  const books = await Promise.all([
    prisma.book.upsert({
      where: { isbn: "9780132350884" },
      update: {},
      create: {
        isbn: "9780132350884",
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg",
        publisher: "Prentice Hall",
        publishedAt: new Date("2008-08-01"),
        totalCopies: 2,
      },
    }),
    prisma.book.upsert({
      where: { isbn: "9782070612758" },
      update: {},
      create: {
        isbn: "9782070612758",
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        description: "Un conte poétique et philosophique.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9782070612758-M.jpg",
        publisher: "Gallimard",
        publishedAt: new Date("1943-04-06"),
        totalCopies: 3,
      },
    }),
    prisma.book.upsert({
      where: { isbn: "9782266320481" },
      update: {},
      create: {
        isbn: "9782266320481",
        title: "Dune",
        author: "Frank Herbert",
        description: "Le roman de science-fiction le plus vendu de tous les temps.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9782266320481-M.jpg",
        publisher: "Pocket",
        publishedAt: new Date("1965-08-01"),
        totalCopies: 2,
      },
    }),
    prisma.book.upsert({
      where: { isbn: "9782070368228" },
      update: {},
      create: {
        isbn: "9782070368228",
        title: "1984",
        author: "George Orwell",
        description: "Roman dystopique décrivant une société totalitaire.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9782070368228-M.jpg",
        publisher: "Gallimard",
        publishedAt: new Date("1949-06-08"),
        totalCopies: 2,
      },
    }),
    prisma.book.upsert({
      where: { isbn: "9780201616224" },
      update: {},
      create: {
        isbn: "9780201616224",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        description: "From journeyman to master.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg",
        publisher: "Addison-Wesley",
        publishedAt: new Date("1999-10-20"),
        totalCopies: 1,
      },
    }),
    prisma.book.upsert({
      where: { isbn: "9782226257017" },
      update: {},
      create: {
        isbn: "9782226257017",
        title: "Sapiens",
        author: "Yuval Noah Harari",
        description: "Une brève histoire de l'humanité.",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9782226257017-M.jpg",
        publisher: "Albin Michel",
        publishedAt: new Date("2011-01-01"),
        totalCopies: 2,
      },
    }),
  ]);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await prisma.loan.create({
    data: {
      userId: user.id,
      bookId: books[1].id,
      dueAt: dueDate,
      status: "ACTIVE",
    },
  });

  console.log("✅ Database seeded!");
  console.log("📧 Admin: admin@library.com/ admin123");
  console.log("📧 User:  user@library/ user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
