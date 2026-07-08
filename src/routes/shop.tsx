import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import g1 from "@/assets/g1.jpg";
import grip from "@/assets/grip.jpg";
import studio from "@/assets/studio.jpg";
import stage from "@/assets/stage.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Dorottya Litkei" },
      { name: "description", content: "Online courses, training programs, grip products, PDF guides and gift cards." },
      { property: "og:title", content: "Shop — Dorottya Litkei" },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const PRODUCTS = [
  { name: "Foundation Course", price: "€149", tag: "Online Course", img: studio },
  { name: "Competition Preparation Program (12 weeks)", price: "€349", tag: "Program", img: stage },
  { name: "Signature Grip Powder", price: "€28", tag: "Equipment", img: grip },
  { name: "Mobility Blueprint · PDF", price: "€19", tag: "Guide", img: g1 },
  { name: "Nutrition Guide for Pole Athletes · PDF", price: "€24", tag: "Guide", img: studio },
  { name: "Gift Card", price: "from €50", tag: "Gift", img: stage },
];

function Shop() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Shop</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              A quiet <em className="text-gold not-italic font-medium">collection</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Online courses, training programs, curated equipment and PDF
              guides. Full checkout with Stripe and PayPal is arriving with our
              next phase.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 80} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" loading="lazy" />
              </div>
              <p className="mt-6 eyebrow text-gold">{p.tag}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight">{p.name}</h2>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-serif text-xl">{p.price}</span>
                <button className="eyebrow link-underline">Notify me</button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
