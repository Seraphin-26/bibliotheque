// lib/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Email invalide."),
  password: z.string().min(6, "Mot de passe : minimum 6 caractères."),
});

export async function registerUser(formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { success: false, error: "Cet email est déjà utilisé." };

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });

  return { success: true, message: "Compte créé. Vous pouvez vous connecter." };
}
