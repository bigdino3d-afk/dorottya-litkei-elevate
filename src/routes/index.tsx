import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import studio from "@/assets/studio.jpg";
import grip from "@/assets/grip.jpg";
import portrait from "@/assets/portrait.jpg";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, Award, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dorottya Litkei — Elite Pole Sport Coach in Cyprus" },
      {
        name: "description",
        content:
          "Master Strength. Master Control. Master Yourself. Private Pole Sport lessons, workshops and competition preparation by Dorottya Litkei — six-time Hungarian Champion.",
      },
      { property: "og:title", content: "Dorottya Litkei — Elite Pole Sport Coach" },
      { property: "og:description", content: "Elite Pole Sport coaching in Cyprus." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const STATS = [
  { value: "6×", label: "Hungarian Champion" },
  { value: "2024", label: "Coach of the Year" },
  { value: "13+", label: "Years Experience" },
  { value: "1000s", label: "Students Trained" },
];

const SERVICES_PREVIEW = [
  { title: "Private Lessons", desc: "One-to-one coaching designed around your technique, goals and body." },
  { title: "Competition Prep", desc: "End-to-end preparation for national and international pole competitions." },
  { title: "Workshops", desc: "Intensive small-group workshops in Cyprus and internationally." },
  { title: "Online Coaching", desc: "Remote programming, video review and structured progression." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink text-white">
        <img
          src={hero}
          alt="Dorottya Litkei performing an elite pole sport hold"
          width={1600}
          height={1800}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-70 animate-slow-zoom"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />

        <div className="relative z-10 container-luxe h-full flex flex-col justify-end pb-24 md:pb-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow text-white/70">
              <span className="gold-line mr-4 align-middle" />
              Elite Pole Sport Coaching · Cyprus
            </p>
            <h1 className="mt-8 font-serif text-white text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.98] tracking-[-0.02em]">
              Master Strength.
              <br />
              Master Control.
              <br />
              <span className="italic text-gold">Master Yourself.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg text-white/75 leading-relaxed font-light">
              Six-time Hungarian Champion. Coach of the Year 2024. Thirteen years
              of pole sport mastery — distilled into private lessons, workshops
              and competition preparation for athletes who refuse the ordinary.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/booking" className="btn-luxe btn-luxe-hover">
                Book a Lesson <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/services" className="btn-ghost-luxe">Workshops</Link>
              <Link to="/shop" className="btn-ghost-luxe">Shop</Link>
              <Link to="/about" className="btn-ghost-luxe">About Me</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3 text-white/60">
          <span className="text-[0.62rem] tracking-[0.4em] uppercase">Scroll</span>
          <span className="h-10 w-px bg-white/40" />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border bg-cream overflow-hidden">
        <div className="py-6 flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16 pr-16 shrink-0">
              {["Six-Time Hungarian Champion", "Coach of the Year 2024", "IPSF and POSA Compatible", "13+ Years Experience", "International Workshops", "Competition Judge"].map((t) => (
                <span key={t + i} className="flex items-center gap-4 eyebrow text-charcoal">
                  {t} <span className="h-1 w-1 rounded-full bg-gold" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* INTRO / ABOUT PREVIEW */}
      <section className="container-luxe py-28 md:py-40">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />About the Coach</p>
            <h2 className="mt-8 font-serif text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.05]">
              A quiet obsession with <em className="text-gold not-italic font-medium">technical excellence</em>.
            </h2>
            <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              For over a decade, Dorottya has represented Hungary at the highest
              level of pole sport competition. Today, from her studio in Cyprus,
              she coaches a select group of athletes and enthusiasts — from
              beginners rediscovering their bodies to competitors chasing world
              titles.
            </p>
            <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              Every session is built around three principles: safety,
              biomechanical precision, and long-term progression. No shortcuts.
              No spectacle for its own sake. Only mastery.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 mt-10 eyebrow text-foreground link-underline">
              Read the full story <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <Reveal delay={200} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img src={portrait} alt="Portrait of Dorottya Litkei" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-background border border-border p-6 md:p-8 max-w-[240px] shadow-soft">
              <p className="font-serif italic text-2xl leading-tight">
                "Precision <br />is elegance."
              </p>
              <p className="mt-4 eyebrow text-muted-foreground">— D.L.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-ink text-white">
        <div className="container-luxe py-24 md:py-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} className="border-l border-white/15 pl-6">
                <p className="font-serif text-5xl md:text-6xl text-white leading-none">
                  {s.value}
                </p>
                <p className="mt-4 eyebrow text-white/60">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-luxe py-28 md:py-40">
        <Reveal className="max-w-3xl">
          <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Services</p>
          <h2 className="mt-8 font-serif text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.05]">
            Coaching, <em className="text-gold not-italic font-medium">refined</em>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-border md:grid-cols-2">
          {SERVICES_PREVIEW.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="group bg-background p-10 md:p-14 transition-colors duration-500 hover:bg-cream">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-muted-foreground">0{i + 1}</p>
                  <h3 className="mt-4 font-serif text-3xl md:text-4xl">{s.title}</h3>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:text-gold group-hover:rotate-45" />
              </div>
              <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">{s.desc}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link to="/services" className="btn-luxe btn-luxe-hover">
            Explore All Services
          </Link>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-cream">
        <div className="container-luxe py-28 md:py-36">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Safety First", desc: "Every progression is earned. Injury prevention is engineered into the method." },
              { icon: Sparkles, title: "Elegant Technique", desc: "Movement should look effortless. That effortlessness is trained." },
              { icon: Award, title: "Competition Ready", desc: "From first spin to podium — a proven path to national and international stages." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 120} className="text-center md:text-left">
                <p.icon className="h-6 w-6 text-gold mx-auto md:mx-0" />
                <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT IMAGES */}
      <section className="container-luxe py-28 md:py-40">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          <Reveal className="relative aspect-[4/5] overflow-hidden">
            <img src={studio} alt="Studio interior" className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105" loading="lazy" />
          </Reveal>
          <Reveal delay={120} className="relative aspect-[4/5] overflow-hidden md:mt-24">
            <img src={grip} alt="Chalked grip detail" className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="container-luxe py-28 md:py-40 relative z-10">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-white/60"><span className="gold-line mr-4 align-middle" />Begin</p>
            <h2 className="mt-8 font-serif text-white text-[clamp(2.5rem,5.5vw,5.25rem)] leading-[1.02]">
              Your first session <br />is a <em className="text-gold not-italic font-medium">conversation</em>.
            </h2>
            <p className="mt-8 max-w-xl text-white/70 leading-relaxed">
              We start with your goals, your body, your history. Then we build
              the shortest honest path from where you are to where you want to
              be.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/booking" className="btn-luxe btn-luxe-hover" style={{ background: "var(--gold)", color: "var(--ink)", borderColor: "var(--gold)" }}>
                Book Your Consultation
              </Link>
              <Link to="/contact" className="btn-ghost-luxe">Get in Touch</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
