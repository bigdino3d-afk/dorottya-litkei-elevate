import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Dorottya Litkei" },
      { name: "description", content: "Answers to the most common questions about training, safety, pricing and booking." },
      { property: "og:title", content: "FAQ — Dorottya Litkei" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

const FAQ = [
  { q: "I have never done pole before. Can I still book a lesson?", a: "Absolutely. A large portion of our students start as complete beginners. Every private lesson begins with an assessment and a personalised warm-up. No prior experience is required." },
  { q: "Do I need to be strong or flexible to start?", a: "No. Strength and mobility are trained, not required. What matters is showing up consistently and following a good plan." },
  { q: "How safe is pole sport?", a: "Under proper coaching, pole sport is remarkably safe. Every progression is earned. Crash mats, spotting and technique thresholds are non-negotiable in our sessions." },
  { q: "What should I wear?", a: "For your first session: fitted shorts and a comfortable top. Skin contact with the pole is essential for grip. Leave lotions and oils at home on training days." },
  { q: "Do you coach men and non-binary students?", a: "Yes. Our coaching is open to all serious students, at all levels." },
  { q: "Can you prepare me for competition?", a: "Yes. Competition preparation is one of our core offerings. Programs are typically 12–24 weeks and include choreography, conditioning and mental preparation." },
  { q: "How do I cancel or reschedule?", a: "You can reschedule or cancel up to 24 hours in advance at no cost via your booking confirmation email." },
  { q: "Do you offer online coaching?", a: "Yes — full remote programming with video review and weekly check-ins. Ideal for athletes without access to an elite in-person coach." },
];

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />FAQ</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Answered <em className="text-gold not-italic font-medium">honestly</em>.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-8 flex items-start justify-between gap-8 text-left group"
                >
                  <span className="font-serif text-xl md:text-2xl leading-tight group-hover:text-gold transition-colors">{f.q}</span>
                  <span className="mt-1 h-9 w-9 shrink-0 grid place-items-center rounded-full border border-border group-hover:border-gold transition-colors">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500 ease-out"
                  style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <p className="pb-8 pr-16 text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
