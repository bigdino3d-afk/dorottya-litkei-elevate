import { createFileRoute, Link } from "@tanstack/react-router";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import grip from "@/assets/grip.jpg";
import studio from "@/assets/studio.jpg";
import stage from "@/assets/stage.jpg";
import hero from "@/assets/hero.jpg";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Dorottya Litkei" },
      { name: "description", content: "Editorial photography from the studio, stage and competition floor." },
      { property: "og:title", content: "Gallery — Dorottya Litkei" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const IMAGES = [
  { src: hero, alt: "Elite pole hold", aspect: "aspect-[3/4]" },
  { src: g2, alt: "Silhouette in motion", aspect: "aspect-[4/5]" },
  { src: grip, alt: "Chalked grip", aspect: "aspect-[4/3]" },
  { src: g1, alt: "Studio pose", aspect: "aspect-[3/4]" },
  { src: stage, alt: "Stage performance", aspect: "aspect-[4/3]" },
  { src: studio, alt: "Studio stretch", aspect: "aspect-[16/10]" },
  { src: g3, alt: "Pointed foot detail", aspect: "aspect-[3/4]" },
  { src: g4, alt: "Group class", aspect: "aspect-[4/5]" },
];

function Gallery() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Gallery</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Motion, <em className="text-gold not-italic font-medium">still</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Editorial and documentary photography from the studio, stage and
              training floor.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {IMAGES.map((img, i) => (
            <Reveal key={i} delay={(i % 4) * 80} className={`mb-4 md:mb-6 break-inside-avoid overflow-hidden group relative ${img.aspect}`}>
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-luxe py-24 text-center">
          <Reveal className="max-w-xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl">Want to be next?</h2>
            <p className="mt-6 text-muted-foreground">Book a session and create your own story.</p>
            <Link to="/booking" className="btn-luxe btn-luxe-hover mt-10">Book a Lesson</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
