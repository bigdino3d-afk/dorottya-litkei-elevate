import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Eye, EyeOff, Pencil, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminShell, adminArea, adminBtn, adminField, adminGhost, adminIcon } from "@/components/admin/AdminShell";
import { ASSET_TYPES, CATEGORY_LABEL, fileKind, formatBytes, isImage, safeFileName } from "@/lib/workshop-content";
import { ACCEPTED_TYPES, KIT_BUCKET, readMediaSize, uploadWithProgress, validateUpload } from "@/lib/storage-upload";
import { openDownloadUrl } from "@/lib/download";

export const Route = createFileRoute("/_authenticated/manage-kit")({
  head: () => ({ meta: [{ title: "Admin — Marketing Kit" }, { name: "robots", content: "noindex" }] }),
  component: ManageKit,
});

type Asset = Tables<"workshop_assets">;
type Workshop = Pick<Tables<"workshops">, "id" | "title" | "category">;

const COPY_TYPES = ["caption", "story_copy", "facebook_copy", "website_copy", "instructor_bio"];

const EMPTY: Partial<Asset> = {
  title: "",
  category: "acrobatic",
  asset_type: "instagram_post",
  language: "en",
  visibility: "restricted",
  published: false,
  sort_order: 0,
  description: "",
  instructions: "",
  text_content: "",
  workshop_id: null,
};

function newPath(category: string, file: File) {
  return `${category}/${crypto.randomUUID()}/${safeFileName(file.name)}`;
}

