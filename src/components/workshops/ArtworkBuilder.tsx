import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  ARTWORK_FORMATS,
  EMPTY_FIELDS,
  canvasToBlob,
  drawArtwork,
  ensureArtworkFonts,
  loadImage,
  posterPdf,
  type ArtworkCategory,
  type ArtworkFields,
  type ArtworkFormat,
} from "@/lib/artwork";
import { PHOTOS } from "@/lib/workshop-photos";
import { deliverFile } from "@/lib/download";

const PHOTO_CHOICES: Record<ArtworkCategory, { key: keyof typeof PHOTOS; label: string }[]> = {
  acrobatic: [
    { key: "acrobatic", label: "Competition inversion" },
    { key: "studio", label: "Studio inversion" },
    { key: "hero", label: "On stage" },
  ],
  spinning: [
    { key: "spinning", label: "Golden pole" },
    { key: "split", label: "Studio split" },
    { key: "hero", label: "On stage" },
  ],
};

const FIELD_LABELS: [keyof ArtworkFields, string, string][] = [
  ["studioName", "Host studio name", "e.g. your studio's name"],
  ["dateTime", "Workshop date & time", "e.g. Saturday 14 March · 11:00–13:30"],
  ["location", "Studio location", "Street, area, city"],
  ["skillLevel", "Skill level", "As agreed with Dorottya's management"],
  ["deadline", "Booking deadline (optional)", "e.g. Book by 1 March"],
  ["booking", "Booking link or contact", "e.g. yourstudio.gr/book or +30 …"],
  ["city", "City", "Athens"],
];

export function ArtworkBuilder() {
  const [category, setCategory] = useState<ArtworkCategory>("acrobatic");
  const [format, setFormat] = useState<ArtworkFormat>("instagram_post");
  const [photoKey, setPhotoKey] = useState<keyof typeof PHOTOS>("acrobatic");
  const [fields, setFields] = useState<ArtworkFields>(EMPTY_FIELDS);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "png" | "pdf">(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setPhotoKey(PHOTO_CHOICES[category][0].key), [category]);

  async function render(target: HTMLCanvasElement, scale: number, placeholders: boolean) {
    await ensureArtworkFonts();
    const [photo, logo] = await Promise.all([loadImage(PHOTOS[photoKey].src), logoUrl ? loadImage(logoUrl) : Promise.resolve(null)]);
    drawArtwork(target, { format, category, fields, photo, logo, placeholders }, scale);
  }

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const { w, h } = ARTWORK_FORMATS[format];
    const scale = Math.min(1, 1100 / Math.max(w, h));
    let cancelled = false;
    const id = setTimeout(() => {
      if (!cancelled) render(c, scale, true).catch(() => undefined);
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, category, photoKey, fields, logoUrl]);

  async function exportFile(kind: "png" | "pdf") {
    setBusy(kind);
    try {
      const c = document.createElement("canvas");
      await render(c, 1, false);
      const png = await canvasToBlob(c);
      const base = `dorottya-litkei-${category}-${format.replace("_", "-")}${fields.city ? `-${fields.city.toLowerCase().replace(/\s+/g, "-")}` : ""}`;
      if (kind === "pdf") await deliverFile(await posterPdf(png), `${base}.pdf`);
      else await deliverFile(png, `${base}.png`);
    } catch {
      toast.error("The artwork could not be exported. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const input = "mt-1.5 w-full bg-transparent border-b border-border py-2.5 text-sm focus:border-gold outline-none";
  const chip = (on: boolean) => `h-10 px-4 rounded-full border text-xs tracking-[0.16em] uppercase transition-colors ${on ? "bg-ink text-primary-foreground border-ink" : "border-border hover:border-gold"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-7">
        <fieldset>
          <legend className="eyebrow">Workshop</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip(category === "acrobatic")} onClick={() => setCategory("acrobatic")}>Acrobatic Pole Tricks</button>
            <button type="button" className={chip(category === "spinning")} onClick={() => setCategory("spinning")}>Spinning Pole</button>
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow">Format</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(ARTWORK_FORMATS) as ArtworkFormat[]).map((f) => (
              <button key={f} type="button" className={chip(format === f)} onClick={() => setFormat(f)}>{ARTWORK_FORMATS[f].label}</button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{ARTWORK_FORMATS[format].note}</p>
        </fieldset>
        <fieldset>
          <legend className="eyebrow">Photo</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PHOTO_CHOICES[category].map((p) => (
              <button key={p.key} type="button" onClick={() => setPhotoKey(p.key)} className={`relative h-20 w-16 overflow-hidden border-2 ${photoKey === p.key ? "border-gold" : "border-transparent"}`} aria-label={p.label} aria-pressed={photoKey === p.key}>
                <img src={PHOTOS[p.key].src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          {FIELD_LABELS.map(([k, label, ph]) => (
            <label key={k} className={k === "booking" || k === "location" ? "sm:col-span-2" : undefined}>
              <span className="eyebrow">{label}</span>
              <input value={fields[k]} placeholder={ph} onChange={(e) => setFields({ ...fields, [k]: e.target.value })} className={input} maxLength={90} />
            </label>
          ))}
        </div>

        <div>
          <span className="eyebrow">Studio logo (PNG with transparency works best)</span>
          <div className="mt-3 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 h-10 px-4 border border-border eyebrow cursor-pointer hover:border-gold hover:text-gold">
              <Upload className="h-3.5 w-3.5" /> {logoUrl ? "Replace logo" : "Add logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (logoUrl) URL.revokeObjectURL(logoUrl);
                  setLogoUrl(URL.createObjectURL(f));
                }}
              />
            </label>
            {logoUrl && (
              <button type="button" onClick={() => { URL.revokeObjectURL(logoUrl); setLogoUrl(null); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Your logo stays on your device — it is not uploaded anywhere.</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" disabled={!!busy} onClick={() => exportFile("png")} className="btn-luxe btn-luxe-hover disabled:opacity-60">
            {busy === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PNG
          </button>
          {format === "poster" && (
            <button type="button" disabled={!!busy} onClick={() => exportFile("pdf")} className="inline-flex items-center gap-2 h-[3.15rem] px-6 rounded-full border border-ink eyebrow hover:bg-ink hover:text-primary-foreground transition-colors disabled:opacity-60">
              {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Print-ready PDF
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Empty fields are left out of the downloaded artwork; the bracketed hints only appear in the preview.</p>
      </div>

      <div className="order-first lg:order-none lg:sticky lg:top-28 self-start">
        <div className="bg-cream p-4 md:p-6 grid place-items-center">
          <canvas ref={canvasRef} className="max-w-full h-auto max-h-[78vh] shadow-luxe" style={{ aspectRatio: `${ARTWORK_FORMATS[format].w} / ${ARTWORK_FORMATS[format].h}` }} aria-label={`Preview of the ${ARTWORK_FORMATS[format].label} artwork`} role="img" />
        </div>
      </div>
    </div>
  );
}
