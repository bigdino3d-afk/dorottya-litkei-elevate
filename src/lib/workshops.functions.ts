import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  canStudioSeeAsset,
  generateAccessCode,
  generateAccessToken,
  hashAccessCode,
  isAccessActive,
  safeEqual,
} from "./studio-access";
import type { KitAsset } from "./workshop-content";

const BUCKET = "workshop-assets";
const ASSET_COLUMNS =
  "id, workshop_id, category, asset_type, title, description, instructions, language, storage_path, file_name, mime_type, size_bytes, width, height, preview_path, text_content, visibility, published, sort_order";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Signed URLs created on the server must point at the browser-reachable backend address. */
function browserUrl(u: string): string {
  const server = process.env["SUPABASE_URL"];
  const browser = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (server && browser && server !== browser && u.startsWith(server)) return browser + u.slice(server.length);
  return u;
}

function requestOrigin(): string {
  try {
    const req = getRequest();
    const url = new URL(req.url);
    const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
    return sandboxHost ? `https://${sandboxHost}` : url.origin;
  } catch {
    return "";
  }
}

// ---------- Public landing page ----------

export type PublicWorkshop = Record<string, unknown> & {
  id: string;
  category: string;
  title: string;
  booking_open: boolean;
  currency: string;
  translations?: Record<string, Record<string, unknown>>;
};

export type PublicWorkshopPage = {
  page: Record<string, unknown> & {
    id: string;
    slug: string;
    city: string;
    country: string;
    credentials: string[];
    languages: string[];
    locale: string;
    currency: string;
    translations: Record<string, Record<string, unknown>>;
  };
  workshops: PublicWorkshop[];
  assets: KitAsset[];
  origin: string;
};

export const getWorkshopPage = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => z.object({ slug: z.string().trim().min(1).max(80) }).parse(raw))
  .handler(async ({ data }): Promise<PublicWorkshopPage | null> => {
    const supa = publicClient();
    const { data: res, error } = await supa.rpc("get_public_workshop_page", { _slug: data.slug });
    if (error) {
      console.error("[workshops] page load failed", error.message);
      throw new Error("The workshop page could not be loaded. Please try again shortly.");
    }
    if (!res) return null;
    const parsed = res as unknown as Omit<PublicWorkshopPage, "assets" | "origin">;
    const ids = parsed.workshops.map((w) => w.id);
    let assets: KitAsset[] = [];
    if (ids.length) {
      const { data: rows } = await supa
        .from("workshop_assets")
        .select(ASSET_COLUMNS)
        .eq("visibility", "public")
        .eq("published", true)
        .in("workshop_id", ids)
        .in("asset_type", ["info_sheet", "video"])
        .order("sort_order");
      assets = (rows ?? []) as KitAsset[];
    }
    return { ...parsed, assets, origin: requestOrigin() };
  });

// ---------- Hosting inquiries ----------

const inquirySchema = z.object({
  pageSlug: z.string().trim().max(80).optional().or(z.literal("")),
  studioName: z.string().trim().min(2, "Studio name is required").max(160),
  contactName: z.string().trim().min(2, "Contact name is required").max(160),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  workshopType: z.enum(["acrobatic", "spinning", "both", "unsure"]),
  participants: z.string().trim().max(60).optional().or(z.literal("")),
  preferredDates: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot, must stay empty
});

const TYPE_LABEL: Record<string, string> = {
  acrobatic: "Acrobatic Pole Tricks",
  spinning: "Spinning Pole",
  both: "Both workshops",
  unsure: "Not sure yet",
};

export const submitWorkshopInquiry = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => inquirySchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("workshop_inquiries")
      .insert({
        page_slug: data.pageSlug || null,
        studio_name: data.studioName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone || null,
        workshop_type: TYPE_LABEL[data.workshopType],
        participants: data.participants || null,
        preferred_dates: data.preferredDates || null,
        message: data.message || null,
      })
      .select("id")
      .single();
    if (error || !row) {
      console.error("[workshops] inquiry insert failed", error?.message);
      throw new Error("Your inquiry could not be sent. Please try again or email us directly.");
    }

    // Optional email notification (only when an email provider is configured).
    let emailed = false;
    const apiKey = process.env["RESEND_API_KEY"];
    const { data: setting } = await supabaseAdmin.from("site_settings").select("value").eq("key", "inquiry_notify_email").maybeSingle();
    const to = setting?.value?.trim();
    if (apiKey && to) {
      try {
        const from = process.env["BOOKING_FROM_EMAIL"] || "onboarding@resend.dev";
        const text = [
          `New workshop hosting inquiry${data.pageSlug ? ` (${data.pageSlug})` : ""}`,
          ``,
          `Studio: ${data.studioName}`,
          `Contact: ${data.contactName}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "—"}`,
          `Workshop: ${TYPE_LABEL[data.workshopType]}`,
          `Participants: ${data.participants || "—"}`,
          `Preferred dates: ${data.preferredDates || "—"}`,
          ``,
          data.message || "",
        ].join("\n");
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: `Workshops <${from}>`, to: [to], reply_to: data.email, subject: `Workshop inquiry — ${data.studioName}`, text }),
        });
        emailed = res.ok;
        if (!res.ok) console.error("[workshops] inquiry email failed", res.status, await res.text());
      } catch (err) {
        console.error("[workshops] inquiry email error", err);
      }
      if (emailed) await supabaseAdmin.from("workshop_inquiries").update({ emailed: true }).eq("id", row.id);
    }
    return { ok: true as const, id: row.id };
  });

