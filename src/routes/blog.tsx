import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import studio from "@/assets/studio.jpg";
import grip from "@/assets/grip.jpg";
import stage from "@/assets/stage.jpg";
import g4 from "@/assets/g4.jpg";

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

const POSTS = [
  { title: "The invisible half of every pole trick", category: "Technique", read: "6 min read", img: grip },
  { title: "How I train grip strength through a competition cycle", category: "Training", read: "8 min read", img: studio },
  { title: "Mobility work you should be doing before every session", category: "Mobility", read: "5 min read", img: g4 },
  { title: "The mental preparation ritual behind six national titles", category: "Mindset", read: "10 min read", img: stage },
];

const CATEGORIES = ["Pole Sport", "Training", "Mobility", "Nutrition", "Recovery", "Mindset", "Competitions", "Lifestyle"];

function Blog() {
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

      <section className="container-luxe py-16 border-b border-border">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {CATEGORIES.map((c) => (
            <button key={c} className="rounded-full border border-border px-5 py-2 text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors">
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
          {POSTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 100}>
              <Link to="/blog" className="group block">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" loading="lazy" />
                </div>
                <div className="mt-6 flex items-center gap-4 eyebrow text-muted-foreground">
                  <span className="text-gold">{p.category}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{p.read}</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight group-hover:text-gold transition-colors">
                  {p.title}
                </h2>
              </Link>
            </Reveal>
          ))}
        </div>
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
