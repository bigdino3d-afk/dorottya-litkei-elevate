import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Archive, Copy, Eye, EyeOff, Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminShell, adminArea, adminBtn, adminField, adminGhost, adminIcon } from "@/components/admin/AdminShell";
import { CATEGORY_LABEL, WORKSHOP_FIELDS } from "@/lib/workshop-content";

export const Route = createFileRoute("/_authenticated/manage-workshops")({
  head: () => ({ meta: [{ title: "Admin — Workshops" }, { name: "robots", content: "noindex" }] }),
  component: ManageWorkshops,
});

type Page = Tables<"workshop_pages">;
type Workshop = Tables<"workshops">;
type Tr = Record<string, Record<string, unknown>>;

const PAGE_TEXT: [keyof Page & string, string, boolean][] = [
  ["hero_eyebrow", "Hero eyebrow line", false],
  ["headline", "Headline", false],
  ["intro", "Supporting text", true],
  ["instructor_heading", "Instructor section heading", false],
  ["instructor_bio", "Instructor paragraph", true],
  ["hosting_heading", "Hosting section heading", false],
  ["hosting_text", "Hosting explanation", true],
];

function trOf(v: unknown): Tr {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Tr) : {};
}

function credLines(v: unknown): string {
  return Array.isArray(v) ? v.map(String).join("\n") : "";
}
function toCreds(s: string): string[] {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

function StatusBadge({ s }: { s: string }) {
  const cls = s === "published" ? "text-gold" : s === "archived" ? "text-muted-foreground line-through" : "text-muted-foreground";
  return <span className={`eyebrow ${cls}`}>{s}</span>;
}

function ManageWorkshops() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageId, setPageId] = useState<string | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editing, setEditing] = useState<Partial<Workshop> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadPages() {
    const { data } = await supabase.from("workshop_pages").select("*").order("created_at");
    setPages(data ?? []);
    if (!pageId && data?.length) setPageId(data[0].id);
  }
  async function loadWorkshops(id: string) {
    const { data } = await supabase.from("workshops").select("*").eq("page_id", id).order("sort_order").order("created_at");
    setWorkshops(data ?? []);
  }
  useEffect(() => { loadPages(); }, []);
  useEffect(() => { if (pageId) loadWorkshops(pageId); }, [pageId]);

  const page = pages.find((p) => p.id === pageId) ?? null;

  async function savePage() {
    if (!editingPage) return;
    setSaving(true);
    const { id, created_at: _c, updated_at: _u, ...rest } = editingPage;
    const { error } = await supabase.from("workshop_pages").update(rest).eq("id", id);
    setSaving(false);
    if (error) return toast.error(`Could not save: ${error.message}`);
    toast.success("Landing page saved");
    setEditingPage(null);
    loadPages();
  }

  async function newPage() {
    const city = prompt("City for the new workshop page (e.g. Budapest):")?.trim();
    if (!city) return;
    const slug = city.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data, error } = await supabase
      .from("workshop_pages")
      .insert({ slug, city, status: "draft", headline: "Train with a European Champion.", credentials: page?.credentials ?? [] })
      .select("id")
      .single();
    if (error) return toast.error(`Could not create: ${error.message}`);
    toast.success(`Draft page /workshops/${slug} created`);
    setPageId(data.id);
    loadPages();
  }

  async function saveWorkshop() {
    if (!editing || !pageId) return;
    if (!editing.title?.trim()) return toast.error("Title is required");
    setSaving(true);
    const { id, created_at: _c, updated_at: _u, ...rest } = editing as Workshop;
    const payload = { ...rest, page_id: pageId, capacity: rest.capacity ? Number(rest.capacity) : null, price_amount: rest.price_amount === null || (rest.price_amount as unknown) === "" ? null : Number(rest.price_amount) };
    const res = id ? await supabase.from("workshops").update(payload).eq("id", id) : await supabase.from("workshops").insert(payload as Workshop);
    setSaving(false);
    if (res.error) return toast.error(`Could not save: ${res.error.message}`);
    toast.success("Workshop saved");
    setEditing(null);
    loadWorkshops(pageId);
  }

  async function setStatus(w: Workshop, status: string) {
    const { error } = await supabase.from("workshops").update({ status }).eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success(`“${w.title}” is now ${status}`);
    loadWorkshops(w.page_id!);
  }
  async function duplicate(w: Workshop) {
    const { id: _i, created_at: _c, updated_at: _u, ...rest } = w;
    const { error } = await supabase.from("workshops").insert({ ...rest, title: `${w.title} (copy)`, status: "draft", booking_open: false });
    if (error) return toast.error(error.message);
    toast.success("Duplicated as a draft");
    loadWorkshops(w.page_id!);
  }
  async function remove(w: Workshop) {
    if (!confirm(`Delete “${w.title}” permanently? Consider archiving instead.`)) return;
    const { error } = await supabase.from("workshops").delete().eq("id", w.id);
    if (error) return toast.error(error.message);
    loadWorkshops(w.page_id!);
  }

  return (
    <AdminShell
      title="Workshops"
      actions={page && (
        <>
          <Link to="/workshop-preview/$slug" params={{ slug: page.slug }} className={adminGhost}><Eye className="h-4 w-4" /> Preview</Link>
          {page.status === "published" && <a href={`/workshops/${page.slug}`} target="_blank" rel="noreferrer" className={adminGhost}><ExternalLink className="h-4 w-4" /> Live page</a>}
        </>
      )}
    >
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {pages.map((p) => (
          <button key={p.id} onClick={() => { setPageId(p.id); setEditing(null); setEditingPage(null); }} className={`h-10 px-4 rounded-full border text-xs tracking-[0.16em] uppercase ${p.id === pageId ? "bg-ink text-primary-foreground border-ink" : "border-border hover:border-gold"}`}>
            {p.city || p.slug} · {p.status}
          </button>
        ))}
        <button onClick={newPage} className="h-10 px-4 rounded-full border border-dashed border-border text-xs tracking-[0.16em] uppercase hover:border-gold"><Plus className="inline h-3.5 w-3.5" /> New city page</button>
      </div>

      {page && !editing && !editingPage && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="border border-border p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Landing page</p>
              <StatusBadge s={page.status} />
            </div>
            <h2 className="mt-3 font-serif text-2xl">{page.headline}</h2>
            <p className="mt-2 text-sm text-muted-foreground">/workshops/{page.slug} · {page.city}, {page.country} · {page.currency} · {page.languages.join(", ").toUpperCase()}</p>
            <button onClick={() => setEditingPage(page)} className={`${adminBtn} mt-6`}><Pencil className="h-4 w-4" /> Edit landing page</button>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="eyebrow">Workshop formats</p>
              <button onClick={() => setEditing({ title: "", category: "acrobatic", status: "draft", booking_open: false, currency: page.currency, published_fields: [], translations: {}, sort_order: workshops.length + 1 })} className={adminGhost}><Plus className="h-4 w-4" /> New workshop</button>
            </div>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {workshops.map((w) => (
                <li key={w.id} className="py-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-3 items-center"><StatusBadge s={w.status} /><span className="eyebrow">{CATEGORY_LABEL[w.category]}</span>{w.booking_open && <span className="eyebrow text-gold">Bookings open</span>}</div>
                    <h3 className="mt-2 font-serif text-xl truncate">{w.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{w.published_fields.length} public field(s): {w.published_fields.join(", ") || "only the title"}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className={adminIcon} title="Edit" onClick={() => setEditing(w)}><Pencil className="h-4 w-4" /></button>
                    <button className={adminIcon} title={w.status === "published" ? "Unpublish" : "Publish"} onClick={() => setStatus(w, w.status === "published" ? "draft" : "published")}>{w.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    <button className={adminIcon} title="Duplicate" onClick={() => duplicate(w)}><Copy className="h-4 w-4" /></button>
                    {w.status !== "archived" && <button className={adminIcon} title="Archive" onClick={() => setStatus(w, "archived")}><Archive className="h-4 w-4" /></button>}
                    <button className={`${adminIcon} hover:border-destructive hover:text-destructive`} title="Delete" onClick={() => remove(w)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
              {workshops.length === 0 && <li className="py-6 text-muted-foreground">No workshops on this page yet.</li>}
            </ul>
          </div>
        </div>
      )}

      {editingPage && <PageEditor value={editingPage} onChange={setEditingPage} onSave={savePage} onCancel={() => setEditingPage(null)} saving={saving} />}
      {editing && <WorkshopEditor value={editing} onChange={setEditing} onSave={saveWorkshop} onCancel={() => setEditing(null)} saving={saving} greek={!!page?.languages.includes("el")} />}
    </AdminShell>
  );
}

function PageEditor({ value, onChange, onSave, onCancel, saving }: { value: Page; onChange: (p: Page) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  const tr = trOf(value.translations);
  const el = tr.el ?? {};
  const greek = value.languages.includes("el");
  const setEl = (k: string, v: unknown) => onChange({ ...value, translations: { ...tr, el: { ...el, [k]: v } } });

  return (
    <div className="mt-10 max-w-4xl space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <label><span className="eyebrow">Status</span>
          <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value })} className={adminField}>
            <option value="draft">Draft (hidden)</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </label>
        <label><span className="eyebrow">City</span><input value={value.city} onChange={(e) => onChange({ ...value, city: e.target.value })} className={adminField} /></label>
        <label><span className="eyebrow">Country</span><input value={value.country} onChange={(e) => onChange({ ...value, country: e.target.value })} className={adminField} /></label>
        <label><span className="eyebrow">URL slug</span><input value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} className={adminField} /></label>
        <label><span className="eyebrow">Currency</span><input value={value.currency} maxLength={3} onChange={(e) => onChange({ ...value, currency: e.target.value.toUpperCase() })} className={adminField} /></label>
        <label><span className="eyebrow">Time zone</span><input value={value.timezone} onChange={(e) => onChange({ ...value, timezone: e.target.value })} className={adminField} /></label>
        <label><span className="eyebrow">Number format</span><input value={value.locale} onChange={(e) => onChange({ ...value, locale: e.target.value })} className={adminField} placeholder="en-GB or el-GR" /></label>
        <label className="flex items-center gap-3 text-sm md:mt-8">
          <input type="checkbox" checked={greek} onChange={(e) => onChange({ ...value, languages: e.target.checked ? ["en", "el"] : ["en"] })} />
          Offer Greek version
        </label>
      </div>

      {PAGE_TEXT.map(([k, label, long]) => (
        <div key={k} className={`grid gap-6 ${greek ? "md:grid-cols-2" : ""}`}>
          <label className="block"><span className="eyebrow">{label}</span>
            {long ? <textarea rows={4} value={(value[k] as string) ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className={adminArea} />
              : <input value={(value[k] as string) ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className={adminField} />}
          </label>
          {greek && (
            <label className="block"><span className="eyebrow">{label} · Greek</span>
              {long ? <textarea rows={4} lang="el" value={(el[k] as string) ?? ""} onChange={(e) => setEl(k, e.target.value)} className={adminArea} />
                : <input lang="el" value={(el[k] as string) ?? ""} onChange={(e) => setEl(k, e.target.value)} className={adminField} />}
            </label>
          )}
        </div>
      ))}

      <div className={`grid gap-6 ${greek ? "md:grid-cols-2" : ""}`}>
        <label className="block"><span className="eyebrow">Credentials (one per line)</span>
          <textarea rows={5} value={credLines(value.credentials)} onChange={(e) => onChange({ ...value, credentials: toCreds(e.target.value) })} className={adminArea} />
        </label>
        {greek && (
          <label className="block"><span className="eyebrow">Credentials · Greek</span>
            <textarea rows={5} lang="el" value={credLines(el.credentials)} onChange={(e) => setEl("credentials", toCreds(e.target.value))} className={adminArea} />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Leave a Greek field empty to show the English text. Workshop titles and sport terms stay as written.</p>

      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving} className={adminBtn}>{saving ? "Saving…" : "Save landing page"}</button>
        <button onClick={onCancel} className={adminGhost}>Cancel</button>
      </div>
    </div>
  );
}

function WorkshopEditor({ value, onChange, onSave, onCancel, saving, greek }: { value: Partial<Workshop>; onChange: (w: Partial<Workshop>) => void; onSave: () => void; onCancel: () => void; saving: boolean; greek: boolean }) {
  const pub = value.published_fields ?? [];
  const tr = trOf(value.translations);
  const el = tr.el ?? {};
  const togglePub = (k: string, on: boolean) => onChange({ ...value, published_fields: on ? Array.from(new Set([...pub, k])) : pub.filter((x) => x !== k) });
  const setEl = (k: string, v: string) => onChange({ ...value, translations: { ...tr, el: { ...el, [k]: v } } });
  const get = (k: string) => {
    const v = (value as Record<string, unknown>)[k];
    return v === null || v === undefined ? "" : String(v);
  };

  return (
    <div className="mt-10 max-w-4xl space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <label className="md:col-span-2"><span className="eyebrow">Title (always public once published)</span>
          <input value={value.title ?? ""} onChange={(e) => onChange({ ...value, title: e.target.value })} className={`${adminField} font-serif text-2xl`} />
        </label>
        <label><span className="eyebrow">Category</span>
          <select value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} className={adminField}>
            <option value="acrobatic">Acrobatic Pole Tricks</option><option value="spinning">Spinning Pole</option><option value="other">Other</option>
          </select>
        </label>
        <label><span className="eyebrow">Status</span>
          <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value })} className={adminField}>
            <option value="draft">Draft (hidden)</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </label>
        <label><span className="eyebrow">Display order</span><input type="number" value={value.sort_order ?? 0} onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })} className={adminField} /></label>
        <label className="flex items-center gap-3 text-sm md:mt-8 md:col-span-3">
          <input type="checkbox" checked={!!value.booking_open} onChange={(e) => onChange({ ...value, booking_open: e.target.checked })} />
          Bookings are open (shows “Bookings open” and the booking button if a booking link is public)
        </label>
      </div>

      {greek && (
        <label className="block max-w-md"><span className="eyebrow">Title · Greek (optional)</span>
          <input lang="el" value={(el.title as string) ?? ""} onChange={(e) => setEl("title", e.target.value)} className={adminField} />
        </label>
      )}

      <div className="border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">Tick <strong className="text-foreground">Public</strong> only once a detail is confirmed. Unticked fields are saved but never shown on the website.</p>
      </div>

      {WORKSHOP_FIELDS.map((f) => (
        <div key={f.key} className="grid gap-4 md:grid-cols-[1fr_auto] items-start">
          <div className={`grid gap-6 ${greek && f.translatable ? "md:grid-cols-2" : ""}`}>
            <label className="block"><span className="eyebrow">{f.label}</span>
              {f.kind === "textarea" ? (
                <textarea rows={3} value={get(f.key)} onChange={(e) => onChange({ ...value, [f.key]: e.target.value })} className={adminArea} />
              ) : f.kind === "price" ? (
                <div className="flex gap-3">
                  <input type="number" step="0.01" min="0" value={get("price_amount")} onChange={(e) => onChange({ ...value, price_amount: e.target.value === "" ? null : Number(e.target.value) })} className={adminField} />
                  <input value={value.currency ?? "EUR"} maxLength={3} onChange={(e) => onChange({ ...value, currency: e.target.value.toUpperCase() })} className={`${adminField} w-20`} aria-label="Currency" />
                </div>
              ) : (
                <input type={f.kind === "number" ? "number" : "text"} value={get(f.key)} onChange={(e) => onChange({ ...value, [f.key]: f.kind === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value })} className={adminField} />
              )}
            </label>
            {greek && f.translatable && (
              <label className="block"><span className="eyebrow">{f.label} · Greek</span>
                {f.kind === "textarea" ? <textarea rows={3} lang="el" value={(el[f.key] as string) ?? ""} onChange={(e) => setEl(f.key, e.target.value)} className={adminArea} />
                  : <input lang="el" value={(el[f.key] as string) ?? ""} onChange={(e) => setEl(f.key, e.target.value)} className={adminField} />}
              </label>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase md:mt-8 whitespace-nowrap">
            <input type="checkbox" checked={pub.includes(f.key)} onChange={(e) => togglePub(f.key, e.target.checked)} /> Public
          </label>
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button onClick={onSave} disabled={saving} className={adminBtn}>{saving ? "Saving…" : "Save workshop"}</button>
        <button onClick={onCancel} className={adminGhost}>Cancel</button>
      </div>
    </div>
  );
}
