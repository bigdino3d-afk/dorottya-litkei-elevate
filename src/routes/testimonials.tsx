import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Dorottya Litkei" },
      { name: "description", content: "What students, competitors and studios say about training with Dorottya." },
      { property: "og:title", content: "Testimonials — Dorottya Litkei" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

const TESTIMONIALS = [
  {
    quote:
      "Dorottya rebuilt my technique from the ground up. Six months later I placed on a national podium for the first time. Her eye for detail is unmatched.",
    name: "Anna K.",
    title: "National competitor, Hungary",
  },
  {
    quote:
      "I've trained with coaches on three continents. Nobody breaks down a movement with the clarity she does. Every session is a lesson in precision.",
    name: "Sofia M.",
    title: "Advanced student, Cyprus",
  },
  {
    quote:
      "As a beginner I was terrified. Dorottya made me feel completely safe while pushing me further than I thought possible. I look forward to every class.",
    name: "Elena P.",
    title: "Beginner, Limassol",
  },
  {
    quote:
      "The workshop was worth every euro of travel. Two days changed how I think about pole entirely. I finally understand what 'clean technique' means.",
    name: "Maria D.",
    title: "Workshop participant, Athens",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Testimonials</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              In their <em className="text-gold not-italic font-medium">own words</em>.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24">
        <Reveal className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
          </div>
          <blockquote className="mt-10 font-serif text-3xl md:text-5xl leading-[1.15] italic text-charcoal min-h-[240px]">
            "{t.quote}"
          </blockquote>
          <div className="mt-10">
            <p className="font-serif text-xl">{t.name}</p>
            <p className="mt-1 eyebrow text-muted-foreground">{t.title}</p>
          </div>

          <div className="mt-16 flex justify-center items-center gap-6">
            <button
              onClick={() => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="h-12 w-12 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="eyebrow text-muted-foreground w-16 text-center">
              {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
            </p>
            <button
              onClick={() => setI((i + 1) % TESTIMONIALS.length)}
              className="h-12 w-12 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </section>

      <section className="bg-ink text-white">
        <div className="container-luxe py-24">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { v: "500+", l: "5-star reviews" },
              { v: "40+", l: "Competition podiums" },
              { v: "12", l: "Countries taught" },
              { v: "97%", l: "Return rate" },
            ].map((s, k) => (
              <Reveal key={s.l} delay={k * 80}>
                <p className="font-serif text-5xl text-gold">{s.v}</p>
                <p className="mt-3 eyebrow text-white/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
