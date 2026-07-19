import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Plus, Trash2, LogOut, Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Journal" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  body: string;
  published: boolean;
  published_at: string | null;
  updated_at: string;
};

const empty: Omit<Post, "id" | "updated_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  cover_image_url: "",
  category: "",
  body: "",
  published: true,
  published_at: null,
};

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | (Omit<Post, "id" | "updated_at"> & { id?: string }) | null>(null);
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

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
  }

  useEffect(() => { if (isAdmin) loadPosts(); }, [isAdmin]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg(null);
    const slug = editing.slug || slugify(editing.title);
    const payload = {
      slug,
      title: editing.title,
      excerpt: editing.excerpt || null,
      cover_image_url: editing.cover_image_url || null,
      category: editing.category || null,
      body: editing.body,
      published: editing.published,
      published_at: editing.published ? editing.published_at ?? new Date().toISOString() : null,
      author_id: userId,
    };
    const res = "id" in editing && editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (res.error) { setMsg(res.error.message); return; }
    setEditing(null);
    loadPosts();
  }

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
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

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="container-luxe">
        <div className="flex items-center justify-between gap-6 pb-8 border-b border-border">
          <div>
            <p className="eyebrow text-muted-foreground">Admin</p>
            <h1 className="mt-2 font-serif text-4xl">Journal</h1>
          </div>
          <div className="flex items-center gap-3">
            {!editing && (
              <button
                onClick={() => setEditing({ ...empty })}
                className="inline-flex items-center gap-2 h-11 px-5 bg-charcoal text-white eyebrow hover:bg-gold transition-colors"
              >
                <Plus className="h-4 w-4" /> New article
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
                placeholder="Article title"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="eyebrow text-muted-foreground">Slug</label>
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Category</label>
                <input
                  value={editing.category ?? ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none"
                  placeholder="Technique · Training · Mindset…"
                />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Cover image URL</label>
              <input
                value={editing.cover_image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none"
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Excerpt</label>
              <textarea
                value={editing.excerpt ?? ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                rows={2}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-none"
                placeholder="One or two sentences shown on the list page."
              />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground">Body</label>
              <textarea
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={18}
                className="mt-2 w-full bg-transparent border border-border rounded-md p-4 focus:border-gold outline-none resize-y font-serif text-lg leading-relaxed"
                placeholder="Write your article. Line breaks are preserved."
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Publish immediately (visible on the Journal page)
            </label>

            {msg && <p className="text-sm text-destructive">{msg}</p>}

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={save}
                disabled={saving || !editing.title.trim() || !editing.body.trim()}
                className="h-12 px-8 bg-charcoal text-white eyebrow hover:bg-gold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save article"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="h-12 px-6 border border-border eyebrow hover:border-gold hover:text-gold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {posts.length === 0 ? (
              <p className="text-muted-foreground">No articles yet. Click "New article" to write your first one.</p>
            ) : (
              <ul className="divide-y divide-border">
                {posts.map((p) => (
                  <li key={p.id} className="py-6 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 eyebrow text-muted-foreground">
                        {p.published ? <span className="text-gold">Published</span> : <span>Draft</span>}
                        {p.category && <span>· {p.category}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl truncate">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">/blog/{p.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.published && (
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center border border-border hover:border-gold hover:text-gold" title="View">
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
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
