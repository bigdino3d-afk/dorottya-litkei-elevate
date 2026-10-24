// Canvas renderer for studio-customisable workshop artwork (browser only).
// Colours mirror the site's brand tokens: ink, ivory and champagne gold.

export type ArtworkFormat = "instagram_post" | "instagram_story" | "facebook_post" | "poster";
export type ArtworkCategory = "acrobatic" | "spinning";

export const ARTWORK_FORMATS: Record<ArtworkFormat, { label: string; w: number; h: number; note: string }> = {
  instagram_post: { label: "Instagram post", w: 1080, h: 1080, note: "1080 × 1080 px · PNG" },
  instagram_story: { label: "Instagram Story", w: 1080, h: 1920, note: "1080 × 1920 px · PNG" },
  facebook_post: { label: "Facebook post", w: 1200, h: 630, note: "1200 × 630 px · PNG" },
  poster: { label: "A4 poster", w: 2480, h: 3508, note: "A4 · 300 dpi · PNG or PDF" },
};

export const ARTWORK_TITLES: Record<ArtworkCategory, { title: string; sub: string }> = {
  acrobatic: { title: "Acrobatic Pole Tricks", sub: "Strength · Technique · Controlled execution" },
  spinning: { title: "Spinning Pole", sub: "Control · Flow · Musicality" },
};

export type ArtworkFields = {
  city: string;
  studioName: string;
  dateTime: string;
  location: string;
  skillLevel: string;
  deadline: string;
  booking: string;
};

export const EMPTY_FIELDS: ArtworkFields = {
  city: "Athens",
  studioName: "",
  dateTime: "",
  location: "",
  skillLevel: "",
  deadline: "",
  booking: "",
};

const INK = "#141312";
const IVORY = "#F5F1E8";
const GOLD = "#C8A96A";
const MUTED = "rgba(245,241,232,0.62)";
const FAINT = "rgba(245,241,232,0.32)";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

export async function ensureArtworkFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    document.fonts.load('400 64px "Playfair Display"'),
    document.fonts.load('italic 400 64px "Playfair Display"'),
    document.fonts.load('500 24px "Inter"'),
    document.fonts.load('400 24px "Inter"'),
  ]).catch(() => undefined);
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, fx = 0.5, fy = 0.3) {
  const r = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / r;
  const sh = h / r;
  const sx = (img.naturalWidth - sw) * fx;
  const sy = (img.naturalHeight - sh) * fy;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      out.push(line);
      line = w;
    } else line = test;
  }
  if (line) out.push(line);
  return out;
}

export type ArtworkInput = {
  format: ArtworkFormat;
  category: ArtworkCategory;
  fields: ArtworkFields;
  photo: HTMLImageElement;
  logo?: HTMLImageElement | null;
  /** Show “[Add …]” hints for empty fields (preview only). Exports omit empty fields. */
  placeholders: boolean;
};

