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
  { year: "2014", title: "First Pole", desc: "Discovers pole sport in Budapest. Podiums at the Hungarian Championship in her first year." },
  { year: "2015", title: "Begins Coaching", desc: "After just nine months of training, starts teaching alongside competing." },
  { year: "2016", title: "European Champion", desc: "Wins the European Pole Sport Championship and takes PoleArt Hungary gold." },
  { year: "2020", title: "Elite Podiums", desc: "Repeat Hungarian Champion across Pole Sport and Pole Art in the Elite division." },
  { year: "2023", title: "Coaching Breakthrough", desc: "Her athletes take gold at MALESZ Hungarian Championships and the POSA Pole Art World Championship in Barcelona." },
  { year: "2024", title: "Coach of the Year", desc: "Named Coach of the Year. Students win POSA European titles and world medals from Junior to Masters 50+." },
  { year: "2026", title: "Cyprus", desc: "Relocates to Cyprus to take pole sports on the island to the next level." },
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
            <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-tight">One life, one obsession.</h2>
          </Reveal>
          <Reveal delay={150} className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              I began pole in 2014. Within months I was on the podium of the
              Hungarian Championship. Nine months in, I was already teaching.
              For a decade I trained day and night — without a coach. That
              absence became my compass: I set out to become the coach I
              never had.
            </p>
            <p>
              Since 2014 I've competed every year — amateur, pro, then elite.
              Two IPSF Pole Sport medals in my first three seasons.
              <em className="text-gold not-italic"> European Pole Sport Champion in 2016</em>.
              Repeat Hungarian Champion across Pole Sport and Pole Art.
              PoleArt Hungary winner. Finalist at POSA European and World
              Championships from 2020 through 2025. A record built on the
              podium, not on the sidelines.
            </p>
            <p>
              Movement has shaped me since I was fourteen, when Latin dance
              first pulled me in. By eighteen I was teaching, and I've never
              stopped. This isn't a career — it's a vocation. A way of life
              spent lifting other people.
            </p>
            <p>
              From nine years old to sixty-one. From first-timers to national
              champions. My athletes have taken gold at MALESZ Hungarian
              Championships, the POSA European Championship, and the POSA
              Pole Art World Championship — across Junior, Senior and
              Masters 50+. Hundreds of students. Hundreds of results on
              national and international stages. In <em className="text-gold not-italic">2024, I was named Coach of the Year</em>.
            </p>
            <p>
              What you receive here is attention unlike any you've had before.
              I read your level and draw out what's already in you. I build a
              space that's safe — mentally and physically. I design
              choreography that fits <em className="text-gold not-italic">you</em>, not a template. And whatever you
              want to learn, I'll teach you.
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
