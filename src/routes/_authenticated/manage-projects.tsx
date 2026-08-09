import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Plus, Trash2, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/manage-projects")({
  head: () => ({ meta: [{ title: "Admin — Projects" }, { name: "robots", content: "noindex" }] }),
  component: ManageProjects,
});

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  cover_image_url: string | null;
  external_url: string | null;
  year: string | null;
  status: string;
  sort_order: number;
  published: boolean;
};

const empty: Omit<Project, "id"> = {
  slug: "",
  title: "",
  summary: "",
  body: "",
  cover_image_url: "",
  external_url: "",
  year: "",
  status: "ongoing",
  sort_order: 0,
  published: true,
};

const STATUSES = ["planned", "ongoing", "completed"];

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function ManageProjects() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<(Omit<Project, "id"> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserEmail(u.user.email ?? null);
      setUserId(u.user.id);
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!role);
    })();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Project[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg(null);
    const payload = {
      slug: editing.slug || slugify(editing.title),
      title: editing.title,
      summary: editing.summary || null,
      body: editing.body,
      cover_image_url: editing.cover_image_url || null,
      external_url: editing.external_url || null,
      year: editing.year || null,
      status: editing.status,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published,
      author_id: userId,
    };
    const res = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (res.error) { setMsg(res.error.message); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
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
            <h1 className="mt-2 font-serif text-4xl">Projects</h1>
            <div className="mt-3 flex gap-4 eyebrow">
              <Link to="/admin" className="text-muted-foreground hover:text-gold">Journal</Link>
              <span className="text-gold">Projects</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!editing && (
              <button
                onClick={() => setEditing({ ...empty })}
                className="inline-flex items-center gap-2 h-11 px-5 bg-charcoal text-white eyebrow hover:bg-gold transition-colors"
              >
                <Plus className="h-4 w-4" /> New project
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
                onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-2xl font-serif focus:border-gold outline-none"
                placeholder="Project title"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Slug</label>
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={field} />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Year / date</label>
                <input value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className={field} placeholder="2026" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Status</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className={field}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Cover image URL</label>
                <input value={editing.cover_image_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} className={field} placeholder="https://…" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">External link</label>
                <input value={editing.external_url ?? ""} onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} className={field} placeholder="https://…" />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Short summary</label>
              <textarea
                value={editing.summary ?? ""}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                rows={2}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-none"
                placeholder="One or two sentences shown on the projects page."
              />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Description</label>
              <textarea
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={10}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-y font-serif text-lg leading-relaxed"
                placeholder="Full description. Line breaks are preserved."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="eyebrow text-muted-foreground">Sort order</label>
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className={field}
                />
              </div>
              <label className="flex items-center gap-3 text-sm md:mt-8">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Publish (visible on the Projects page)
              </label>
            </div>

            {msg && <p className="text-sm text-destructive">{msg}</p>}

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={save}
                disabled={saving || !editing.title.trim()}
                className="h-12 px-8 bg-charcoal text-white eyebrow hover:bg-gold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save project"}
              </button>
              <button onClick={() => setEditing(null)} className="h-12 px-6 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {items.length === 0 ? (
              <p className="text-muted-foreground">No projects yet. Click "New project" to add your first one.</p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((p) => (
                  <li key={p.id} className="py-6 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 eyebrow text-muted-foreground">
                        {p.published ? <span className="text-gold">Published</span> : <span>Draft</span>}
                        <span>· {p.status}</span>
                        {p.year && <span>· {p.year}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl truncate">{p.title}</h3>
                      {p.summary && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditing(p)} className="h-10 w-10 grid place-items-center border border-border hover:border-gold hover:text-gold" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(p.id)} className="h-10 w-10 grid place-items-center border border-border hover:border-destructive hover:text-destructive" title="Delete">
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
