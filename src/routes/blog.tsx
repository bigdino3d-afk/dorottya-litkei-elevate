import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Dorottya Litkei" },
      { name: "description", content: "Notes on pole sport, training, mobility, nutrition, mental preparation and life at the elite level." },
      { property: "og:title", content: "Journal — Dorottya Litkei" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
};

function Blog() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, category, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      const list = (data ?? []) as Post[];
      setPosts(list);
      setCategories(Array.from(new Set(list.map((p) => p.category).filter(Boolean) as string[])));
    })();
  }, []);

  const filtered = active ? (posts ?? []).filter((p) => p.category === active) : posts ?? [];

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Journal</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Notes from the <em className="text-gold not-italic font-medium">studio</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Long-form writing on technique, training, mobility and the mental
              side of elite pole sport.
            </p>
          </Reveal>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-luxe py-10 border-b border-border">
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setActive(null)}
              className={`rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                active === null ? "border-gold text-gold" : "border-border hover:border-gold hover:text-gold"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                  active === c ? "border-gold text-gold" : "border-border hover:border-gold hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-luxe py-20">
        {posts === null ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center max-w-md mx-auto py-20">
            <p className="eyebrow text-muted-foreground">Coming soon</p>
            <h2 className="mt-4 font-serif text-3xl">The journal opens shortly.</h2>
            <p className="mt-4 text-muted-foreground">
              The first articles are in preparation. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 100}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                  {p.cover_image_url && (
                    <div className="aspect-[4/5] overflow-hidden bg-cream">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="mt-6 flex items-center gap-4 eyebrow text-muted-foreground">
                    {p.category && <span className="text-gold">{p.category}</span>}
                    {p.category && p.published_at && <span className="h-1 w-1 rounded-full bg-border" />}
                    {p.published_at && (
                      <span>
                        {new Date(p.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight group-hover:text-gold transition-colors">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
                      {p.excerpt}
                    </p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="bg-ink text-white">
        <div className="container-luxe py-24 text-center">
          <Reveal className="max-w-xl mx-auto">
            <p className="eyebrow text-white/60">Newsletter</p>
            <h2 className="mt-6 font-serif text-white text-4xl md:text-5xl">Delivered monthly.</h2>
            <p className="mt-4 text-white/70">Long-form training notes, workshop dates and behind-the-scenes.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required placeholder="Your email" className="flex-1 bg-transparent border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/50 focus:border-gold focus:outline-none" />
              <button className="btn-luxe btn-luxe-hover" style={{ background: "var(--gold)", color: "var(--ink)", borderColor: "var(--gold)" }}>Subscribe</button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
