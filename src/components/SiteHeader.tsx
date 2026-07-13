import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/achievements", label: "Achievements" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Journal" },
  { to: "/media", label: "Media" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container-luxe flex h-20 items-center justify-between gap-6">
        <Link
          to="/"
          className={[
            "flex items-center gap-3 transition-colors",
            solid ? "text-foreground" : "text-white",
          ].join(" ")}
        >
          <span className="font-serif text-xl leading-none tracking-tight">
            Dorottya <span className="italic text-gold">Litkei</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className={[
                "text-[0.72rem] font-medium tracking-[0.24em] uppercase link-underline transition-colors",
                solid ? "text-foreground/80 hover:text-foreground" : "text-white/85 hover:text-white",
              ].join(" ")}
              activeProps={{ className: "text-gold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/booking"
            className={[
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.22em] uppercase whitespace-nowrap transition-all",
              solid
                ? "bg-ink text-white hover:bg-gold hover:text-ink"
                : "border border-white/70 text-white hover:bg-white hover:text-ink",
            ].join(" ")}
          >
            Book a Lesson
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "lg:hidden grid place-items-center h-10 w-10 rounded-full transition-colors",
            solid ? "text-foreground" : "text-white",
          ].join(" ")}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container-luxe py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.22em] uppercase text-foreground/80"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="btn-luxe btn-luxe-hover mt-2 self-start"
            >
              Book a Lesson
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