function ManageKit() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Partial<Asset> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [progress, setProgress] = useState<{ label: string; pct: number } | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<Asset | null>(null);

  async function load() {
    const [{ data: a, error }, { data: w }] = await Promise.all([
      supabase.from("workshop_assets").select("*").order("category").order("sort_order").order("created_at"),
      supabase.from("workshops").select("id, title, category").neq("status", "archived").order("sort_order"),
    ]);
    if (error) toast.error(`Could not load materials: ${error.message}`);
    setAssets(a ?? []);
    setWorkshops(w ?? []);
    const paths = (a ?? []).map((x) => x.preview_path || (x.mime_type?.startsWith("image/") ? x.storage_path : null)).filter((p): p is string => !!p);
    if (paths.length) {
      const { data: s } = await supabase.storage.from(KIT_BUCKET).createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      for (const r of s ?? []) if (r.path && r.signedUrl) map[r.path] = r.signedUrl;
      setThumbs(map);
    }
  }
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => assets.filter((a) => filter === "all" || a.category === filter), [assets, filter]);

  async function save() {
    if (!editing) return;
    if (!editing.title?.trim()) return toast.error("Please give the material a title.");
    const isCopy = COPY_TYPES.includes(editing.asset_type ?? "");
    if (!editing.id && !file && !(isCopy && editing.text_content?.trim())) {
      return toast.error(isCopy ? "Add the copy text or choose a file." : "Choose a file to upload.");
    }
    for (const f of [file, preview]) {
      const problem = f ? validateUpload(f) : null;
      if (problem) return toast.error(problem);
    }

    const row: Partial<Asset> = { ...editing };
    const uploaded: string[] = [];
    try {
      if (file) {
        const path = newPath(row.category ?? "general", file);
        setProgress({ label: file.name, pct: 0 });
        await uploadWithProgress(path, file, (pct) => setProgress({ label: file.name, pct }));
        uploaded.push(path);
        const dims = await readMediaSize(file);
        Object.assign(row, { storage_path: path, file_name: file.name, mime_type: file.type || null, size_bytes: file.size, width: dims?.width ?? null, height: dims?.height ?? null });
      }
      if (preview) {
        const path = newPath(`${row.category ?? "general"}/previews`, preview);
        setProgress({ label: preview.name, pct: 0 });
        await uploadWithProgress(path, preview, (pct) => setProgress({ label: preview.name, pct }));
        uploaded.push(path);
        row.preview_path = path;
      }
      const old = editing.id ? assets.find((a) => a.id === editing.id) : undefined;
      const { id, created_at: _c, updated_at: _u, ...payload } = row as Asset;
      const clean = { ...payload, description: payload.description || null, instructions: payload.instructions || null, text_content: payload.text_content || null };
      const res = id ? await supabase.from("workshop_assets").update(clean).eq("id", id) : await supabase.from("workshop_assets").insert(clean);
      if (res.error) throw new Error(`Saving failed: ${res.error.message}`);
      // Remove files that were replaced.
      const stale = [file && old?.storage_path, preview && old?.preview_path].filter((p): p is string => !!p);
      if (stale.length) await supabase.storage.from(KIT_BUCKET).remove(stale);
      toast.success(id ? "Material updated" : "Material uploaded and saved");
      setEditing(null);
      setFile(null);
      setPreview(null);
      load();
    } catch (err) {
      if (uploaded.length) await supabase.storage.from(KIT_BUCKET).remove(uploaded);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  }

  async function replaceFile(a: Asset, f: File) {
    const problem = validateUpload(f);
    if (problem) return toast.error(problem);
    setBusyId(a.id);
    const path = newPath(a.category, f);
    try {
      setProgress({ label: f.name, pct: 0 });
      await uploadWithProgress(path, f, (pct) => setProgress({ label: f.name, pct }));
      const dims = await readMediaSize(f);
      const { error } = await supabase.from("workshop_assets").update({ storage_path: path, file_name: f.name, mime_type: f.type || null, size_bytes: f.size, width: dims?.width ?? null, height: dims?.height ?? null }).eq("id", a.id);
      if (error) throw new Error(`Saving failed: ${error.message}`);
      if (a.storage_path) await supabase.storage.from(KIT_BUCKET).remove([a.storage_path]);
      toast.success(`“${a.title}” now uses ${f.name}`);
      load();
    } catch (err) {
      await supabase.storage.from(KIT_BUCKET).remove([path]);
      toast.error(err instanceof Error ? err.message : "Replace failed");
    } finally {
      setProgress(null);
      setBusyId(null);
    }
  }

  async function togglePublish(a: Asset) {
    const { error } = await supabase.from("workshop_assets").update({ published: !a.published }).eq("id", a.id);
    if (error) return toast.error(error.message);
    load();
  }

  async function remove(a: Asset) {
    if (!confirm(`Delete “${a.title}” and its file permanently?`)) return;
    const paths = [a.storage_path, a.preview_path].filter((p): p is string => !!p);
    if (paths.length) {
      const { error: sErr } = await supabase.storage.from(KIT_BUCKET).remove(paths);
      if (sErr) return toast.error(`Could not delete the file: ${sErr.message}`);
    }
    const { error } = await supabase.from("workshop_assets").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function download(a: Asset) {
    if (!a.storage_path) return;
    const { data, error } = await supabase.storage.from(KIT_BUCKET).createSignedUrl(a.storage_path, 300, { download: a.file_name || true });
    if (error || !data) return toast.error("Download failed");
    openDownloadUrl(data.signedUrl);
  }

  const isCopy = COPY_TYPES.includes(editing?.asset_type ?? "");

  return (
    <AdminShell title="Marketing Kit" actions={!editing && <button onClick={() => { setEditing({ ...EMPTY }); setFile(null); setPreview(null); }} className={adminBtn}><Plus className="h-4 w-4" /> Add material</button>}>
      {progress && (
        <div className="fixed bottom-6 right-6 z-[70] w-80 bg-background border border-border p-4 shadow-luxe" role="status" aria-live="polite">
          <p className="text-xs truncate">Uploading {progress.label}</p>
          <div className="mt-3 h-1.5 bg-cream"><div className="h-full bg-gold transition-all" style={{ width: `${progress.pct}%` }} /></div>
          <p className="mt-2 text-xs text-muted-foreground">{progress.pct}%</p>
        </div>
      )}

      <input ref={replaceInput} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && replaceTarget) replaceFile(replaceTarget, f); e.target.value = ""; }} />

      {editing ? (
        <div className="mt-10 max-w-3xl space-y-7">
          <label className="block"><span className="eyebrow">Title</span>
            <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={`${adminField} font-serif text-2xl`} placeholder="Instagram post — Acrobatic Pole Tricks" />
          </label>
          <div className="grid gap-6 md:grid-cols-3">
            <label><span className="eyebrow">Workshop category</span>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={adminField}>
                <option value="acrobatic">Acrobatic Pole Tricks</option><option value="spinning">Spinning Pole</option><option value="general">Both workshops</option>
              </select>
            </label>
            <label><span className="eyebrow">Asset type</span>
              <select value={editing.asset_type} onChange={(e) => setEditing({ ...editing, asset_type: e.target.value })} className={adminField}>
                {Object.entries(ASSET_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
            <label><span className="eyebrow">Specific workshop (optional)</span>
              <select value={editing.workshop_id ?? ""} onChange={(e) => setEditing({ ...editing, workshop_id: e.target.value || null })} className={adminField}>
                <option value="">— none —</option>
                {workshops.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
              </select>
            </label>
            <label><span className="eyebrow">Language</span>
              <select value={editing.language} onChange={(e) => setEditing({ ...editing, language: e.target.value })} className={adminField}>
                <option value="en">English</option><option value="el">Greek</option>
              </select>
            </label>
            <label><span className="eyebrow">Who can see it</span>
              <select value={editing.visibility} onChange={(e) => setEditing({ ...editing, visibility: e.target.value })} className={adminField}>
                <option value="restricted">Partner studios only (private link)</option><option value="public">Everyone (public kit)</option>
              </select>
            </label>
            <label><span className="eyebrow">Display order</span><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={adminField} /></label>
          </div>
          <p className="text-xs text-muted-foreground">Info sheets and videos linked to a specific workshop also appear on its public landing page when set to “Everyone” and published.</p>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block"><span className="eyebrow">{editing.id ? "Replace file (optional)" : isCopy ? "File (optional for copy)" : "File"}</span>
              <input type="file" accept={ACCEPTED_TYPES} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm file:mr-4 file:h-10 file:px-4 file:border file:border-border file:bg-transparent file:text-xs file:uppercase file:tracking-[0.16em]" />
              <span className="mt-2 block text-xs text-muted-foreground">JPG, PNG, WebP, PDF, MP4, ZIP, TXT or DOCX · max 50 MB{editing.file_name && !file ? ` · current: ${editing.file_name}` : ""}</span>
            </label>
            <label className="block"><span className="eyebrow">Preview image (optional)</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPreview(e.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm file:mr-4 file:h-10 file:px-4 file:border file:border-border file:bg-transparent file:text-xs file:uppercase file:tracking-[0.16em]" />
              <span className="mt-2 block text-xs text-muted-foreground">Recommended for PDFs, ZIPs and videos.</span>
            </label>
          </div>

          {isCopy && (
            <label className="block"><span className="eyebrow">Copy text</span>
              <textarea rows={8} value={editing.text_content ?? ""} onChange={(e) => setEditing({ ...editing, text_content: e.target.value })} className={adminArea} placeholder="Paste the caption, announcement or biography. Studios can copy it in one click." />
            </label>
          )}
          <label className="block"><span className="eyebrow">Description</span>
            <textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={adminArea} />
          </label>
          <label className="block"><span className="eyebrow">Usage / download instructions</span>
            <textarea rows={2} value={editing.instructions ?? ""} onChange={(e) => setEditing({ ...editing, instructions: e.target.value })} className={adminArea} placeholder="e.g. Post as a carousel cover. Add your booking link in the caption." />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
            Published (visible to the audience chosen above)
          </label>
          <div className="flex gap-3">
            <button onClick={save} disabled={!!progress} className={adminBtn}><Upload className="h-4 w-4" /> {progress ? "Uploading…" : editing.id ? "Save changes" : "Upload & save"}</button>
            <button onClick={() => { setEditing(null); setFile(null); setPreview(null); }} disabled={!!progress} className={adminGhost}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {["all", "acrobatic", "spinning", "general"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`h-10 px-4 rounded-full border text-xs tracking-[0.16em] uppercase ${filter === f ? "bg-ink text-primary-foreground border-ink" : "border-border hover:border-gold"}`}>
                {f === "all" ? "All" : CATEGORY_LABEL[f]} <span className="opacity-60">{f === "all" ? assets.length : assets.filter((a) => a.category === f).length}</span>
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="mt-10 text-muted-foreground">No materials yet. Click “Add material” to upload artwork, PDFs, videos or copy.</p>
          ) : (
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {shown.map((a) => {
                const thumb = thumbs[a.preview_path ?? ""] || (isImage(a) ? thumbs[a.storage_path ?? ""] : undefined);
                return (
                  <li key={a.id} className="py-5 flex items-start gap-5">
                    <div className="h-20 w-20 shrink-0 bg-cream grid place-items-center overflow-hidden">
                      {thumb ? <img src={thumb} alt="" className="h-full w-full object-contain" /> : <span className="eyebrow">{a.storage_path ? fileKind(a.mime_type, a.file_name) : "Text"}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 eyebrow">
                        <span className={a.published ? "text-gold" : ""}>{a.published ? "Published" : "Hidden"}</span>
                        <span>{a.visibility === "public" ? "Everyone" : "Partner studios"}</span>
                        <span>{CATEGORY_LABEL[a.category]}</span>
                        <span>{ASSET_TYPES[a.asset_type]?.label ?? a.asset_type}</span>
                        {a.language !== "en" && <span>{a.language.toUpperCase()}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-xl truncate">{a.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {[a.file_name, a.width && a.height ? `${a.width}×${a.height}` : null, formatBytes(a.size_bytes), a.text_content ? "copy text" : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0 justify-end">
                      <button className={adminIcon} title="Edit" onClick={() => { setEditing(a); setFile(null); setPreview(null); }}><Pencil className="h-4 w-4" /></button>
                      <button className={adminIcon} title={a.published ? "Unpublish" : "Publish"} onClick={() => togglePublish(a)}>{a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      {a.storage_path && <button className={adminIcon} title="Download" onClick={() => download(a)}><Download className="h-4 w-4" /></button>}
                      <button className={adminIcon} title="Replace file" disabled={busyId === a.id} onClick={() => { setReplaceTarget(a); replaceInput.current?.click(); }}><RefreshCw className="h-4 w-4" /></button>
                      <button className={`${adminIcon} hover:border-destructive hover:text-destructive`} title="Delete" onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </AdminShell>
  );
}