// ---------- Restricted studio kit (share link + access code) ----------

const INVALID = "This studio link or access code is not valid. Please check the code or contact Dorottya's management.";

export const openStudioKit = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({ token: z.string().trim().min(16).max(128), code: z.string().trim().min(4).max(40) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: access } = await supabaseAdmin
      .from("studio_access")
      .select("id, studio_name, token, code_hash, categories, asset_ids, expires_at, revoked_at, open_count")
      .eq("token", data.token)
      .maybeSingle();
    const expected = access ? await hashAccessCode(access.token, data.code) : "";
    if (!access || !safeEqual(expected, access.code_hash)) {
      await new Promise((r) => setTimeout(r, 600));
      throw new Error(INVALID);
    }
    if (!isAccessActive(access)) throw new Error("This studio link has expired or been revoked. Please contact Dorottya's management.");

    const { data: rows, error } = await supabaseAdmin
      .from("workshop_assets")
      .select(ASSET_COLUMNS)
      .eq("published", true)
      .order("sort_order")
      .order("created_at");
    if (error) throw new Error("The marketing kit could not be loaded. Please try again.");

    const visible = (rows ?? []).filter((a) => canStudioSeeAsset(access, a)) as KitAsset[];
    const paths = Array.from(new Set(visible.flatMap((a) => [a.storage_path, a.preview_path]).filter((p): p is string => !!p)));
    const urlMap = new Map<string, string>();
    if (paths.length) {
      const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrls(paths, 7200, { download: true });
      for (const s of signed ?? []) if (s.path && s.signedUrl) urlMap.set(s.path, browserUrl(s.signedUrl));
    }

    await supabaseAdmin
      .from("studio_access")
      .update({ last_opened_at: new Date().toISOString(), open_count: (access.open_count ?? 0) + 1 })
      .eq("id", access.id);

    return {
      studioName: access.studio_name,
      assets: visible.map((a) => ({
        ...a,
        url: a.storage_path ? urlMap.get(a.storage_path) ?? null : null,
        previewUrl: a.preview_path ? urlMap.get(a.preview_path) ?? null : null,
      })),
    };
  });

// ---------- Admin: issue / reset studio access ----------

async function assertAdmin(supabase: ReturnType<typeof createClient<Database>>, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) throw new Error("Forbidden: admin access required");
}

const accessSchema = z.object({
  studioName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().max(160).optional().or(z.literal("")),
  contactEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
  categories: z.array(z.enum(["acrobatic", "spinning", "general"])).max(3),
  assetIds: z.array(z.string().uuid()).max(500),
  expiresAt: z.string().datetime().nullable().optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const createStudioAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => accessSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const token = generateAccessToken();
    const code = generateAccessCode();
    const { data: row, error } = await context.supabase
      .from("studio_access")
      .insert({
        studio_name: data.studioName,
        contact_name: data.contactName || null,
        contact_email: data.contactEmail || null,
        categories: data.categories,
        asset_ids: data.assetIds,
        expires_at: data.expiresAt ?? null,
        notes: data.notes || null,
        token,
        code_hash: await hashAccessCode(token, code),
      })
      .select("id")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Could not create the studio link");
    return { id: row.id, token, code };
  });

export const resetStudioAccessCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("studio_access").select("token").eq("id", data.id).single();
    if (error || !row) throw new Error("Studio link not found");
    const code = generateAccessCode();
    const { error: upErr } = await context.supabase
      .from("studio_access")
      .update({ code_hash: await hashAccessCode(row.token, code) })
      .eq("id", data.id);
    if (upErr) throw new Error(upErr.message);
    return { token: row.token, code };
  });
