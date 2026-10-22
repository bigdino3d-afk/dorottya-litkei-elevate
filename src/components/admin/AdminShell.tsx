import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";

const TABS = [
  { to: "/admin", label: "Journal" },
  { to: "/manage-projects", label: "Projects" },
  { to: "/manage-videos", label: "Videos" },
  { to: "/manage-calendar", label: "Calendar" },
  { to: "/manage-workshops", label: "Workshops" },
  { to: "/manage-kit", label: "Marketing Kit" },
  { to: "/manage-studios", label: "Studios & Inquiries" },
] as const;

export function AdminTabs() {
  return (
    <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 eyebrow" aria-label="Admin sections">
      {TABS.map((t) => (
        <Link key={t.to} to={t.to} className="text-muted-foreground hover:text-gold" activeProps={{ className: "text-gold" }}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const { isAdmin, email, signOut } = useAdmin();

  if (isAdmin === null) {
    return <div className="pt-40 pb-24 container-luxe text-center text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="pt-40 pb-24 container-luxe max-w-lg text-center">
        <p className="eyebrow text-muted-foreground">Restricted</p>
        <h1 className="mt-4 font-serif text-3xl">Admin access required</h1>
        <p className="mt-4 text-muted-foreground">
          {email ? (
            <>You are signed in as <span className="text-charcoal">{email}</span>, but this account has no admin role.</>
          ) : (
            "Please sign in with an admin account."
          )}
        </p>
        <button onClick={signOut} className="mt-8 eyebrow text-gold hover:underline">Sign out</button>
      </div>
    );
  }

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div>
            <p className="eyebrow text-muted-foreground">Admin</p>
            <h1 className="mt-2 font-serif text-4xl">{title}</h1>
            <AdminTabs />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <button onClick={signOut} className="inline-flex items-center gap-2 h-11 px-5 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export const adminField = "mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none";
export const adminArea = "mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-y";
export const adminBtn = "inline-flex items-center justify-center gap-2 h-11 px-5 bg-charcoal text-white eyebrow hover:bg-gold transition-colors disabled:opacity-50";
export const adminGhost = "inline-flex items-center justify-center gap-2 h-11 px-5 border border-border eyebrow hover:border-gold hover:text-gold transition-colors disabled:opacity-50";
export const adminIcon = "h-10 w-10 grid place-items-center border border-border hover:border-gold hover:text-gold disabled:opacity-40";
