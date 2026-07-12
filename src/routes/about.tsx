import { createFileRoute, Link } from "@tanstack/react-router";
import portrait from "@/assets/portrait.jpg";
import stage from "@/assets/stage.jpg";
import studio from "@/assets/studio.jpg";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dorottya Litkei" },
      { name: "description", content: "The story of Dorottya Litkei — six-time Hungarian Pole Sport Champion and Coach of the Year 2024." },
      { property: "og:title", content: "About Dorottya Litkei" },
      { property: "og:description", content: "13+ years, six national titles, thousands of students." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const TIMELINE = [
  { year: "2011", title: "First Pole", desc: "Discovers pole sport in Budapest and begins daily training under Hungary's top coaches." },
  { year: "2015", title: "First National Title", desc: "Wins her first Hungarian Championship in the elite division." },
  { year: "2018", title: "International Stage", desc: "Represents Hungary at IPSF World Championships. Begins coaching full-time." },
  { year: "2020", title: "Studio Founded", desc: "Opens her private studio, focused on small-group and 1:1 coaching." },
  { year: "2022", title: "Sixth National Title", desc: "Becomes six-time Hungarian Champion — an unmatched record in her category." },
  { year: "2024", title: "Coach of the Year", desc: "Named Coach of the Year 2024 by the national federation. Relocates studio to Cyprus." },
];

const ACHIEVEMENTS = [
  "6× Hungarian Champion — Elite Category",
  "Coach of the Year 2024",
  "IPSF World Championship representative",
  "Certified pole sport judge",
  "13+ years of professional coaching",
  "Thousands of students across Europe",
  "International workshops in 12+ countries",
  "Featured in Pole Magazine and beyond",
];

function About() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 bg-cream">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1.1fr_1fr] items-end">
          <Reveal>
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />About</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              A life shaped by <em className="text-gold not-italic font-medium">discipline</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Dorottya Litkei is one of Hungary's most decorated pole sport
              athletes — and today, one of the most sought-after coaches in
              Cyprus. Her method is quiet, technical, and uncompromising.
            </p>
          </Reveal>
          <Reveal delay={200} className="relative aspect-[4/5] overflow-hidden">
            <img src={portrait} alt="Portrait of Dorottya" className="h-full w-full object-cover" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="eyebrow">The Story</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-tight">Thirteen years, one obsession.</h2>
          </Reveal>
          <Reveal delay={150} className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Dorottya first stepped onto a pole in Budapest in 2011. Within four
              years she was standing on the top step of the Hungarian
              championship podium — the beginning of an unbroken decade at the
              elite level.
            </p>
            <p>
              Six national titles, international competitions, and thousands of
              hours in the studio taught her something most coaches never
              articulate: the difference between a good athlete and a great one
              is almost entirely invisible from the outside. It lives in the
              hands, the timing, the breath.
            </p>
            <p>
              That invisible layer is what she teaches. Whether you're a
              beginner or a national competitor, her sessions are built on the
              same three principles: safety, biomechanical precision, and
              long-term progression.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-cream">
        <div className="container-luxe py-28 md:py-36">
          <Reveal className="max-w-2xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Timeline</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl">From Budapest to Cyprus.</h2>
          </Reveal>
          <div className="mt-20 relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
            <div className="space-y-16">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.year} delay={i * 60} className={`relative md:grid md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:col-start-2" : ""}`}>
                  <div className={`pl-8 md:pl-0 ${i % 2 === 1 ? "md:text-left md:pl-16" : "md:text-right md:pr-16"}`}>
                    <span className="absolute left-0 md:left-1/2 top-1 h-3 w-3 rounded-full bg-gold md:-translate-x-1/2 ring-4 ring-cream" />
                    <p className="font-serif text-4xl text-gold">{t.year}</p>
                    <h3 className="mt-3 font-serif text-2xl">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-md md:inline-block">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="container-luxe py-28 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Achievements</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-tight">A record, quietly built.</h2>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              Accolades matter only as evidence of the work behind them. These
              are ours.
            </p>
          </Reveal>
          <Reveal delay={150} className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {ACHIEVEMENTS.map((a) => (
              <div key={a} className="flex gap-4 border-t border-border pt-6">
                <span className="font-serif text-gold text-lg leading-none pt-1">◆</span>
                <p className="text-base leading-relaxed">{a}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* IMAGE + CTA */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={stage} alt="Performance stage" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 h-full container-luxe flex flex-col justify-end pb-16 md:pb-24 text-white">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-white text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
              Train like a warrior. <br />Learn from a <em className="text-gold not-italic">champion</em>.
            </h2>
            <div className="mt-10 flex gap-4">
              <Link to="/booking" className="btn-luxe btn-luxe-hover" style={{ background: "var(--gold)", color: "var(--ink)", borderColor: "var(--gold)" }}>
                Book a Lesson
              </Link>
              <Link to="/services" className="btn-ghost-luxe">View Services</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24">
        <img src={studio} alt="" className="w-full h-[50vh] object-cover" loading="lazy" />
      </section>
    </>
  );
}
