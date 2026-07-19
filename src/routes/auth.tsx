import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Dorottya Litkei" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMsg("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-screen grid place-items-center bg-cream px-6 py-24">
      <div className="w-full max-w-md bg-background p-10 border border-border/60">
        <p className="eyebrow text-muted-foreground">Admin</p>
        <h1 className="mt-4 font-serif text-3xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="eyebrow text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none"
            />
          </div>
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 bg-charcoal text-white eyebrow tracking-widest hover:bg-gold transition-colors disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
          className="mt-6 text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          {mode === "signin" ? "Need an account? Create one" : "Have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
