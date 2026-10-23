import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Ban, Copy, KeyRound, Mail, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminShell, adminArea, adminBtn, adminField, adminGhost, adminIcon } from "@/components/admin/AdminShell";
import { createStudioAccess, resetStudioAccessCode } from "@/lib/workshops.functions";
import { isAccessActive } from "@/lib/studio-access";
import { CATEGORY_LABEL } from "@/lib/workshop-content";

export const Route = createFileRoute("/_authenticated/manage-studios")({
  head: () => ({ meta: [{ title: "Admin — Studios & Inquiries" }, { name: "robots", content: "noindex" }] }),
  component: ManageStudios,
});

type Access = Tables<"studio_access">;
type Inquiry = Tables<"workshop_inquiries">;
type AssetLite = Pick<Tables<"workshop_assets">, "id" | "title" | "category" | "visibility" | "published">;

type Draft = {
  id?: string;
  studioName: string;
  contactName: string;
  contactEmail: string;
  categories: string[];
  assetIds: string[];
  expires: string;
  notes: string;
};

const EMPTY: Draft = { studioName: "", contactName: "", contactEmail: "", categories: ["acrobatic", "spinning", "general"], assetIds: [], expires: "", notes: "" };

function linkFor(token: string) {
  return `${window.location.origin}/studio-kit?key=${token}`;
}

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copied`);
  } catch {
    toast.error("Copy failed — select and copy manually.");
  }
}

function ManageStudios() {
  const create = useServerFn(createStudioAccess);
  const reset = useServerFn(resetStudioAccessCode);
  const [list, setList] = useState<Access[]>([]);
  const [assets, setAssets] = useState<AssetLite[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [issued, setIssued] = useState<{ studio: string; link: string; code: string } | null>(null);
  const [notify, setNotify] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [a, b, c, d] = await Promise.all([
      supabase.from("studio_access").select("*").order("created_at", { ascending: false }),
      supabase.from("workshop_assets").select("id, title, category, visibility, published").eq("visibility", "restricted").order("category").order("sort_order"),
      supabase.from("workshop_inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("value").eq("key", "inquiry_notify_email").maybeSingle(),
    ]);
    setList(a.data ?? []);
    setAssets(b.data ?? []);
    setInquiries(c.data ?? []);
    setNotify(d.data?.value ?? "");
  }
  useEffect(() => { load(); }, []);

  async function saveNotify() {
    const v = notify.trim();
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return toast.error("Please enter a valid email address.");
    const { error } = await supabase.from("site_settings").upsert({ key: "inquiry_notify_email", value: v });
    if (error) return toast.error(error.message);
    toast.success("Notification address saved");
  }

  async function saveDraft() {
    if (!draft) return;
    if (draft.studioName.trim().length < 2) return toast.error("Studio name is required.");
    setBusy(true);
    try {
      const expiresAt = draft.expires ? new Date(`${draft.expires}T23:59:59`).toISOString() : null;
      if (draft.id) {
        const { error } = await supabase.from("studio_access").update({
          studio_name: draft.studioName.trim(),
          contact_name: draft.contactName || null,
          contact_email: draft.contactEmail || null,
          categories: draft.categories,
          asset_ids: draft.assetIds,
          expires_at: expiresAt,
          notes: draft.notes || null,
        }).eq("id", draft.id);
        if (error) throw new Error(error.message);
        toast.success("Access updated");
      } else {
        const res = await create({ data: { studioName: draft.studioName, contactName: draft.contactName, contactEmail: draft.contactEmail, categories: draft.categories as ("acrobatic" | "spinning" | "general")[], assetIds: draft.assetIds, expiresAt, notes: draft.notes } });
        setIssued({ studio: draft.studioName, link: linkFor(res.token), code: res.code });
      }
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function resetCode(a: Access) {
    if (!confirm(`Create a new access code for ${a.studio_name}? The old code stops working immediately.`)) return;
    try {
      const res = await reset({ data: { id: a.id } });
      setIssued({ studio: a.studio_name, link: linkFor(res.token), code: res.code });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset");
    }
  }

  async function setRevoked(a: Access, revoked: boolean) {
    const { error } = await supabase.from("studio_access").update({ revoked_at: revoked ? new Date().toISOString() : null }).eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success(revoked ? `Access for ${a.studio_name} revoked` : `Access for ${a.studio_name} restored`);
    load();
  }

  async function remove(a: Access) {
    if (!confirm(`Delete the access record for ${a.studio_name}?`)) return;
    const { error } = await supabase.from("studio_access").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    load();
  }

  async function setInquiryStatus(i: Inquiry, status: string) {
    const { error } = await supabase.from("workshop_inquiries").update({ status }).eq("id", i.id);
    if (error) return toast.error(error.message);
    load();
  }

  async function removeInquiry(i: Inquiry) {
    if (!confirm(`Delete the inquiry from ${i.studio_name}?`)) return;
    const { error } = await supabase.from("workshop_inquiries").delete().eq("id", i.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <AdminShell title="Studios & Inquiries" actions={!draft && <button onClick={() => setDraft({ ...EMPTY })} className={adminBtn}><Plus className="h-4 w-4" /> New studio link</button>}>
      {issued && (
        <div className="mt-8 border-2 border-gold bg-cream p-6" role="status">
          <p className="eyebrow text-gold">Share with {issued.studio}</p>
          <p className="mt-2 text-sm text-muted-foreground">Send the link and the code separately (e.g. link by email, code by phone or message). The code is shown only now — if it is lost, create a new one.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <code className="block bg-background border border-border p-3 text-xs break-all">{issued.link}</code>
            <button onClick={() => copy(issued.link, "Link")} className={adminGhost}><Copy className="h-4 w-4" /> Copy link</button>
            <code className="block bg-background border border-border p-3 text-lg tracking-[0.3em]">{issued.code}</code>
            <button onClick={() => copy(issued.code, "Code")} className={adminGhost}><KeyRound className="h-4 w-4" /> Copy code</button>
          </div>
          <button onClick={() => setIssued(null)} className="mt-5 eyebrow text-gold hover:underline">I've saved it — close</button>
        </div>
      )}

      {draft ? (
        <div className="mt-10 max-w-3xl space-y-7">
          <div className="grid gap-6 md:grid-cols-3">
            <label className="md:col-span-3"><span className="eyebrow">Studio name *</span><input value={draft.studioName} onChange={(e) => setDraft({ ...draft, studioName: e.target.value })} className={`${adminField} font-serif text-2xl`} /></label>
            <label><span className="eyebrow">Contact person</span><input value={draft.contactName} onChange={(e) => setDraft({ ...draft, contactName: e.target.value })} className={adminField} /></label>
            <label><span className="eyebrow">Contact email</span><input type="email" value={draft.contactEmail} onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })} className={adminField} /></label>
            <label><span className="eyebrow">Access ends on (optional)</span><input type="date" value={draft.expires} onChange={(e) => setDraft({ ...draft, expires: e.target.value })} className={adminField} /></label>
          </div>
          <fieldset>
            <legend className="eyebrow">Can see all partner-only materials for</legend>
            <div className="mt-3 flex flex-wrap gap-5">
              {["acrobatic", "spinning", "general"].map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.categories.includes(c)} onChange={(e) => setDraft({ ...draft, categories: e.target.checked ? [...draft.categories, c] : draft.categories.filter((x) => x !== c) })} />
                  {CATEGORY_LABEL[c]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow">Plus these individual materials</legend>
            {assets.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No partner-only materials uploaded yet.</p> : (
              <div className="mt-3 max-h-64 overflow-y-auto border border-border divide-y divide-border">
                {assets.map((a) => (
                  <label key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <input type="checkbox" checked={draft.assetIds.includes(a.id)} onChange={(e) => setDraft({ ...draft, assetIds: e.target.checked ? [...draft.assetIds, a.id] : draft.assetIds.filter((x) => x !== a.id) })} />
                    <span className="flex-1">{a.title}</span>
                    <span className="eyebrow">{CATEGORY_LABEL[a.category]}{a.published ? "" : " · hidden"}</span>
                  </label>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Public materials are always included. Hidden (unpublished) materials are never shown, even if selected.</p>
          </fieldset>
          <label className="block"><span className="eyebrow">Internal notes</span><textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={adminArea} /></label>
          <div className="flex gap-3">
            <button onClick={saveDraft} disabled={busy} className={adminBtn}>{busy ? "Saving…" : draft.id ? "Save changes" : "Create link & code"}</button>
            <button onClick={() => setDraft(null)} className={adminGhost}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-14">
          <section aria-labelledby="links-title">
            <h2 id="links-title" className="font-serif text-2xl">Studio links</h2>
            <p className="mt-2 text-sm text-muted-foreground">Each partner studio gets its own link plus an access code. Revoke at any time.</p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {list.map((a) => {
                const active = isAccessActive(a);
                return (
                  <li key={a.id} className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-3 eyebrow">
                        <span className={active ? "text-gold" : "text-destructive"}>{a.revoked_at ? "Revoked" : active ? "Active" : "Expired"}</span>
                        <span>{a.categories.map((c) => CATEGORY_LABEL[c]).join(" · ") || "No categories"}{a.asset_ids.length ? ` + ${a.asset_ids.length} file(s)` : ""}</span>
                      </div>
                      <h3 className="mt-2 font-serif text-xl">{a.studio_name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[a.contact_name, a.contact_email, a.expires_at ? `until ${new Date(a.expires_at).toLocaleDateString("en-GB")}` : null, a.open_count ? `opened ${a.open_count}× (last ${new Date(a.last_opened_at!).toLocaleDateString("en-GB")})` : "not opened yet"].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button className={adminIcon} title="Copy link" onClick={() => copy(linkFor(a.token), "Link")}><Copy className="h-4 w-4" /></button>
                      <button className={adminIcon} title="New access code" onClick={() => resetCode(a)}><KeyRound className="h-4 w-4" /></button>
                      <button className={adminIcon} title="Edit permissions" onClick={() => setDraft({ id: a.id, studioName: a.studio_name, contactName: a.contact_name ?? "", contactEmail: a.contact_email ?? "", categories: a.categories, assetIds: a.asset_ids, expires: a.expires_at ? a.expires_at.slice(0, 10) : "", notes: a.notes ?? "" })}><Pencil className="h-4 w-4" /></button>
                      {a.revoked_at
                        ? <button className={adminIcon} title="Restore access" onClick={() => setRevoked(a, false)}><RotateCcw className="h-4 w-4" /></button>
                        : <button className={`${adminIcon} hover:border-destructive hover:text-destructive`} title="Revoke access" onClick={() => setRevoked(a, true)}><Ban className="h-4 w-4" /></button>}
                      <button className={`${adminIcon} hover:border-destructive hover:text-destructive`} title="Delete" onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                );
              })}
              {list.length === 0 && <li className="py-6 text-muted-foreground">No studio links yet.</li>}
            </ul>
          </section>

          <section aria-labelledby="inq-title">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 id="inq-title" className="font-serif text-2xl">Hosting inquiries</h2>
                <p className="mt-2 text-sm text-muted-foreground">Every inquiry from the workshop page is saved here.</p>
              </div>
              <div className="flex items-end gap-3 w-full md:w-auto">
                <label className="flex-1 md:w-80"><span className="eyebrow">Email notifications go to</span>
                  <input type="email" value={notify} onChange={(e) => setNotify(e.target.value)} className={adminField} placeholder="name@example.com" />
                </label>
                <button onClick={saveNotify} className={adminGhost}>Save</button>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {inquiries.map((i) => (
                <li key={i.id} className="py-5 grid gap-3 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap gap-3 eyebrow">
                      <span className={i.status === "new" ? "text-gold" : ""}>{i.status}</span>
                      <span>{new Date(i.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                      <span>{i.workshop_type}</span>
                      {i.page_slug && <span>/{i.page_slug}</span>}
                      <span>{i.emailed ? "emailed" : "saved only"}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl">{i.studio_name}</h3>
                    <p className="mt-1 text-sm">{i.contact_name} · <a href={`mailto:${i.email}`} className="text-gold hover:underline">{i.email}</a>{i.phone ? ` · ${i.phone}` : ""}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{[i.participants && `${i.participants} participants`, i.preferred_dates && `Dates: ${i.preferred_dates}`].filter(Boolean).join(" · ")}</p>
                    {i.message && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{i.message}</p>}
                  </div>
                  <div className="flex md:flex-col gap-2 items-start md:items-end">
                    <select value={i.status} onChange={(e) => setInquiryStatus(i, e.target.value)} className="h-10 border border-border bg-transparent px-3 text-xs uppercase tracking-[0.14em]" aria-label="Inquiry status">
                      <option value="new">New</option><option value="contacted">Contacted</option><option value="confirmed">Confirmed</option><option value="closed">Closed</option>
                    </select>
                    <div className="flex gap-2">
                      <a className={adminIcon} title="Reply" href={`mailto:${i.email}?subject=${encodeURIComponent("Workshop with Dorottya Litkei")}`}><Mail className="h-4 w-4" /></a>
                      <button className={`${adminIcon} hover:border-destructive hover:text-destructive`} title="Delete" onClick={() => removeInquiry(i)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
              {inquiries.length === 0 && <li className="py-6 text-muted-foreground">No inquiries yet.</li>}
            </ul>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
