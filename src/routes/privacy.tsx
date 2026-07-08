import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Dorottya Litkei" },
      { name: "description", content: "How we collect, use and protect your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="pt-40 pb-24 container-luxe max-w-3xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-6 font-serif text-5xl md:text-6xl">Privacy Policy</h1>
      <div className="prose prose-neutral mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>This page is maintained by Dorottya Litkei to explain how personal information is handled on this website.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Information we collect</h2>
        <p>We collect only the information you provide directly — for example, your name, email address and booking preferences when you contact us or request a lesson.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">How we use it</h2>
        <p>We use your information solely to respond to your enquiry, deliver services you have requested and, where you have opted in, send occasional updates.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Your rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by writing to studio@dorottyalitkei.com.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Contact</h2>
        <p>Questions about this policy? Email studio@dorottyalitkei.com.</p>
        <p className="text-sm">Last updated: 2026.</p>
      </div>
    </section>
  );
}
