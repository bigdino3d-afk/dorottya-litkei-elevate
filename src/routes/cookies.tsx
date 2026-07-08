import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Dorottya Litkei" },
      { name: "description", content: "How this website uses cookies." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: Cookies,
});

function Cookies() {
  return (
    <section className="pt-40 pb-24 container-luxe max-w-3xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-6 font-serif text-5xl md:text-6xl">Cookie Policy</h1>
      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>This website uses a minimal set of cookies to keep the site working correctly and to help us understand how it is used.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Essential cookies</h2>
        <p>Required for basic functionality such as page navigation and form submission. These cannot be disabled.</p>
        <h2 className="font-serif text-2xl text-foreground mt-10">Analytics</h2>
        <p>We may use privacy-respecting analytics to understand aggregate usage. No personal identifiers are collected.</p>
        <p className="text-sm">Last updated: 2026.</p>
      </div>
    </section>
  );
}
