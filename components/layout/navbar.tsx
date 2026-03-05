// components/layout/navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/catalogue", label: "Catalogue", icon: "📚" },
  { href: "/dashboard/loans", label: "Mes emprunts", icon: "📖" },
];

const adminLinks = [
  { href: "/admin/books", label: "Livres", icon: "📗" },
  { href: "/admin/loans", label: "Emprunts", icon: "📋" },
  { href: "/admin/test", label: "Tests", icon: "🧪" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header style={{
      background: "#0f1117",
      borderBottom: "1px solid #2a2540",
      padding: "0 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/catalogue" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <div style={{
          width: "34px", height: "34px",
          background: "linear-gradient(135deg, #c9a96e, #e8c87a)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>📚</div>
        <span style={{ fontWeight: 700, fontSize: "18px", color: "#e8c87a", fontFamily: "Georgia, serif" }}>
          Bibliotheca
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} style={{
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: pathname.startsWith(link.href) ? 700 : 400,
            background: pathname.startsWith(link.href) ? "#1a1728" : "transparent",
            color: pathname.startsWith(link.href) ? "#c9a96e" : "#9b92a8",
            textDecoration: "none",
            transition: "all .15s",
            border: pathname.startsWith(link.href) ? "1px solid #2a2540" : "1px solid transparent",
          }}>
            {link.icon} {link.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div style={{ width: "1px", height: "20px", background: "#2a2540", margin: "0 4px" }} />
            {adminLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: pathname.startsWith(link.href) ? 700 : 400,
                background: pathname.startsWith(link.href) ? "#1a1728" : "transparent",
                color: pathname.startsWith(link.href) ? "#c9a96e" : "#9b92a8",
                textDecoration: "none",
                transition: "all .15s",
                border: pathname.startsWith(link.href) ? "1px solid #2a2540" : "1px solid transparent",
              }}>
                {link.icon} {link.label}
              </Link>
            ))}
            <Link href="/admin/books/add" style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              background: "#c9a96e22",
              color: "#c9a96e",
              textDecoration: "none",
              border: "1px solid #c9a96e44",
            }}>
              + ISBN
            </Link>
          </>
        )}
      </nav>

      {/* User */}
      {session && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e0d5" }}>
              {session.user?.name}
            </div>
            <div style={{ fontSize: "11px", color: isAdmin ? "#c9a96e" : "#6b6475" }}>
              {isAdmin ? "ADMIN" : "Membre"}
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid #2a2540",
            borderRadius: "8px",
            color: "#6b6475",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
