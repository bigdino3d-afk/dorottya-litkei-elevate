import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Calendar, Clock, MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Lesson — Dorottya Litkei" },
      { name: "description", content: "Book a private pole sport lesson, workshop or consultation with Dorottya Litkei in Cyprus." },
      { property: "og:title", content: "Book — Dorottya Litkei" },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const STEPS = [
  { title: "Choose a service", desc: "Private lesson, consultation, workshop or competition prep." },
  { title: "Pick a date & time", desc: "See real-time availability across the studio calendar." },
  { title: "Confirm your details", desc: "A short intake so we can prepare properly for you." },
  { title: "You're in", desc: "Instant confirmation, calendar invite and gentle reminders." },
];

function Booking() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Booking</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Reserve your <em className="text-gold not-italic font-medium">place</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              The full booking calendar with real-time availability, automatic
              reminders and Google Calendar sync is arriving with our next
              phase. For now, request your preferred slot below and we'll
              confirm within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <h2 className="font-serif text-3xl">How booking works</h2>
          <ol className="mt-8 space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-serif text-2xl text-gold w-8">0{i + 1}</span>
                <div>
                  <p className="font-serif text-xl">{s.title}</p>
                  <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Cancel up to 24 hours before your session</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Instant email confirmation</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Mobile-friendly and secure</p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Request received. We'll confirm within 24 hours."); }}
            className="bg-cream p-8 md:p-12 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location</span>
                <select className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg">
                  <option>Studio · Limassol</option>
                  <option>Online</option>
                  <option>Client's studio</option>
                </select>
              </label>
              <label className="block">
                <span className="eyebrow">Service</span>
                <select className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg">
                  <option>Private Lesson</option>
                  <option>Consultation</option>
                  <option>Workshop</option>
                  <option>Competition Prep</option>
                </select>
              </label>
              <label className="block">
                <span className="eyebrow flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Duration</span>
                <select className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg">
                  <option>60 minutes</option>
                  <option>90 minutes</option>
                  <option>2 hours</option>
                </select>
              </label>
              <label className="block">
                <span className="eyebrow flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Preferred date</span>
                <input type="date" className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
              <label className="block">
                <span className="eyebrow">Preferred time</span>
                <input type="time" className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
              <label className="block">
                <span className="eyebrow">Experience</span>
                <select className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Competitor</option>
                </select>
              </label>
              <label className="block">
                <span className="eyebrow">Full name</span>
                <input required className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
              <label className="block">
                <span className="eyebrow">Email</span>
                <input required type="email" className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
            </div>
            <label className="block">
              <span className="eyebrow">Notes (optional)</span>
              <textarea rows={4} className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg resize-none" />
            </label>
            <button type="submit" className="btn-luxe btn-luxe-hover w-full sm:w-auto">Request Booking</button>
            <p className="text-xs text-muted-foreground">
              Prefer to chat first?{" "}
              <Link to="/contact" className="link-underline text-foreground">Request a consultation</Link>.
            </p>
          </form>
        </Reveal>
      </section>
    </>
  );
}
