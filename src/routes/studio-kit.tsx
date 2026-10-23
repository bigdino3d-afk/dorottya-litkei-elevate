import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, Loader2, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { openStudioKit } from "@/lib/workshops.functions";
import { AssetLibrary } from "@/components/workshops/AssetLibrary";
import { ArtworkBuilder } from "@/components/workshops/ArtworkBuilder";
import { KIT_BUCKET } from "@/lib/storage-upload";
import type { KitAsset } from "@/lib/workshop-content";

export const Route = createFileRoute("/studio-kit")({
  validateSearch: (s: Record<string, unknown>): { key?: string } =>
    typeof s.key === "string" && /^[a-f0-9]{16,128}$/i.test(s.key) ? { key: s.key } : {},
  head: () => ({
    meta: [
      { title: "Studio Marketing Kit — Dorottya Litkei Workshops" },
      { name: "description", content: "Ready-to-publish artwork, captions and announcements for studios hosting or promoting Dorottya Litkei's pole workshops." },
      { property: "og:title", content: "Studio Marketing Kit — Dorottya Litkei Workshops" },
      { property: "og:description", content: "Promotional materials for partner studios hosting Dorottya Litkei's workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudioKitPage,
});

const ASSET_COLUMNS =
  "id, workshop_id, category, asset_type, title, description, instructions, language, storage_path, file_name, mime_type, size_bytes, width, height, preview_path, text_content, visibility, published, sort_order";

async function loadPublicAssets(): Promise<KitAsset[]> {
  const { data, error } = await supabase
    .from("workshop_assets")
    .select(ASSET_COLUMNS)
    .eq("visibility", "public")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  const rows = (data ?? []) as KitAsset[];
  const paths = Array.from(new Set(rows.flatMap((a) => [a.storage_path, a.preview_path]).filter((p): p is string => !!p)));
  const map = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabase.storage.from(KIT_BUCKET).createSignedUrls(paths, 3600, { download: true });
    for (const s of signed ?? []) if (s.path && s.signedUrl) map.set(s.path, s.signedUrl);
  }
  return rows.map((a) => ({
    ...a,
    url: a.storage_path ? map.get(a.storage_path) ?? null : null,
    previewUrl: a.preview_path ? map.get(a.preview_path) ?? null : null,
  }));
}

const SESSION_KEY = "studio-kit-code";

function StudioKitPage() {
  const { key } = Route.useSearch();
  const open = useServerFn(openStudioKit);
  const [publicAssets, setPublicAssets] = useState<KitAsset[] | null>(null);
  const [publicError, setPublicError] = useState(false);
  const [studio, setStudio] = useState<{ name: string; assets: KitAsset[] } | null>(null);
  const [code, setCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicAssets().then(setPublicAssets).catch(() => { setPublicAssets([]); setPublicError(true); });
  }, []);

  async function unlock(withCode: string, silent = false) {
    if (!key) return;
    setUnlocking(true);
    setUnlockError(null);
    try {
      const res = await open({ data: { token: key, code: withCode } });
      setStudio({ name: res.studioName, assets: res.assets as KitAsset[] });
      sessionStorage.setItem(`${SESSION_KEY}:${key}`, withCode);
    } catch (err) {
      sessionStorage.removeItem(`${SESSION_KEY}:${key}`);
      if (!silent) setUnlockError(err instanceof Error && err.message.length < 220 ? err.message : "The kit could not be opened. Please try again.");
    } finally {
      setUnlocking(false);
    }
  }

  useEffect(() => {
    if (!key) return;
    const saved = sessionStorage.getItem(`${SESSION_KEY}:${key}`);
    if (saved) unlock(saved, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const assets = studio ? studio.assets : publicAssets;

  return (
    <>
      <section className="bg-ink text-white pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-luxe">
          <p className="eyebrow text-gold"><span className="gold-line mr-4 align-middle" />Dorottya Litkei · International Workshops</p>
          <h1 className="mt-8 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1] max-w-4xl">Studio Marketing Kit</h1>
          <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">
            Ready-to-publish materials for studios hosting or promoting the Acrobatic Pole Tricks and Spinning Pole workshops. Download the artwork and copy, add your studio's details, and post on your own channels.
          </p>
          <ol className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3 border border-white/10 max-w-4xl">
            {[
              ["01", "Choose the workshop", "Filter by Acrobatic or Spinning, or download a full package."],
              ["02", "Add your details", "Use the artwork builder for your studio name, logo, date and booking link."],
              ["03", "Publish", "Post the artwork with the ready-made captions and announcement."],
            ].map(([n, h, b]) => (
              <li key={n} className="bg-ink p-6">
                <span className="eyebrow text-gold">{n}</span>
                <p className="mt-3 font-serif text-xl">{h}</p>
                <p className="mt-2 text-sm text-white/60">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {key && !studio && (
        <section className="bg-cream py-12">
          <div className="container-luxe max-w-2xl">
            <div className="bg-background border border-border p-8">
              <div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-gold" /><h2 className="font-serif text-2xl">Your studio's private kit</h2></div>
              <p className="mt-3 text-sm text-muted-foreground">Enter the access code you received from Dorottya's management to open the materials prepared for your studio.</p>
              <form
                className="mt-6 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => { e.preventDefault(); if (code.trim()) unlock(code.trim()); }}
              >
                <label className="flex-1">
                  <span className="sr-only">Access code</span>
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX" autoComplete="one-time-code" className="w-full h-12 bg-transparent border border-border px-4 tracking-[0.3em] uppercase focus:border-gold outline-none" />
                </label>
                <button type="submit" disabled={unlocking || !code.trim()} className="btn-luxe btn-luxe-hover disabled:opacity-50">
                  {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Open kit
                </button>
              </form>
              {unlockError && <p role="alert" className="mt-4 text-sm text-destructive">{unlockError}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24" aria-labelledby="library-title">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="eyebrow"><span className="gold-line mr-4 align-middle" />{studio ? `Prepared for ${studio.name}` : "Download library"}</p>
              <h2 id="library-title" className="mt-5 font-serif text-4xl">Materials</h2>
            </div>
            {!key && <p className="text-sm text-muted-foreground max-w-sm">Partner studios receive a private link and access code for additional materials.</p>}
          </div>
          <div className="mt-10">
            {assets === null ? (
              <p className="text-muted-foreground inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading materials…</p>
            ) : (
              <AssetLibrary
                assets={assets}
                emptyText={publicError ? "The materials could not be loaded. Please refresh the page." : "The materials for this kit are being prepared and will appear here once approved. In the meantime you can create artwork with the builder below."}
              />
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24" aria-labelledby="builder-title">
        <div className="container-luxe">
          <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Artwork builder</p>
          <h2 id="builder-title" className="mt-5 font-serif text-4xl">Add your studio's details.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Create branded artwork in the correct sizes for Instagram, Facebook and print. Only enter details that have been confirmed with Dorottya's management.</p>
          <div className="mt-12"><ArtworkBuilder /></div>
        </div>
      </section>

      <section className="bg-ink text-white py-16">
        <div className="container-luxe flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-serif text-2xl md:text-3xl max-w-2xl">Not a partner studio yet? Ask about hosting a workshop.</p>
          <Link to="/workshops/$slug" params={{ slug: "athens" }} hash="host" className="btn-ghost-luxe hover:bg-white hover:text-ink">Hosting inquiry</Link>
        </div>
      </section>
    </>
  );
}
