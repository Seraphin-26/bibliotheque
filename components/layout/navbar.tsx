// components/layout/navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/catalogue", label: "Catalogue", icon: "📚" },
  { href: "/dashboard/loans", label: "Mes emprunts", icon: "📖" },
];

const adminLinks = [
  { href: "/admin/books", label: "Livres", icon: "📗" },
  { href: "/admin/loans", label: "Emprunts", icon: "📋" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
  { href: "/admin/test", label: "Tests", icon: "🧪" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);

  const allLinks = [
    ...navLinks,
    ...(isAdmin ? adminLinks : []),
  ];

  return (
    <header style={{
      background: "#0f1117",
      borderBottom: "1px solid #2a2540",
      padding: "0 1rem",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
      }}>
        {/* Logo */}
        <Link href="/catalogue" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #c9a96e, #e8c87a)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>📚</div>
          <span style={{ fontWeight: 700, fontSize: "17px", color: "#e8c87a", fontFamily: "Georgia, serif" }}>
            Bibliotheca
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center" }}
          className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: pathname.startsWith(link.href) ? 700 : 400,
              background: pathname.startsWith(link.href) ? "#1a1728" : "transparent",
              color: pathname.startsWith(link.href) ? "#c9a96e" : "#9b92a8",
              textDecoration: "none",
              border: pathname.startsWith(link.href) ? "1px solid #2a2540" : "1px solid transparent",
              whiteSpace: "nowrap",
            }}>
              {link.icon} {link.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div style={{ width: "1px", height: "18px", background: "#2a2540", margin: "0 4px" }} />
              {adminLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: pathname.startsWith(link.href) ? 700 : 400,
                  background: pathname.startsWith(link.href) ? "#1a1728" : "transparent",
                  color: pathname.startsWith(link.href) ? "#c9a96e" : "#9b92a8",
                  textDecoration: "none",
                  border: pathname.startsWith(link.href) ? "1px solid #2a2540" : "1px solid transparent",
                  whiteSpace: "nowrap",
                }}>
                  {link.icon} {link.label}
                </Link>
              ))}
              <Link href="/admin/books/add" style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                background: "#c9a96e22",
                color: "#c9a96e",
                textDecoration: "none",
                border: "1px solid #c9a96e44",
                whiteSpace: "nowrap",
              }}>+ ISBN</Link>
            </>
          )}
        </nav>

        {/* Desktop user */}
        {session && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
            className="desktop-user">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e0d5", lineHeight: 1.2 }}>
                {session.user?.name}
              </div>
              <div style={{ fontSize: "10px", color: isAdmin ? "#c9a96e" : "#6b6475" }}>
                {isAdmin ? "ADMIN" : "Membre"}
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
              padding: "5px 10px",
              background: "transparent",
              border: "1px solid #2a2540",
              borderRadius: "8px",
              color: "#6b6475",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}>
              Déconnexion
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: "transparent",
            border: "1px solid #2a2540",
            borderRadius: "8px",
            color: "#9b92a8",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
          }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          background: "#13111e",
          borderTop: "1px solid #2a2540",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {allLinks.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: pathname.startsWith(link.href) ? 700 : 400,
                background: pathname.startsWith(link.href) ? "#1a1728" : "transparent",
                color: pathname.startsWith(link.href) ? "#c9a96e" : "#9b92a8",
                textDecoration: "none",
                display: "block",
              }}>
              {link.icon} {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin/books/add" onClick={() => setMenuOpen(false)} style={{
              padding: "10px 14px", borderRadius: "8px", fontSize: "14px",
              fontWeight: 600, background: "#c9a96e22", color: "#c9a96e",
              textDecoration: "none", border: "1px solid #c9a96e44", display: "block",
            }}>+ Ajouter ISBN</Link>
          )}
          {session && (
            <div style={{ borderTop: "1px solid #2a2540", marginTop: "8px", paddingTop: "8px" }}>
              <div style={{ fontSize: "12px", color: "#6b6475", padding: "4px 14px", marginBottom: "4px" }}>
                {session.user?.name} · {isAdmin ? "ADMIN" : "Membre"}
              </div>
              <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
                width: "100%", padding: "10px 14px", background: "transparent",
                border: "1px solid #2a2540", borderRadius: "8px",
                color: "#f87171", fontSize: "13px", cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .desktop-user { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-menu { display: flex !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-user { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
