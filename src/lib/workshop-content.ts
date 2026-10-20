// Shared, browser-safe metadata for workshops and marketing-kit assets.

export type Lang = "en" | "el";
export type WorkshopCategory = "acrobatic" | "spinning" | "other";
export type AssetCategory = "acrobatic" | "spinning" | "general";

export const CATEGORY_LABEL: Record<string, string> = {
  acrobatic: "Acrobatic Pole Tricks",
  spinning: "Spinning Pole",
  general: "Both workshops",
  other: "Other",
};

/** Workshop fields an admin can publish one by one. `translatable` fields get a Greek version. */
export const WORKSHOP_FIELDS = [
  { key: "tagline", label: "Tagline", kind: "text", translatable: true },
  { key: "description", label: "Workshop description", kind: "textarea", translatable: true },
  { key: "skill_level", label: "Skill level", kind: "text", translatable: true },
  { key: "prerequisites", label: "Prerequisites", kind: "textarea", translatable: true },
  { key: "learning_objectives", label: "Learning objectives (one per line)", kind: "textarea", translatable: true },
  { key: "duration", label: "Duration", kind: "text", translatable: true },
  { key: "capacity", label: "Maximum participants", kind: "number", translatable: false },
  { key: "requirements", label: "Technical & equipment requirements", kind: "textarea", translatable: true },
  { key: "dates", label: "Dates & times", kind: "text", translatable: true },
  { key: "booking_deadline", label: "Booking deadline", kind: "text", translatable: true },
  { key: "venue", label: "Venue / host studio", kind: "text", translatable: false },
  { key: "location", label: "Location / address", kind: "text", translatable: false },
  { key: "price_amount", label: "Price", kind: "price", translatable: false },
  { key: "price_note", label: "Price note", kind: "text", translatable: true },
  { key: "video_url", label: "Demonstration video link (YouTube, Vimeo, Instagram…)", kind: "text", translatable: false },
  { key: "booking_url", label: "Booking link", kind: "text", translatable: false },
  { key: "contact_email", label: "Organiser contact email", kind: "text", translatable: false },
] as const;

export type WorkshopFieldKey = (typeof WORKSHOP_FIELDS)[number]["key"];

export type AssetGroup = "social" | "print" | "copy" | "video" | "package" | "other";

export const ASSET_TYPES: Record<string, { label: string; group: AssetGroup }> = {
  instagram_post: { label: "Instagram post", group: "social" },
  instagram_story: { label: "Instagram Story", group: "social" },
  facebook_post: { label: "Facebook post", group: "social" },
  photo: { label: "Photo", group: "social" },
  poster: { label: "Poster / print", group: "print" },
  info_sheet: { label: "Workshop information sheet", group: "print" },
  caption: { label: "Instagram caption", group: "copy" },
  story_copy: { label: "Instagram Story copy", group: "copy" },
  facebook_copy: { label: "Facebook announcement", group: "copy" },
  website_copy: { label: "Website description", group: "copy" },
  instructor_bio: { label: "Instructor biography", group: "copy" },
  video: { label: "Video", group: "video" },
  zip: { label: "ZIP package", group: "package" },
  other: { label: "Other", group: "other" },
};

export const KIT_FILTERS = [
  { id: "all", label: "All materials" },
  { id: "acrobatic", label: "Acrobatic Pole Tricks" },
  { id: "spinning", label: "Spinning Pole" },
  { id: "social", label: "Social media" },
  { id: "print", label: "Posters & print" },
  { id: "copy", label: "Copy & text" },
] as const;

export type KitFilter = (typeof KIT_FILTERS)[number]["id"];

export type KitAsset = {
  id: string;
  workshop_id: string | null;
  category: string;
  asset_type: string;
  title: string;
  description: string | null;
  instructions: string | null;
  language: string;
  storage_path: string | null;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  preview_path: string | null;
  text_content: string | null;
  visibility: string;
  published: boolean;
  sort_order: number;
  url?: string | null;
  previewUrl?: string | null;
};

export function assetMatchesFilter(a: Pick<KitAsset, "category" | "asset_type">, f: KitFilter): boolean {
  if (f === "all") return true;
  if (f === "acrobatic" || f === "spinning") return a.category === f || a.category === "general";
  return (ASSET_TYPES[a.asset_type]?.group ?? "other") === f;
}

export function fileKind(mime: string | null, name: string | null): string {
  const ext = name?.split(".").pop()?.toLowerCase();
  if (ext && ext.length <= 4) return ext === "jpeg" ? "JPG" : ext.toUpperCase();
  if (!mime) return "TEXT";
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("zip")) return "ZIP";
  if (mime.startsWith("video/")) return "MP4";
  if (mime.startsWith("image/")) return mime.split("/")[1].toUpperCase();
  return "FILE";
}

export function formatBytes(n: number | null | undefined): string {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function isImage(a: Pick<KitAsset, "mime_type">) {
  return !!a.mime_type?.startsWith("image/");
}

export function lines(text: string | null | undefined): string[] {
  return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export function formatPrice(amount: number | string | null | undefined, currency: string, locale: string): string | null {
  if (amount === null || amount === undefined || amount === "") return null;
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  try {
    return new Intl.NumberFormat(locale || "en-GB", { style: "currency", currency: currency || "EUR", maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

type Translatable = { translations?: unknown };

/** Returns the field in the requested language, falling back to the English original. */
export function localize<T extends Translatable>(obj: T, key: string, lang: Lang): unknown {
  const base = (obj as Record<string, unknown>)[key];
  if (lang === "en") return base;
  const tr = obj.translations as Record<string, Record<string, unknown>> | undefined;
  const v = tr?.[lang]?.[key];
  if (v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0)) return base;
  return v;
}

export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext ? `${base}.${ext}` : base;
}
