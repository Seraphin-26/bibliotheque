# 📚 Bibliotheca — Application de Gestion de Bibliothèque
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://bibliotheque-flax.vercel.app/)


![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-0A6CFF?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)
![Auth.js](https://img.shields.io/badge/Auth.js-Authentication-purple?style=for-the-badge)
![Resend](https://img.shields.io/badge/Resend-Email-orange?style=for-the-badge)

Application fullstack construite avec **Next.js 15 (App Router)**, **Prisma**, **SQLite**, **Auth.js** et **Tailwind CSS**.

## Screenshots

### Desktop View
<img src="screenshots/desktop.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_1.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_2.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_3.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_4.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_5.png" width="500px" alt="Desktop view" />
<img src="screenshots/desktop_6.png" width="500px" alt="Desktop view" />
### Mobile View
<img src="screenshots/mobile.png" width="250px" alt="Mobile view" />
<img src="screenshots/mobile_1.png" width="250px" alt="Mobile view" />
<img src="screenshots/mobile_2.png" width="250px" alt="Mobile view" />
---

## 🚀 Installation & Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données
```bash
# Créer le fichier .env (déjà fourni, vérifiez les valeurs)
# Puis générer la base SQLite + le client Prisma
npx prisma db push
npx prisma generate
```

### 3. Peupler la base avec des données de test
```bash
npm run db:seed
```

**Comptes créés :**
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@library.com | admin123 | ADMIN |
| user@library.com  | user123  | USER  |

### 4. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
library-app/
├── app/
│   ├── (auth)/
│   │   ├── login/          ← Page de connexion
│   │   └── register/       ← Page d'inscription
│   ├── api/auth/[...nextauth]/  ← Route Auth.js
│   ├── catalogue/          ← Catalogue public (authentifié)
│   ├── dashboard/
│   │   └── loans/          ← Mes emprunts (USER)
│   └── admin/              ← Zone admin (ADMIN uniquement)
│       ├── books/
│       │   └── add/        ← Ajout via ISBN
│       ├── loans/          ← Tous les emprunts
│       └── users/          ← Gestion utilisateurs
├── components/
│   ├── auth/               ← Formulaires login/register
│   ├── books/              ← BookCard, BookGrid
│   ├── loans/              ← ReturnButton
│   ├── admin/              ← ISBNForm, DeleteBookButton
│   ├── layout/             ← Navbar, AppLayout
│   ├── providers/          ← SessionProvider
│   └── ui/                 ← Composants UI réutilisables
├── lib/
│   ├── actions/
│   │   ├── loans.ts        ← borrowBook, returnBook (Server Actions)
│   │   ├── books.ts        ← fetchBookByISBN, saveBookFromISBN
│   │   └── auth.ts         ← registerUser
│   ├── prisma.ts           ← Client Prisma singleton
│   ├── auth.ts             ← Configuration Auth.js
│   ├── auth-helpers.ts     ← getRequiredSession, getAdminSession
│   └── utils.ts            ← Fonctions utilitaires
├── prisma/
│   ├── schema.prisma       ← Modèles User, Book, Loan
│   └── seed.ts             ← Données de test
└── middleware.ts            ← Protection des routes /admin et /dashboard
```

---

## 🔑 Fonctionnalités

### Authentification (Auth.js)
- Connexion par email/mot de passe
- JWT avec rôle USER/ADMIN dans la session
- Middleware de protection automatique des routes
- `/admin/*` accessible uniquement aux ADMIN

### Catalogue
- Grille de livres avec couvertures
- Badge vert (Disponible) / rouge (Emprunté)
- Recherche en temps réel par titre ou auteur
- Filtre par disponibilité
- Modal d'emprunt avec vérification disponibilité

### Gestion des emprunts (Server Actions)
- Emprunt avec date d'échéance J+14 automatique
- Vérification des copies disponibles
- Retour de livre en un clic
- Détection des emprunts en retard

### Interface Admin
- Tableau de bord avec statistiques
- Liste de tous les livres + bouton suppression
- Liste de tous les emprunts avec statuts
- Liste des utilisateurs
- Ajout de livres via ISBN (Google Books API)

### Ajout via ISBN (Google Books API)
- Fetch automatique : titre, auteur, description, couverture
- Aperçu avant sauvegarde
- Choix du nombre de copies
- Sauvegarde directe dans Prisma

---

## 🛠 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run db:push      # Appliquer le schema Prisma
npm run db:seed      # Peupler la base de données
npm run db:studio    # Interface graphique Prisma
npm run db:generate  # Générer le client Prisma
```

---

## 🔧 Passer à PostgreSQL (production)

1. Modifier `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Modifier `.env` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/library"
```

3. Re-push le schema :
```bash
npx prisma db push
npm run db:seed
```

---

## 🌐 Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion BDD | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Secret JWT (générer avec `openssl rand -base64 32`) | `abc123...` |
| `NEXTAUTH_URL` | URL de l'application | `http://localhost:3000` |
| `GOOGLE_BOOKS_API_KEY` | Clé API Google Books (optionnel) | `AIza...` |

---

## 📦 Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 15 | Framework fullstack (App Router) |
| React | 18 | UI |
| TypeScript | 5 | Typage |
| Prisma | 5 | ORM |
| SQLite | — | Base de données (dev) |
| Auth.js (NextAuth) | 4 | Authentification |
| Tailwind CSS | 3 | Styles |
| bcryptjs | 2 | Hachage des mots de passe |
| Zod | 3 | Validation des données |
