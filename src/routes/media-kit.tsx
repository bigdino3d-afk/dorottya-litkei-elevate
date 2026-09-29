import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Instagram, Facebook, Music2, Globe, Mail, Phone } from "lucide-react";
import stage from "@/assets/mk-stage-pole.jpg.asset.json";
import silhouette from "@/assets/mk-silhouette.jpg.asset.json";
import studioBw from "@/assets/mk-studio-bw.webp.asset.json";
import golden from "@/assets/mk-golden-pole.jpg.asset.json";
import floorBw from "@/assets/mk-floor-bw.webp.asset.json";
import sunset from "@/assets/mk-sunset.jpg.asset.json";
import daylight from "@/assets/mk-daylight-studio.jpeg.asset.json";
import competition from "@/assets/mk-competition.jpg.asset.json";

export const Route = createFileRoute("/media-kit")({
  head: () => ({
    meta: [
      { title: "Media Kit — Dorottya Litkei | Pole Sport Athlete" },
      { name: "description", content: "Partnership media kit for Dorottya Litkei: European champion pole sport athlete, coach and judge. Audience, content and collaboration formats." },
      { property: "og:title", content: "Media Kit — Dorottya Litkei" },
      { property: "og:description", content: "European champion pole sport athlete, coach and judge. Brand partnership media kit." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/media-kit" }],
  }),
  component: MediaKit,
});

const PLACEHOLDER = "Data pending";

function MediaKit() {
  return (
    <div className="bg-kit-black text-kit-ivory">
      {/* HERO */}
      <section className="relative min-h-[92svh] grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative flex items-end px-6 pb-16 pt-36 md:px-12 lg:px-16 lg:pb-24">
          <div>
            <p className="text-[0.66rem] tracking-[0.34em] uppercase text-kit-muted">Media Kit · 2026</p>
            <h1 className="mt-8 font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.94]">
              Dorottya<br />
              <span className="text-gold">Litkei</span>
            </h1>
            <p className="mt-8 max-w-md text-[0.72rem] tracking-[0.28em] uppercase text-kit-muted leading-loose">
              European Champion · Pole Sport Athlete · Coach · Judge
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#partnership" className="border border-kit-line px-7 py-3 text-[0.66rem] tracking-[0.24em] uppercase hover:border-gold hover:text-gold transition-colors">
                Partnership formats
              </a>
              <a href="#contact" className="bg-kit-ivory text-kit-black px-7 py-3 text-[0.66rem] tracking-[0.24em] uppercase hover:bg-gold transition-colors">
                Work with me
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[60svh] lg:min-h-full">
          <img src={stage.url} alt="Dorottya Litkei competing on stage at Pole Artistic Hungary" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-kit-black via-kit-black/20 to-transparent lg:bg-gradient-to-r" />
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" label="About">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              Hungarian precision.<br />Mediterranean stage.
            </h2>
            <div className="mt-8 space-y-6 text-kit-muted leading-relaxed max-w-xl">
              <p>
                Dorottya Litkei is a Hungarian professional pole sport athlete, coach and
                certified judge. She rose from her first amateur title to the European
                podium, and now trains competitors of every age group — from junior
                categories to masters.
              </p>
              <p>
                Her work bridges elite competition and education: choreography, strength,
                flexibility and competition preparation, delivered with the technical
                discipline of a judge who knows exactly how routines are scored.
              </p>
              <p>
                In 2026 she relocates her coaching base to Cyprus, opening her programme
                to an international student and audience base.
              </p>
            </div>
          </Reveal>
          <Reveal className="relative aspect-[4/5]">
            <img src={studioBw.url} alt="Black and white studio portrait of Dorottya Litkei in a lunge" className="h-full w-full object-cover" loading="lazy" />
          </Reveal>
        </div>
      </Section>

      {/* ATHLETE & COACH */}
      <Section id="athlete" label="Athlete & Coach" surface>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="relative aspect-[4/3] order-last lg:order-first overflow-hidden">
            <img src={competition.url} alt="Dorottya Litkei mid-routine at a national pole sport championship" className="h-full w-full object-cover object-center" loading="lazy" />
          </Reveal>
          <Reveal>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">Credentials</h2>
            <ul className="mt-10 divide-y divide-kit-line/60">
              {[
                ["European Champion", "Pole sport, elite category"],
                ["Multiple national titles", "Hungarian championship podiums across seasons"],
                ["Coach of the Year", "2024"],
                ["Certified judge", "National and international competitions"],
                ["IPSF and POSA compatible", "Training and judging methodology"],
                ["Competition coach", "Junior, senior, amateur and masters medallists"],
              ].map(([t, s]) => (
                <li key={t} className="py-5 grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                  <span className="font-serif text-xl">{t}</span>
                  <span className="text-[0.68rem] tracking-[0.2em] uppercase text-kit-muted">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* SOCIAL MEDIA */}
      <Section id="social" label="Social Media">
        <Reveal>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">Channels</h2>
          <p className="mt-4 max-w-xl text-kit-muted">
            Figures taken directly from Instagram and Facebook analytics, September 2026.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-px bg-kit-line/50 sm:grid-cols-3">
          <Channel icon={<Instagram className="h-4 w-4" />} name="Instagram" handle="@_dotti_poleanddance" href="https://www.instagram.com/_dotti_poleanddance" value="4,481" note="followers · +52.4% in 90 days" />
          <Channel icon={<Facebook className="h-4 w-4" />} name="Facebook" handle="Dotti Pole & Dance" href="https://www.facebook.com/share/19YCdHhhcJ/" value="657K" note="views in 90 days · 309K viewers" />
          <Channel icon={<Music2 className="h-4 w-4" />} name="TikTok" handle="@dorottya.23" href="https://www.tiktok.com/@dorottya.23" value={PLACEHOLDER} note="followers pending" />
        </div>
        <div className="mt-px grid gap-px bg-kit-line/50 sm:grid-cols-4">
          <Stat label="FB views · 28 days" value="507,637" />
          <Stat label="FB engagements · 28 days" value="26,552" />
          <Stat label="FB net new followers · 28 days" value="6,375" />
          <Stat label="Growth vs. prior period" value="+279%" />
        </div>
      </Section>

      {/* AUDIENCE */}
      <Section id="audience" label="Audience" surface>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">Who is watching</h2>
            <p className="mt-6 max-w-md text-kit-muted leading-relaxed">
              A predominantly female, 25–54 audience with real purchasing power — and an
              international reach: 94.9% of Reels viewers are not yet followers.
            </p>
            <div className="mt-10 relative aspect-[4/3]">
              <img src={sunset.url} alt="Dorottya Litkei training on a seaside pole at sunset" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <h3 className="text-[0.66rem] tracking-[0.3em] uppercase text-kit-muted">Top countries · Instagram followers</h3>
              <ul className="mt-5 space-y-3">
                {[["Hungary", "26.7%"], ["United States", "6.4%"], ["Argentina", "6.3%"], ["Italy", "5.3%"], ["Mexico", "4.7%"]].map(([c, v]) => (
                  <li key={c} className="flex items-center justify-between gap-6 border-b border-kit-line/50 pb-3">
                    <span className="font-serif text-lg">{c}</span>
                    <span className="font-serif text-lg text-gold">{v}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="grid gap-px bg-kit-line/50 sm:grid-cols-2">
              <Stat label="Female audience" value="84.2%" />
              <Stat label="Age 25–54" value="91.2%" />
              <Stat label="Reels reach · non-followers" value="94.9%" />
              <Stat label="FB 3-second views · 90 days" value="301,403" />
            </Reveal>

            <Reveal>
              <h3 className="text-[0.66rem] tracking-[0.3em] uppercase text-kit-muted">Age · Instagram followers</h3>
              <ul className="mt-5 space-y-3">
                {[["18–24", 3.8], ["25–34", 34.5], ["35–44", 40.2], ["45–54", 16.5], ["55–64", 3.4], ["65+", 1.6]].map(([a, v]) => (
                  <li key={a as string} className="grid grid-cols-[4rem_1fr_3.5rem] items-center gap-4 text-sm">
                    <span className="text-kit-muted">{a}</span>
                    <span className="h-1 bg-kit-line/50"><span className="block h-full bg-gold" style={{ width: `${((v as number) / 40.2) * 100}%` }} /></span>
                    <span className="text-right">{v}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-kit-muted">Top Reels markets: Italy 10%, Argentina 7.8%, Poland 7.2%, Germany 7.1%, France 6.4%.</p>
            </Reveal>

            <Reveal>
              <h3 className="text-[0.66rem] tracking-[0.3em] uppercase text-kit-muted">Top countries · Facebook audience</h3>
              <ul className="mt-5 space-y-3">
                {[["United States", "19.1%"], ["Mexico", "12.3%"], ["France", "7.5%"], ["Other", "61.4%"]].map(([c, v]) => (
                  <li key={c} className="flex items-center justify-between gap-6 border-b border-kit-line/50 pb-3">
                    <span className="font-serif text-lg">{c}</span>
                    <span className="font-serif text-lg text-gold">{v}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h3 className="text-[0.66rem] tracking-[0.3em] uppercase text-kit-muted">Age · Facebook audience</h3>
              <ul className="mt-5 space-y-3">
                {[["25–34", 29.4], ["35–44", 36.5], ["45–54", 19.1], ["Other", 15.0]].map(([a, v]) => (
                  <li key={a as string} className="grid grid-cols-[4rem_1fr_3.5rem] items-center gap-4 text-sm">
                    <span className="text-kit-muted">{a}</span>
                    <span className="h-1 bg-kit-line/50"><span className="block h-full bg-gold" style={{ width: `${((v as number) / 36.5) * 100}%` }} /></span>
                    <span className="text-right">{v}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-kit-muted">92.1% of the Facebook audience are not yet followers — reach well beyond the existing community.</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* CONTENT & BRAND VALUE */}
      <Section id="content" label="Content & Brand Value">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              What the camera sees
            </h2>
            <div className="mt-10 grid gap-px bg-kit-line/50 sm:grid-cols-2">
              <Tile title="Pole sport" body="Elite technique, competition-grade elements, clean lines." />
              <Tile title="Training" body="Strength, conditioning and flexibility sessions in studio and outdoors." />
              <Tile title="Education" body="Technique breakdowns and coaching content for athletes and instructors." />
              <Tile title="Performance" body="Stage routines, showcases and choreography films." />
              <Tile title="Competition" body="Preparation, backstage and podium moments across the season." />
              <Tile title="Athlete lifestyle" body="Travel, recovery, discipline and the Mediterranean training base." />
            </div>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-4">
            <img src={golden.url} alt="Dorottya Litkei posing on a gold pole at night" className="aspect-[3/4] w-full object-cover" loading="lazy" />
            <img src={floorBw.url} alt="Black and white floor work portrait" className="aspect-[3/4] w-full object-cover mt-10" loading="lazy" />
            <img src={daylight.url} alt="Daylight studio training with a high vertical split" className="aspect-[4/3] w-full object-cover col-span-2" loading="lazy" />
          </Reveal>
        </div>
      </Section>

      {/* PARTNERSHIP */}
      <Section id="partnership" label="Partnership Opportunities" surface>
        <Reveal>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">Ways to work together</h2>
        </Reveal>
        <div className="mt-12 grid gap-px bg-kit-line/50 md:grid-cols-2">
          <Offer
            n="01"
            title="Athlete ambassador"
            body="Long-term representation across competition season, training content and appearances, with kit worn on stage and in daily training."
          />
          <Offer
            n="02"
            title="Product integration"
            body="Apparel, grip, recovery and equipment placed in authentic training and performance footage, reviewed with an athlete's technical eye."
          />
          <Offer
            n="03"
            title="Content collaboration"
            body="Editorial shoots, campaign films, tutorial series and co-created social formats for pole sport and fitness audiences."
          />
          <Offer
            n="04"
            title="Community & events"
            body="Workshops, masterclasses, judging appearances and brand activations at competitions across Europe and Cyprus."
          />
        </div>
      </Section>

      {/* CONTACT */}
      <section id="contact" className="relative">
        <div className="relative grid lg:grid-cols-2">
          <div className="relative min-h-[50svh]">
            <img src={silhouette.url} alt="Silhouette of Dorottya Litkei on a pole against a lit window" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-kit-black via-transparent to-kit-black/40" />
          </div>
          <div className="px-6 py-20 md:px-12 lg:px-16 lg:py-28">
            <p className="text-[0.66rem] tracking-[0.3em] uppercase text-kit-muted">Contact</p>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              Let's build something<br /><span className="text-gold">worth watching.</span>
            </h2>
            <ul className="mt-12 space-y-5">
              <ContactRow icon={<Mail className="h-4 w-4" />} label="xxdorottyaxx@gmail.com" href="mailto:xxdorottyaxx@gmail.com" />
              <ContactRow icon={<Phone className="h-4 w-4" />} label="+36 30 180 5589" href="tel:+36301805589" />
              <ContactRow icon={<Globe className="h-4 w-4" />} label="Website" href="/" />
              <ContactRow icon={<Instagram className="h-4 w-4" />} label="Instagram" href="https://www.instagram.com/_dotti_poleanddance" />
              <ContactRow icon={<Facebook className="h-4 w-4" />} label="Facebook" href="https://www.facebook.com/share/19YCdHhhcJ/" />
              <ContactRow icon={<Music2 className="h-4 w-4" />} label="TikTok" href="https://www.tiktok.com/@dorottya.23" />
            </ul>
            <p className="mt-12 text-[0.62rem] tracking-[0.24em] uppercase text-kit-muted">
              Based in Larnaca, Cyprus · Available internationally
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  id, label, children, surface = false,
}: { id: string; label: string; children: React.ReactNode; surface?: boolean }) {
  return (
    <section id={id} className={surface ? "bg-kit-surface" : "bg-kit-black"}>
      <div className="mx-auto w-full max-w-[86rem] px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <p className="mb-12 text-[0.62rem] tracking-[0.34em] uppercase text-kit-muted">{label}</p>
        {children}
      </div>
    </section>
  );
}

function Channel({ icon, name, handle, href, value, note }: { icon: React.ReactNode; name: string; handle: string; href: string; value: string; note: string }) {
  return (
    <div className="bg-kit-black p-8">
      <div className="flex items-center gap-3 text-gold">{icon}
        <span className="text-[0.66rem] tracking-[0.24em] uppercase">{name}</span>
      </div>
      <p className="mt-6 font-serif text-3xl">{value}</p>
      <p className="mt-2 text-sm text-kit-muted">
        <a href={href} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">{handle}</a> · {note}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-kit-surface p-6">
      <p className="text-[0.62rem] tracking-[0.24em] uppercase text-kit-muted">{label}</p>
      <p className="mt-3 font-serif text-2xl">{value}</p>
    </div>
  );
}

function Tile({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-kit-black p-7">
      <h3 className="font-serif text-xl">{title}</h3>
      <p className="mt-2 text-sm text-kit-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Offer({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="bg-kit-surface p-8 md:p-10">
      <p className="text-[0.62rem] tracking-[0.3em] uppercase text-gold">{n}</p>
      <h3 className="mt-4 font-serif text-2xl md:text-3xl">{title}</h3>
      <p className="mt-4 text-kit-muted leading-relaxed">{body}</p>
    </div>
  );
}

function ContactRow({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <li>
      <a href={href} className="group inline-flex items-center gap-4 text-kit-ivory hover:text-gold transition-colors">
        <span className="text-gold">{icon}</span>
        <span className="font-serif text-lg">{label}</span>
      </a>
    </li>
  );
}
