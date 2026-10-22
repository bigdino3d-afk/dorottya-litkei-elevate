import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getWorkshopPage } from "@/lib/workshops.functions";
import { WorkshopLanding, type LandingPage, type LandingWorkshop } from "@/components/workshops/WorkshopLanding";
import { WorkshopMissing, WorkshopLoadError } from "@/components/workshops/WorkshopFallbacks";
import { LANG_LABEL } from "@/lib/workshop-i18n";
import { OG_IMAGE_PATH } from "@/lib/workshop-photos";
import type { Lang } from "@/lib/workshop-content";

export const Route = createFileRoute("/workshops/$slug")({
  validateSearch: (s: Record<string, unknown>): { lang?: Lang } => (s.lang === "el" ? { lang: "el" } : {}),
  loader: async ({ params }) => {
    const data = await getWorkshopPage({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Workshop unavailable — Dorottya Litkei" }, { name: "robots", content: "noindex" }] };
    }
    const city = loaderData.page.city || params.slug;
    const title = `${city} Pole Workshops with European Champion Dorottya Litkei`;
    const description = `Acrobatic Pole Tricks and Spinning Pole workshops in ${city} with Dorottya Litkei — European Champion, six-time Hungarian Champion, international instructor and judge. Studios: host a workshop and get a ready-made marketing kit.`;
    const image = loaderData.origin ? `${loaderData.origin}${OG_IMAGE_PATH}` : null;
    const url = loaderData.origin ? `${loaderData.origin}/workshops/${params.slug}` : `/workshops/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:alt", content: "Dorottya Litkei on stage beside the competition pole" },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            about: { "@type": "Person", name: "Dorottya Litkei", jobTitle: "Pole Sport Coach and Athlete" },
          }),
        },
      ],
    };
  },
  component: WorkshopPage,
  notFoundComponent: WorkshopMissing,
  errorComponent: WorkshopLoadError,
});

function WorkshopPage() {
  const data = Route.useLoaderData();
  const { lang = "en" } = Route.useSearch();
  const { slug } = Route.useParams();
  const effective: Lang = lang === "el" && data.page.languages?.includes("el") ? "el" : "en";
  return (
    <WorkshopLanding
      page={data.page as unknown as LandingPage}
      workshops={data.workshops as LandingWorkshop[]}
      assets={data.assets}
      lang={effective}
      langHref={(l) => (
        <Link to="/workshops/$slug" params={{ slug }} search={l === "el" ? { lang: "el" } : {}} className="px-2 py-1 hover:text-gold" hrefLang={l} aria-current={l === effective ? "true" : undefined}>
          {LANG_LABEL[l]}
        </Link>
      )}
    />
  );
}