export function drawArtwork(canvas: HTMLCanvasElement, input: ArtworkInput, scale = 1) {
  const { w: W, h: H } = ARTWORK_FORMATS[input.format];
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  const portrait = H > W;
  const landscape = W > H * 1.4;
  const u = Math.min(W, H) / 1080; // base unit
  const pad = (landscape ? 56 : portrait ? 84 : 72) * (landscape ? W / 1200 : u);

  const base = landscape ? W / 1200 : u;
  const t = ARTWORK_TITLES[input.category];
  const f = input.fields;
  const reserve = fs0(landscape ? 20 : 34) + (input.logo || input.placeholders ? fs0(landscape ? 64 : 116) : 0);
  function fs0(n: number) { return n * base; }
  const bottomLimit = H - pad - reserve;

  const rows: [string, string, string][] = [
    ["DATE & TIME", f.dateTime, "Add date & time"],
    ["HOSTED BY", f.studioName, "Add studio name"],
    ["LOCATION", f.location, "Add studio address"],
    ["LEVEL", f.skillLevel, "Add skill level"],
    ["BOOK BY", f.deadline, "Booking deadline (optional)"],
    ["BOOKING", f.booking, "Add booking link or contact"],
  ].filter(([label, value]) => (value as string).trim() || (input.placeholders && !(landscape && label === "BOOK BY"))) as [string, string, string][];

  const textX = pad;
  const textW = portrait ? W - pad * 2 : W * (1 - (landscape ? 0.42 : 0.5)) - pad * 1.4;

  /** Lays out (and optionally draws) the text block; returns the bottom y. */
  function block(top: number, k: number, draw: boolean): number {
    const fs = (n: number) => n * base * k;
    const text = (str: string, x: number, yy: number) => { if (draw) ctx.fillText(str, x, yy); };
    let y = top;
    ctx.fillStyle = GOLD;
    ctx.font = `500 ${fs(landscape ? 15 : portrait ? 24 : 20)}px Inter, sans-serif`;
    y += fs(landscape ? 18 : 26);
    const city = (f.city || "").trim().toUpperCase();
    if (draw) spaced(ctx, `INTERNATIONAL WORKSHOP${city ? ` · ${city}` : ""}`, textX, y, fs(landscape ? 3.5 : 5));

    ctx.fillStyle = IVORY;
    const titleSize = fs(landscape ? 50 : portrait ? 96 : 74);
    ctx.font = `400 ${titleSize}px "Playfair Display", serif`;
    y += titleSize * 0.35;
    for (const line of wrap(ctx, t.title, textW)) { y += titleSize * 1.02; text(line, textX, y); }

    ctx.fillStyle = GOLD;
    const withSize = fs(landscape ? 26 : portrait ? 44 : 36);
    ctx.font = `italic 400 ${withSize}px "Playfair Display", serif`;
    y += withSize * 1.35;
    text("with Dorottya Litkei", textX, y);

    ctx.fillStyle = MUTED;
    const credSize = fs(landscape ? 14 : portrait ? 22 : 19);
    ctx.font = `400 ${credSize}px Inter, sans-serif`;
    y += credSize * 1.9;
    for (const line of wrap(ctx, "European Champion · Six-time Hungarian Champion", textW)) { text(line, textX, y); y += credSize * 1.4; }

    y += fs(landscape ? 6 : 16);
    ctx.fillStyle = GOLD;
    if (draw) ctx.fillRect(textX, y, fs(landscape ? 48 : 72), Math.max(1, fs(2)));
    y += fs(landscape ? 14 : 26);

    const labelSize = fs(landscape ? 11 : portrait ? 17 : 15);
    const valueSize = fs(landscape ? 17 : portrait ? 28 : 25);
    for (const [label, value, hint] of rows) {
      const v = value.trim();
      ctx.fillStyle = GOLD;
      ctx.font = `500 ${labelSize}px Inter, sans-serif`;
      y += labelSize * 1.2;
      if (draw) spaced(ctx, label, textX, y, fs(3));
      ctx.fillStyle = v ? IVORY : FAINT;
      ctx.font = `${v ? "400" : "italic 400"} ${valueSize}px ${v ? "Inter, sans-serif" : '"Playfair Display", serif'}`;
      for (const line of wrap(ctx, v || `[${hint}]`, textW).slice(0, 2)) { y += valueSize * 1.25; text(line, textX, y); }
      y += valueSize * 0.5;
    }
    return y;
  }

  // Fit: portrait formats give the photo whatever height the text leaves free; every format shrinks text if needed.
  let k = 1;
  let textTop = pad;
  let ph = H * 0.56;
  for (; k >= 0.6; k -= 0.04) {
    const h = block(0, k, false);
    if (portrait) {
      ph = Math.min(H * 0.6, Math.max(H * 0.36, bottomLimit - h + 40 * u));
      textTop = ph - 40 * u;
    }
    if (textTop + h <= bottomLimit) break;
  }

  // --- Photo ---
  if (portrait) {
    cover(ctx, input.photo, 0, 0, W, ph, 0.5, 0.25);
    const g = ctx.createLinearGradient(0, ph * 0.55, 0, ph);
    g.addColorStop(0, "rgba(20,19,18,0)");
    g.addColorStop(1, INK);
    ctx.fillStyle = g;
    ctx.fillRect(0, ph * 0.55, W, ph * 0.45 + 2);
  } else {
    const share = landscape ? 0.42 : 0.5;
    const px = W * (1 - share);
    cover(ctx, input.photo, px, 0, W * share, H, 0.5, 0.2);
    const g = ctx.createLinearGradient(px, 0, px + W * 0.12, 0);
    g.addColorStop(0, INK);
    g.addColorStop(1, "rgba(20,19,18,0)");
    ctx.fillStyle = g;
    ctx.fillRect(px - 1, 0, W * 0.12, H);
  }
  block(textTop, k, true);
  const fs = fs0;

  // Signature (bottom of the text column) and logo slot above it
  const sigSize = fs(landscape ? 11 : 16);
  const sigY = H - pad;
  ctx.fillStyle = MUTED;
  ctx.font = `500 ${sigSize}px Inter, sans-serif`;
  spaced(ctx, "DOROTTYALITKEI.COM", textX, sigY, fs(3));

  const boxW = fs(landscape ? 130 : 220);
  const boxH = fs(landscape ? 50 : 90);
  const bx = textX;
  const by = sigY - sigSize - fs(landscape ? 12 : 22) - boxH;
  if (input.logo) {
    const r = Math.min(boxW / input.logo.naturalWidth, boxH / input.logo.naturalHeight);
    const lw = input.logo.naturalWidth * r;
    const lh = input.logo.naturalHeight * r;
    ctx.drawImage(input.logo, bx, by + (boxH - lh) / 2, lw, lh);
  } else if (input.placeholders) {
    ctx.strokeStyle = FAINT;
    ctx.setLineDash([fs(6), fs(6)]);
    ctx.lineWidth = Math.max(1, fs(1.5));
    ctx.strokeRect(bx, by, boxW, boxH);
    ctx.setLineDash([]);
    ctx.fillStyle = FAINT;
    ctx.font = `500 ${fs(landscape ? 11 : 16)}px Inter, sans-serif`;
    spaced(ctx, "STUDIO LOGO", bx + fs(16), by + boxH / 2 + fs(5), fs(3));
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), type, quality));
}

export async function posterPdf(png: Blob): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const img = await pdf.embedPng(new Uint8Array(await png.arrayBuffer()));
  page.drawImage(img, { x: 0, y: 0, width: 595.28, height: 841.89 });
  pdf.setTitle("Workshop poster — Dorottya Litkei");
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
