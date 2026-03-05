// app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f1117" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #c9a96e, #e8c87a)" }}>
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#e8c87a", fontFamily: "Georgia, serif" }}>
            Bibliotheca
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6b6475" }}>Créer votre compte</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "#1a1728", border: "1px solid #2a2540" }}>
          <RegisterForm />
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "#6b6475" }}>
          Déjà un compte ?{" "}
          <a href="/login" style={{ color: "#c9a96e" }}>Se connecter</a>
        </p>
      </div>
    </div>
  );
}
