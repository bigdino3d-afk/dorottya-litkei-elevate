import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Dorottya Litkei" },
      { name: "description", content: "Terms of service for coaching, workshops and online products." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <section className="pt-40 pb-24 container-luxe max-w-3xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-6 font-serif text-5xl md:text-6xl">Terms of Service</h1>
      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>By booking a session, workshop or product with Dorottya Litkei you agree to the following terms.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Bookings and cancellations</h2>
        <p>Sessions may be rescheduled or cancelled at no cost up to 24 hours in advance. Late cancellations may be charged in full.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Health and safety</h2>
        <p>Pole sport carries inherent physical risk. Clients confirm they are medically fit to train and agree to follow all safety instructions provided by the coach.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Intellectual property</h2>
        <p>All course materials, programs and written content remain the property of Dorottya Litkei and may not be redistributed without written consent.</p>
        <p className="text-sm">Last updated: 2026.</p>
      </div>
    </section>
  );
}
