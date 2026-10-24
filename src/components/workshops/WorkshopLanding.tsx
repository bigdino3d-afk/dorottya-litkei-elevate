import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Download, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InquiryForm } from "./InquiryForm";
import { PHOTOS } from "@/lib/workshop-photos";
import { UI, LANG_LABEL } from "@/lib/workshop-i18n";
import { formatPrice, lines, localize, type KitAsset, type Lang } from "@/lib/workshop-content";
import { openDownloadUrl } from "@/lib/download";
import { KIT_BUCKET } from "@/lib/storage-upload";

export type LandingWorkshop = Record<string, unknown> & {
  id: string;
  category: string;
  title: string;
  booking_open: boolean;
  currency: string;
  published_fields?: string[];
  translations?: Record<string, Record<string, unknown>>;
};

export type LandingPage = Record<string, unknown> & {
  slug: string;
  city: string;
  country: string;
  credentials: unknown;
  languages: string[];
  locale: string;
  translations: Record<string, Record<string, unknown>>;
};

type Props = {
  page: LandingPage;
  workshops: LandingWorkshop[];
  assets: KitAsset[];
  lang: Lang;
  preview?: boolean;
  langHref?: (l: Lang) => ReactNode;
};

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/** Marks content that is visible only in the admin preview. */
function Gate({ hidden, children }: { hidden: boolean; children: ReactNode }) {
  if (!hidden) return <>{children}</>;
  return (
    <div className="relative outline outline-1 outline-dashed outline-gold/70 outline-offset-4">
      <span className="absolute -top-3 right-0 bg-gold px-2 py-0.5 text-[0.6rem] tracking-[0.2em] uppercase text-ink">Not public</span>
      {children}
    </div>
  );
}

function videoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

async function signed(path: string, download: boolean) {
  const { data, error } = await supabase.storage.from(KIT_BUCKET).createSignedUrl(path, 3600, download ? { download: true } : undefined);
  if (error || !data) throw new Error("File unavailable");
  return data.signedUrl;
}

function UploadedVideo({ asset }: { asset: KitAsset }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  if (!asset.storage_path) return null;
  if (src) return <video src={src} controls playsInline autoPlay className="w-full bg-ink" aria-label={asset.title} />;
  return (
    <button
      type="button"
      onClick={async () => {
        try { setSrc(await signed(asset.storage_path!, false)); } catch { setFailed(true); }
      }}
      className="inline-flex items-center gap-2 eyebrow text-gold hover:underline"
    >
      <Play className="h-3.5 w-3.5" /> {failed ? "Video unavailable" : asset.title}
    </button>
  );
}

