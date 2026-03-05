// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f1117" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #c9a96e, #e8c87a)" }}>
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#e8c87a", fontFamily: "Georgia, serif" }}>
            Bibliotheca
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6b6475" }}>
            Connectez-vous à votre bibliothèque
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#1a1728", border: "1px solid #2a2540" }}>
          <LoginForm />
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "#6b6475" }}>
          Pas de compte ?{" "}
          <a href="/register" style={{ color: "#c9a96e" }}>S'inscrire</a>
        </p>

        {/* Dev hint */}
        <div className="mt-6 p-4 rounded-xl text-xs" style={{ background: "#13111e", border: "1px solid #2a2540", color: "#6b6475" }}>
          <strong style={{ color: "#9b92a8" }}>Comptes de test :</strong><br />
          Admin : admin@library.com / admin123<br />
          User  : user@library.com  / user123
        </div>
      </div>
    </div>
  );
}
