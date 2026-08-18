import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Plus, Trash2, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/manage-videos")({
  head: () => ({ meta: [{ title: "Admin — Video Classes" }, { name: "robots", content: "noindex" }] }),
  component: ManageVideos,
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
  sort_order: number;
  published: boolean;
};

const empty: Omit<Video, "id"> = {
  title: "",
  description: "",
  thumbnail_url: "",
  video_url: "",
  preview_url: "",
  duration_label: "",
  level: "All levels",
  price_cents: 500,
  sort_order: 0,
  published: true,
};

function ManageVideos() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [items, setItems] = useState<Video[]>([]);
  const [editing, setEditing] = useState<(Omit<Video, "id"> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserEmail(u.user.email ?? null);
      const { data: role } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!role);
    })();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("videos").select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Video[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg(null);
    const payload = {
      title: editing.title,
      description: editing.description || null,
      thumbnail_url: editing.thumbnail_url || null,
      video_url: editing.video_url || null,
      preview_url: editing.preview_url || null,
      duration_label: editing.duration_label || null,
      level: editing.level || null,
      price_cents: Number(editing.price_cents) || 0,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published,
    };
    const res = editing.id
      ? await supabase.from("videos").update(payload).eq("id", editing.id)
      : await supabase.from("videos").insert(payload);
    setSaving(false);
    if (res.error) { setMsg(res.error.message); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this video class?")) return;
    await supabase.from("videos").delete().eq("id", id);
    load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return <div className="pt-40 pb-24 container-luxe text-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="pt-40 pb-24 container-luxe max-w-lg text-center">
        <p className="eyebrow text-muted-foreground">Restricted</p>
        <h1 className="mt-4 font-serif text-3xl">Admin access required</h1>
        <p className="mt-4 text-muted-foreground">
          You are signed in as <span className="text-charcoal">{userEmail}</span> but this account has no admin role.
        </p>
        <button onClick={signOut} className="mt-8 eyebrow text-gold hover:underline">Sign out</button>
      </div>
    );
  }

  const field = "mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none";

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="container-luxe">
        <div className="flex items-center justify-between gap-6 pb-8 border-b border-border">
          <div>
            <p className="eyebrow text-muted-foreground">Admin</p>
            <h1 className="mt-2 font-serif text-4xl">Video classes</h1>
            <div className="mt-3 flex flex-wrap gap-4 eyebrow">
              <Link to="/admin" className="text-muted-foreground hover:text-gold">Journal</Link>
              <Link to="/manage-projects" className="text-muted-foreground hover:text-gold">Projects</Link>
              <span className="text-gold">Videos</span>
              <Link to="/manage-calendar" className="text-muted-foreground hover:text-gold">Calendar</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!editing && (
              <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 h-11 px-5 bg-charcoal text-white eyebrow hover:bg-gold transition-colors">
                <Plus className="h-4 w-4" /> New video
              </button>
            )}
            <button onClick={signOut} className="inline-flex items-center gap-2 h-11 px-5 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {editing ? (
          <div className="mt-10 max-w-3xl space-y-6">
            <div>
              <label className="eyebrow text-muted-foreground">Title</label>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-2xl font-serif focus:border-gold outline-none"
                placeholder="Flexibility flow · 30 min"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Level</label>
                <input value={editing.level ?? ""} onChange={(e) => setEditing({ ...editing, level: e.target.value })} className={field} placeholder="Beginner" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Duration label</label>
                <input value={editing.duration_label ?? ""} onChange={(e) => setEditing({ ...editing, duration_label: e.target.value })} className={field} placeholder="35 min" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Price (cents)</label>
                <input type="number" value={editing.price_cents} onChange={(e) => setEditing({ ...editing, price_cents: Number(e.target.value) })} className={field} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Thumbnail URL</label>
                <input value={editing.thumbnail_url ?? ""} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} className={field} placeholder="https://…" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Video link (private)</label>
                <input value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className={field} placeholder="https://…" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Free preview link</label>
                <input value={editing.preview_url ?? ""} onChange={(e) => setEditing({ ...editing, preview_url: e.target.value })} className={field} placeholder="https://…" />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Description</label>
              <textarea
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-y"
                placeholder="What the class covers."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="eyebrow text-muted-foreground">Sort order</label>
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={field} />
              </div>
              <label className="flex items-center gap-3 text-sm md:mt-8">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Publish (visible on the Video Classes page)
              </label>
            </div>

            {msg && <p className="text-sm text-destructive">{msg}</p>}

            <div className="flex items-center gap-3 pt-4">
              <button onClick={save} disabled={saving || !editing.title.trim()} className="h-12 px-8 bg-charcoal text-white eyebrow hover:bg-gold transition-colors disabled:opacity-50">
                {saving ? "Saving…" : "Save video"}
              </button>
              <button onClick={() => setEditing(null)} className="h-12 px-6 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {items.length === 0 ? (
              <p className="text-muted-foreground">No video classes yet. Click "New video" to add the first one.</p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((v) => (
                  <li key={v.id} className="py-6 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 eyebrow text-muted-foreground">
                        {v.published ? <span className="text-gold">Published</span> : <span>Hidden</span>}
                        <span>· €{(v.price_cents / 100).toFixed(2)}</span>
                        {v.level && <span>· {v.level}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl truncate">{v.title}</h3>
                      {v.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{v.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditing(v)} className="h-10 w-10 grid place-items-center border border-border hover:border-gold hover:text-gold" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(v.id)} className="h-10 w-10 grid place-items-center border border-border hover:border-destructive hover:text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
