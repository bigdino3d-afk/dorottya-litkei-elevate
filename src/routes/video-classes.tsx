import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/Reveal";
import { PlayCircle, Lock, ArrowUpRight } from "lucide-react";

export const REVTAG = "dorotty3fv";
export const revolutLink = (amountEuros: number, ref: string) =>
  `https://revolut.me/${REVTAG}?amount=${amountEuros}&currency=EUR&reference=${encodeURIComponent(ref)}`;

export const Route = createFileRoute("/video-classes")({
  head: () => ({
    meta: [
      { title: "Video Classes — Dorottya Litkei" },
      { name: "description", content: "On-demand pole sport video classes with Dorottya Litkei. €5 per class, paid instantly with Revolut." },
      { property: "og:title", content: "Video Classes — Dorottya Litkei" },
      { property: "og:description", content: "Train anywhere with on-demand pole sport classes. €5 per video." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/video-classes" }],
  }),
  component: VideoClasses;
});

type Video = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  preview_url: string | null;
  duration_label: string | null;
  level: string | null;
  price_cents: number;
  currency: string;
};

function VideoClasses() {
  const [videos, setVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("videos")
        .select("id,title,description,thumbnail_url,video_url,preview_url,duration_label,level,price_cents,currency")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setVideos((data ?? []) as Video[]);
    })();
  }, []);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Video Classes</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Train with me, <em className="text-gold not-italic font-medium">anywhere</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              On-demand classes filmed and coached by Dorottya. Every video is €5 —
              pay in seconds with Revolut, and the private link lands in your inbox.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-12 md:py-20">
        {videos === null ? (
          <p className="text-muted-foreground">Loading classes…</p>
        ) : videos.length === 0 ? (
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl">New classes are being filmed.</h2>
            <p className="mt-4 text-muted-foreground">
              The video library opens shortly. In the meantime, book a live session or
              get in touch to request a specific topic.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/booking" className="btn-luxe btn-luxe-hover">Book a lesson</Link>
              <Link to="/contact" className="btn-luxe btn-luxe-hover">Request a topic</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-luxe grid gap-10 md:grid-cols-3">
          <Step n="01" title="Pay €5 with Revolut">
            Tap the class you want. You'll be taken to Revolut ({`@${REVTAG}`}) with the
            amount and the class name pre-filled.
          </Step>
          <Step n="02" title="Send your receipt">
            Reply to the confirmation screen or email your Revolut reference so the class
            can be matched to you.
          </Step>
          <Step n="03" title="Watch, unlimited">
            You get a private streaming link with lifetime access — rewatch as often as
            you like, at your own pace.
          </Step>
        </div>
      </section>
    </>
  );
}

function VideoCard({ video }: { video: Video }) {
  const price = (video.price_cents / 100).toFixed(video.price_cents % 100 === 0 ? 0 : 2);
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-nude/40">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <PlayCircle className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-4 top-4 bg-ink/80 px-3 py-1 text-[0.62rem] tracking-[0.22em] uppercase text-white">
          €{price}
        </span>
      </div>

      <div className="mt-5">
        <div className="eyebrow text-muted-foreground flex gap-3">
          {video.level && <span>{video.level}</span>}
          {video.duration_label && <span>· {video.duration_label}</span>}
        </div>
        <h3 className="mt-2 font-serif text-2xl">{video.title}</h3>
        {video.description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{video.description}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href={revolutLink(video.price_cents / 100, video.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxe btn-luxe-hover inline-flex items-center gap-2"
          >
            <Lock className="h-3.5 w-3.5" /> Unlock €{price}
          </a>
          {video.preview_url && (
            <a
              href={video.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1 text-sm"
            >
              Preview <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-gold">{n}</p>
      <h3 className="mt-3 font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
