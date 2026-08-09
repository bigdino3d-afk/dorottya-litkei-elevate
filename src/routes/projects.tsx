import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Dorottya Litkei" },
      { name: "description", content: "Current and past projects: performances, collaborations, competition campaigns and studio initiatives." },
      { property: "og:title", content: "Projects — Dorottya Litkei" },
      { property: "og:description", content: "Performances, collaborations, competition campaigns and studio initiatives by Dorottya Litkei." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: Projects,
});

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  cover_image_url: string | null;
  external_url: string | null;
  year: string | null;
  status: string;
};

function Projects() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, slug, title, summary, body, cover_image_url, external_url, year, status")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setProjects((data ?? []) as Project[]);
    })();
  }, []);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Projects</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Work in <em className="text-gold not-italic font-medium">motion</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Performances, collaborations, competition campaigns and studio
              initiatives — current, upcoming and completed.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20">
        {projects === null ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : projects.length === 0 ? (
          <div className="text-center max-w-md mx-auto py-20">
            <p className="eyebrow text-muted-foreground">Coming soon</p>
            <h2 className="mt-4 font-serif text-3xl">The first projects land shortly.</h2>
          </div>
        ) : (
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 100}>
                <article className="group">
                  {p.cover_image_url && (
                    <div className="aspect-[4/5] overflow-hidden bg-cream">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="mt-6 flex items-center gap-4 eyebrow text-muted-foreground">
                    <span className="text-gold capitalize">{p.status}</span>
                    {p.year && <span className="h-1 w-1 rounded-full bg-border" />}
                    {p.year && <span>{p.year}</span>}
                  </div>
                  <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">{p.title}</h2>
                  {p.summary && (
                    <p className="mt-4 text-muted-foreground leading-relaxed">{p.summary}</p>
                  )}
                  {p.body && (
                    <p className="mt-4 whitespace-pre-line leading-relaxed">{p.body}</p>
                  )}
                  {p.external_url && (
                    <a
                      href={p.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 eyebrow link-underline text-gold"
                    >
                      Learn more <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
