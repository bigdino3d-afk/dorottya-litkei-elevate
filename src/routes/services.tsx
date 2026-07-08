import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Dorottya Litkei" },
      { name: "description", content: "Private lessons, group classes, competition preparation, online coaching, workshops, stretching and strength training." },
      { property: "og:title", content: "Services — Dorottya Litkei" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const SERVICES = [
  { name: "Private Lessons", price: "from €90", duration: "60 min", desc: "One-to-one coaching tailored to your body, technique and goals. The fastest path to real progress." },
  { name: "Group Classes", price: "from €35", duration: "75 min", desc: "Small-group technical sessions capped at six students. Structured levels from beginner to advanced." },
  { name: "Workshops", price: "from €150", duration: "3 hours", desc: "Immersive workshops focused on tricks, transitions or performance. In Cyprus and internationally." },
  { name: "Online Coaching", price: "from €200 / mo", duration: "monthly", desc: "Programmed training, video review and weekly calls — full remote coaching with elite standards." },
  { name: "Competition Preparation", price: "custom", duration: "12+ weeks", desc: "End-to-end preparation: choreography, conditioning, mental preparation and travel coaching." },
  { name: "Stretching & Flexibility", price: "from €70", duration: "60 min", desc: "Systematic mobility work. Splits, back flexibility, shoulders — safe, structured, measurable." },
  { name: "Strength Training", price: "from €80", duration: "60 min", desc: "Pole-specific strength programming for grip, shoulders, core and lower body." },
  { name: "Choreography Consulting", price: "custom", duration: "project", desc: "Choreography design and refinement for competition, performance or personal projects." },
];

function Services() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Services</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Every program, <em className="text-gold not-italic font-medium">handcrafted</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              From your first spin to your world-championship routine — a suite
              of coaching services engineered for measurable, safe, elegant
              progress.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.name}
              delay={(i % 2) * 80}
              className="group bg-background p-10 md:p-14 flex flex-col transition-colors duration-500 hover:bg-cream"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-muted-foreground">0{i + 1}</p>
                  <h2 className="mt-4 font-serif text-3xl md:text-4xl">{s.name}</h2>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:text-gold group-hover:rotate-45" />
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">{s.desc}</p>
              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="eyebrow text-muted-foreground">Investment</p>
                  <p className="mt-2 font-serif text-lg">{s.price}</p>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground">Duration</p>
                  <p className="mt-2 font-serif text-lg">{s.duration}</p>
                </div>
              </div>
              <Link to="/booking" className="mt-8 self-start btn-luxe btn-luxe-hover">Book</Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-luxe py-24 md:py-32 text-center">
          <Reveal className="max-w-2xl mx-auto">
            <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight">Not sure which is right for you?</h2>
            <p className="mt-6 text-white/70 leading-relaxed">
              A short consultation is the honest place to start. We'll listen,
              assess and recommend.
            </p>
            <Link to="/contact" className="btn-luxe btn-luxe-hover mt-10" style={{ background: "var(--gold)", color: "var(--ink)", borderColor: "var(--gold)" }}>
              Request a Consultation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