export function WorkshopLanding({ page, workshops, assets, lang, preview = false, langHref }: Props) {
  const t = UI[lang];
  const [preset, setPreset] = useState<{ type: "acrobatic" | "spinning" | ""; n: number }>({ type: "", n: 0 });
  const p = (key: string) => str(localize(page, key, lang));
  const creds = (localize(page, "credentials", lang) as unknown[] | undefined) ?? [];
  const credentials = (Array.isArray(creds) ? creds : []).map(str).filter(Boolean);
  const acro = workshops.find((w) => w.category === "acrobatic");
  const spin = workshops.find((w) => w.category === "spinning");
  const names = {
    acrobatic: acro ? str(localize(acro, "title", lang)) : "Acrobatic Pole Tricks",
    spinning: spin ? str(localize(spin, "title", lang)) : "Spinning Pole",
  };
  const showLang = page.languages?.includes("el");

  function requestInfo(category: string) {
    setPreset((cur) => ({ type: category === "spinning" ? "spinning" : "acrobatic", n: cur.n + 1 }));
    document.getElementById("host")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div lang={lang === "el" ? "el" : "en"}>
      {/* HERO */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="container-luxe pt-28 md:pt-36 pb-16 md:pb-24 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center justify-between gap-4">
              {p("hero_eyebrow") && (
                <p className="eyebrow text-white/70"><span className="gold-line mr-4 align-middle" />{p("hero_eyebrow")}</p>
              )}
              {showLang && langHref && (
                <div className="flex gap-1 text-xs" aria-label={t.language}>
                  {(["en", "el"] as Lang[]).map((l) => (
                    <span key={l} className={l === lang ? "text-gold" : "text-white/60"}>{langHref(l)}</span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="mt-8 font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] tracking-[-0.02em]">
              {p("headline") || "Train with a European Champion."}
            </h1>
            {p("intro") && <p className="mt-8 max-w-xl text-base md:text-lg text-white/70 leading-relaxed">{p("intro")}</p>}

            <div className="mt-10 grid gap-3 sm:grid-cols-2 max-w-xl">
              {[acro, spin].filter(Boolean).map((w) => (
                <a key={w!.id} href={`#${w!.category}`} className="group border border-white/15 hover:border-gold p-5 transition-colors">
                  <p className="eyebrow text-gold">{w!.category === "acrobatic" ? "01" : "02"}</p>
                  <p className="mt-3 font-serif text-2xl leading-tight">{str(localize(w!, "title", lang))}</p>
                  {str(localize(w!, "tagline", lang)) && <p className="mt-2 text-xs text-white/60">{str(localize(w!, "tagline", lang))}</p>}
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href="#host" className="btn-luxe" style={{ background: "var(--gold)", borderColor: "var(--gold)", color: "var(--ink)" }}>
                {t.ctaHost}
              </a>
              <a href="#formats" className="btn-ghost-luxe hover:bg-white hover:text-ink">
                {t.ctaFormats} <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[230px] sm:max-w-[320px] lg:max-w-[460px]" style={{ aspectRatio: `${PHOTOS.hero.w} / ${PHOTOS.hero.h}` }}>
              <img src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} width={PHOTOS.hero.w} height={PHOTOS.hero.h} fetchPriority="high" className="h-full w-full object-contain" />
              <div className="absolute -bottom-4 -left-4 hidden md:block border border-gold/60 bg-ink/90 px-5 py-4">
                <p className="eyebrow text-gold">{page.city}{page.country ? `, ${page.country}` : ""}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="bg-cream py-20 md:py-28" aria-labelledby="instructor-title">
        <div className="container-luxe grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div className="mx-auto w-full max-w-[420px]" style={{ aspectRatio: `${PHOTOS.instructor.w} / ${PHOTOS.instructor.h}` }}>
            <img src={PHOTOS.instructor.src} alt={PHOTOS.instructor.alt} loading="lazy" width={PHOTOS.instructor.w} height={PHOTOS.instructor.h} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />{t.instructorEyebrow}</p>
            <h2 id="instructor-title" className="mt-6 font-serif text-4xl md:text-5xl leading-tight">
              {p("instructor_heading") && p("instructor_heading") !== t.instructorEyebrow ? p("instructor_heading") : "Dorottya Litkei"}
            </h2>
            {credentials.length > 0 && (
              <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2 border border-border">
                {credentials.map((c, i) => (
                  <li key={i} className="bg-background p-6">
                    <span className="eyebrow text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-3 font-serif text-xl leading-snug">{c}</p>
                  </li>
                ))}
              </ul>
            )}
            {p("instructor_bio") && <p className="mt-10 max-w-2xl text-muted-foreground leading-relaxed whitespace-pre-line">{p("instructor_bio")}</p>}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section id="formats" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="formats-title">
        <div className="container-luxe">
          <div className="max-w-2xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />{t.formatsEyebrow}</p>
            <h2 id="formats-title" className="mt-6 font-serif text-4xl md:text-5xl">{t.formatsTitle}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{t.formatsBody}</p>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {workshops.map((w) => (
              <FormatCard key={w.id} w={w} page={page} lang={lang} preview={preview} assets={assets.filter((a) => a.workshop_id === w.id)} onRequest={() => requestInfo(w.category)} />
            ))}
            {workshops.length === 0 && <p className="text-muted-foreground">{t.detailsSoon}</p>}
          </div>
        </div>
      </section>

      {/* HOSTING */}
      <section id="host" className="bg-cream py-20 md:py-28 scroll-mt-20" aria-labelledby="host-title">
        <div className="container-luxe grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />{t.hostEyebrow}</p>
            <h2 id="host-title" className="mt-6 font-serif text-4xl md:text-5xl leading-tight">{p("hosting_heading") || t.ctaHost}</h2>
            {p("hosting_text") && <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">{p("hosting_text")}</p>}
          </div>
          <InquiryForm t={t} pageSlug={page.slug} preset={preset} disabled={preview} workshopNames={names} />
        </div>
      </section>

      {/* KIT TEASER */}
      <section className="bg-ink text-white py-20 md:py-24">
        <div className="container-luxe grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-end">
          <div>
            <p className="eyebrow text-gold">{t.kitEyebrow}</p>
            <h2 className="mt-6 font-serif text-3xl md:text-5xl leading-tight">{t.kitTitle}</h2>
            <p className="mt-6 max-w-2xl text-white/65 leading-relaxed">{t.kitBody}</p>
          </div>
          <div className="md:text-right">
            <Link to="/studio-kit" className="btn-ghost-luxe hover:bg-white hover:text-ink">
              {t.kitCta} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormatCard({
  w,
  page,
  lang,
  preview,
  assets,
  onRequest,
}: {
  w: LandingWorkshop;
  page: LandingPage;
  lang: Lang;
  preview: boolean;
  assets: KitAsset[];
  onRequest: () => void;
}) {
  const t = UI[lang];
  const dark = w.category === "acrobatic";
  const photo = w.category === "spinning" ? PHOTOS.spinning : PHOTOS.acrobatic;
  const pub = (k: string) => !preview || (w.published_fields ?? []).includes(k);
  const val = (k: string) => str(localize(w, k, lang));
  const has = (k: string) => !!val(k);
  const hidden = (k: string) => preview && !pub(k);

  const price = formatPrice(w.price_amount as number | null, w.currency, page.locale);
  const facts: [string, string, string][] = [
    ["dates", t.dates, val("dates")],
    ["venue", t.venue, val("venue")],
    ["location", t.location, val("location")],
    ["skill_level", t.skillLevel, val("skill_level")],
    ["duration", t.duration, val("duration")],
    ["capacity", t.capacity, val("capacity")],
    ["price_amount", t.price, price ? `${price}${val("price_note") ? ` · ${val("price_note")}` : ""}` : ""],
    ["booking_deadline", t.deadline, val("booking_deadline")],
  ];
  const visibleFacts = facts.filter(([, , v]) => v);
  const objectives = lines(val("learning_objectives"));
  const infoSheets = assets.filter((a) => a.asset_type === "info_sheet" && a.storage_path);
  const videos = assets.filter((a) => a.asset_type === "video" && a.storage_path);
  const videoUrl = val("video_url");
  const embed = videoUrl ? videoEmbed(videoUrl) : null;
  const bookingUrl = val("booking_url");
  const contact = val("contact_email");
  const anyDetail = visibleFacts.length > 0;

  const tone = dark ? "bg-ink text-white" : "bg-background text-foreground border border-gold/40";
  const sub = dark ? "text-white/65" : "text-muted-foreground";
  const line = dark ? "border-white/12" : "border-border";

  return (
    <article id={w.category} className={`${tone} scroll-mt-24 flex flex-col`} aria-labelledby={`${w.id}-title`}>
      <div className="relative overflow-hidden bg-ink" style={{ aspectRatio: "4 / 3" }}>
        <img src={photo.src} alt={photo.alt} loading="lazy" width={photo.w} height={photo.h} className="absolute inset-0 h-full w-full object-contain" />
        <span className={`absolute top-5 left-5 eyebrow px-3 py-1.5 ${dark ? "bg-gold text-ink" : "bg-background text-gold"}`}>
          {w.category === "acrobatic" ? "01 · Acrobatic" : w.category === "spinning" ? "02 · Spinning" : "Workshop"}
        </span>
        {w.booking_open && <span className="absolute top-5 right-5 eyebrow px-3 py-1.5 bg-background text-ink">{t.bookingsOpen}</span>}
      </div>

      <div className="p-7 md:p-10 flex-1 flex flex-col gap-7">
        <div>
          <h3 id={`${w.id}-title`} className="font-serif text-3xl md:text-4xl leading-tight">{val("title")}</h3>
          {has("tagline") && <Gate hidden={hidden("tagline")}><p className={`mt-3 eyebrow ${dark ? "text-gold" : "text-gold"}`}>{val("tagline")}</p></Gate>}
        </div>
        {has("description") && <Gate hidden={hidden("description")}><p className={`${sub} leading-relaxed whitespace-pre-line`}>{val("description")}</p></Gate>}

        {objectives.length > 0 && (
          <Gate hidden={hidden("learning_objectives")}>
            <div>
              <p className="eyebrow text-gold">{t.objectives}</p>
              <ul className="mt-4 space-y-2.5">
                {objectives.map((o, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed"><span className="mt-2 h-px w-4 shrink-0 bg-gold" />{o}</li>
                ))}
              </ul>
            </div>
          </Gate>
        )}

        {anyDetail ? (
          <dl className={`grid sm:grid-cols-2 border-t ${line}`}>
            {visibleFacts.map(([k, label, v]) => (
              <Gate key={k} hidden={hidden(k)}>
                <div className={`py-4 border-b ${line} sm:pr-6`}>
                  <dt className="eyebrow text-gold">{label}</dt>
                  <dd className="mt-1.5 text-sm whitespace-pre-line">{v}</dd>
                </div>
              </Gate>
            ))}
          </dl>
        ) : (
          <p className={`text-sm italic ${sub}`}>{t.detailsSoon}</p>
        )}

        {has("prerequisites") && (
          <Gate hidden={hidden("prerequisites")}>
            <div><p className="eyebrow text-gold">{t.prerequisites}</p><p className={`mt-2 text-sm ${sub} whitespace-pre-line`}>{val("prerequisites")}</p></div>
          </Gate>
        )}
        {has("requirements") && (
          <Gate hidden={hidden("requirements")}>
            <div><p className="eyebrow text-gold">{t.requirements}</p><p className={`mt-2 text-sm ${sub} whitespace-pre-line`}>{val("requirements")}</p></div>
          </Gate>
        )}

        {videoUrl && (
          <Gate hidden={hidden("video_url")}>
            {embed ? (
              <div className="aspect-video bg-ink">
                <iframe src={embed} title={`${val("title")} — demonstration`} className="h-full w-full" allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
              </div>
            ) : (
              <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 eyebrow text-gold hover:underline"><Play className="h-3.5 w-3.5" /> {t.watchDemo}</a>
            )}
          </Gate>
        )}
        {videos.map((a) => <UploadedVideo key={a.id} asset={a} />)}

        <div className="mt-auto pt-2 flex flex-wrap gap-3">
          {w.booking_open && bookingUrl && (
            <Gate hidden={hidden("booking_url")}>
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-luxe" style={{ background: "var(--gold)", borderColor: "var(--gold)", color: "var(--ink)" }}>{t.bookNow}</a>
            </Gate>
          )}
          <button type="button" onClick={onRequest} className={dark ? "btn-ghost-luxe hover:bg-white hover:text-ink" : "btn-luxe btn-luxe-hover"}>{t.requestInfo}</button>
          {infoSheets.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={async () => {
                try { openDownloadUrl(await signed(a.storage_path!, true)); } catch { alert("This file is currently unavailable."); }
              }}
              className={`inline-flex items-center gap-2 eyebrow ${dark ? "text-white/80" : "text-foreground/80"} hover:text-gold px-2`}
            >
              <Download className="h-3.5 w-3.5" /> {t.infoSheet}
            </button>
          ))}
        </div>
        {contact && (
          <Gate hidden={hidden("contact_email")}>
            <a href={`mailto:${contact}`} className={`text-sm ${sub} hover:text-gold`}>{contact}</a>
          </Gate>
        )}
      </div>
    </article>
  );
}
