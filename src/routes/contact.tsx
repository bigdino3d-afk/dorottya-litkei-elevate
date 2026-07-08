import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dorottya Litkei" },
      { name: "description", content: "Get in touch to book a session, request a workshop or ask a question." },
      { property: "og:title", content: "Contact — Dorottya Litkei" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Contact</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Let's <em className="text-gold not-italic font-medium">talk</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Whether you're booking your first session or organising an
              international workshop, this is the fastest way to reach the
              studio.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="space-y-10">
          <div>
            <p className="eyebrow">Studio</p>
            <div className="mt-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold mt-1 shrink-0" />
              <p className="font-serif text-xl leading-relaxed">Limassol, Cyprus<br /><span className="text-muted-foreground text-base">By appointment only</span></p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <div className="mt-4 flex items-center gap-3">
              <Mail className="h-5 w-5 text-gold" />
              <a href="mailto:studio@dorottyalitkei.com" className="font-serif text-xl link-underline">studio@dorottyalitkei.com</a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <div className="mt-4 flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              <a href="tel:+35700000000" className="font-serif text-xl link-underline">+357 00 000 000</a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Hours</p>
            <div className="mt-4 space-y-1 font-serif text-lg">
              <p>Mon – Fri · 08:00 – 21:00</p>
              <p>Saturday · 09:00 – 15:00</p>
              <p className="text-muted-foreground">Sunday · closed</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="bg-cream p-8 md:p-12 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Name</span>
                <input required className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
              <label className="block">
                <span className="eyebrow">Email</span>
                <input required type="email" className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg" />
              </label>
            </div>
            <label className="block">
              <span className="eyebrow">Interest</span>
              <select className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg">
                <option>Private Lessons</option>
                <option>Group Classes</option>
                <option>Workshops</option>
                <option>Online Coaching</option>
                <option>Competition Preparation</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Message</span>
              <textarea required rows={5} className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg resize-none" />
            </label>
            <button type="submit" className="btn-luxe btn-luxe-hover w-full sm:w-auto">
              {sent ? "Message Sent" : "Send Message"}
            </button>
            {sent && <p className="text-sm text-muted-foreground">Thank you — we'll respond within 24 hours.</p>}
          </form>
        </Reveal>
      </section>

      <section className="container-luxe pb-24">
        <Reveal className="aspect-[16/9] overflow-hidden border border-border">
          <iframe
            title="Studio location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=33.02%2C34.68%2C33.09%2C34.71&layer=mapnik"
            className="w-full h-full grayscale"
            loading="lazy"
          />
        </Reveal>
      </section>
    </>
  );
}
