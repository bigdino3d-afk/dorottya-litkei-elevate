import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Reviews — Dorottya Litkei" },
      { name: "description", content: "Read reviews from students and share your own experience training with Dorottya." },
      { property: "og:title", content: "Reviews — Dorottya Litkei" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  quote: string;
  created_at: string;
};

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(80),
  location: z.string().trim().max(80).optional(),
  rating: z.number().int().min(1).max(5),
  quote: z.string().trim().min(5, "Please write a few words").max(1000),
});

function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, quote: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Testimonial[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = schema.safeParse({
      name: form.name,
      location: form.location || undefined,
      rating: Number(form.rating),
      quote: form.quote,
    });
    if (!parsed.success) {
      setMessage({ type: "err", text: parsed.error.issues[0]?.message ?? "Please check the form" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      name: parsed.data.name,
      location: parsed.data.location ?? null,
      rating: parsed.data.rating,
      quote: parsed.data.quote,
    });
    setSubmitting(false);
    if (error) {
      setMessage({ type: "err", text: "Could not submit. Please try again." });
      return;
    }
    setForm({ name: "", location: "", rating: 5, quote: "" });
    setMessage({ type: "ok", text: "Thank you — your review is now live." });
    load();
  }

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Reviews</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              In their <em className="text-gold not-italic font-medium">own words</em>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Share your experience — every review is published instantly and read by future students from around the world.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20">
        <Reveal className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl">Leave a review</h2>
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={80}
                  required
                  className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none transition-colors"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">City or role (optional)</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  maxLength={80}
                  className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow text-muted-foreground">Rating</label>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        n <= form.rating ? "text-gold fill-current" : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="eyebrow text-muted-foreground">Your review</label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                maxLength={1000}
                required
                rows={5}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none transition-colors resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground text-right">{form.quote.length}/1000</p>
            </div>

            {message && (
              <p className={`text-sm ${message.type === "ok" ? "text-gold" : "text-destructive"}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center h-12 px-8 bg-charcoal text-white eyebrow tracking-widest hover:bg-gold transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Publish review"}
            </button>
          </form>
        </Reveal>
      </section>

      <section className="bg-cream">
        <div className="container-luxe py-24">
          <Reveal className="max-w-2xl mx-auto text-center mb-16">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />What people say</p>
            <h2 className="mt-6 font-serif text-3xl md:text-5xl">Recent reviews</h2>
          </Reveal>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground max-w-md mx-auto">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {items.map((t, k) => (
                <Reveal key={t.id} delay={k * 60}>
                  <article className="h-full bg-background p-8 border border-border/60 flex flex-col">
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-20"}`}
                        />
                      ))}
                    </div>
                    <blockquote className="mt-6 font-serif text-lg italic leading-relaxed text-charcoal flex-1">
                      "{t.quote}"
                    </blockquote>
                    <div className="mt-6 pt-6 border-t border-border/60">
                      <p className="font-serif text-lg">{t.name}</p>
                      {t.location && (
                        <p className="mt-1 eyebrow text-muted-foreground">{t.location}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
