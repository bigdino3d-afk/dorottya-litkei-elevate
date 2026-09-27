import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/manage-calendar")({
  head: () => ({ meta: [{ title: "Admin — Calendar" }, { name: "robots", content: "noindex" }] }),
  component: ManageCalendar,
});

type Rule = { id: string; weekday: number; open_minute: number; close_minute: number; closed: boolean };
type Block = { id: string; starts_at: string; ends_at: string; reason: string | null };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}
function fromTime(v: string) {
  const [h, m] = v.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ManageCalendar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState({ start: "", end: "", reason: "" });

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
    const [{ data: r }, { data: b }] = await Promise.all([
      supabase.from("availability_rules").select("*").order("weekday"),
      supabase.from("availability_blocks").select("*").order("starts_at"),
    ]);
    setRules((r ?? []) as Rule[]);
    setBlocks((b ?? []) as Block[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function saveRule(rule: Rule) {
    setMsg(null);
    const { error } = await supabase
      .from("availability_rules")
      .update({ open_minute: rule.open_minute, close_minute: rule.close_minute, closed: rule.closed })
      .eq("id", rule.id);
    setMsg(error ? error.message : "Saved.");
    if (!error) setTimeout(() => setMsg(null), 2000);
  }

  async function addBlock() {
    if (!newBlock.start || !newBlock.end) return;
    setMsg(null);
    const { error } = await supabase.from("availability_blocks").insert({
      starts_at: new Date(newBlock.start).toISOString(),
      ends_at: new Date(newBlock.end).toISOString(),
      reason: newBlock.reason || null,
    });
    if (error) { setMsg(error.message); return; }
    setNewBlock({ start: "", end: "", reason: "" });
    load();
  }

  async function removeBlock(id: string) {
    await supabase.from("availability_blocks").delete().eq("id", id);
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
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-8 border-b border-border sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">Admin</p>
            <h1 className="mt-2 font-serif text-4xl">Calendar</h1>
            <div className="mt-3 flex flex-wrap gap-4 eyebrow">
              <Link to="/admin" className="text-muted-foreground hover:text-gold">Journal</Link>
              <Link to="/manage-projects" className="text-muted-foreground hover:text-gold">Projects</Link>
              <Link to="/manage-videos" className="text-muted-foreground hover:text-gold">Videos</Link>
              <span className="text-gold">Calendar</span>
            </div>
          </div>
          <button onClick={signOut} className="inline-flex shrink-0 items-center gap-2 h-11 px-5 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {msg && <p className="mt-6 text-sm text-gold">{msg}</p>}

        <section className="mt-12 max-w-3xl">
          <h2 className="font-serif text-2xl">Weekly opening hours</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Times are Cyprus local time. Clients can only book inside these windows.
          </p>
          <ul className="mt-6 divide-y divide-border">
            {rules.map((r) => (
              <li key={r.id} className="py-4 grid gap-4 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
                <span className="font-serif text-lg">{DAYS[r.weekday]}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={toTime(r.open_minute)}
                    disabled={r.closed}
                    onChange={(e) => setRules(rules.map((x) => x.id === r.id ? { ...x, open_minute: fromTime(e.target.value) } : x))}
                    className="bg-transparent border-b border-border py-2 focus:border-gold outline-none disabled:opacity-40"
                  />
                  <span className="text-muted-foreground">→</span>
                  <input
                    type="time"
                    value={toTime(r.close_minute)}
                    disabled={r.closed}
                    onChange={(e) => setRules(rules.map((x) => x.id === r.id ? { ...x, close_minute: fromTime(e.target.value) } : x))}
                    className="bg-transparent border-b border-border py-2 focus:border-gold outline-none disabled:opacity-40"
                  />
                  <label className="ml-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={r.closed}
                      onChange={(e) => setRules(rules.map((x) => x.id === r.id ? { ...x, closed: e.target.checked } : x))}
                    />
                    Closed
                  </label>
                </div>
                <button onClick={() => saveRule(r)} className="h-10 px-5 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
                  Save
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl">Blocked time</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Holidays, travel or personal time. Blocked ranges disappear from the booking calendar.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <label className="block">
              <span className="eyebrow text-muted-foreground">From</span>
              <input type="datetime-local" value={newBlock.start} onChange={(e) => setNewBlock({ ...newBlock, start: e.target.value })} className={field} />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">To</span>
              <input type="datetime-local" value={newBlock.end} onChange={(e) => setNewBlock({ ...newBlock, end: e.target.value })} className={field} />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Reason (optional)</span>
              <input value={newBlock.reason} onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })} className={field} placeholder="Competition" />
            </label>
            <button onClick={addBlock} className="inline-flex items-center gap-2 h-11 px-5 bg-charcoal text-white eyebrow hover:bg-gold transition-colors">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          <ul className="mt-8 divide-y divide-border">
            {blocks.length === 0 && <li className="py-4 text-muted-foreground">No blocked time.</li>}
            {blocks.map((b) => (
              <li key={b.id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg truncate">
                    {new Date(b.starts_at).toLocaleString()} → {new Date(b.ends_at).toLocaleString()}
                  </p>
                  {b.reason && <p className="text-sm text-muted-foreground">{b.reason}</p>}
                  <p className="sr-only">{toLocalInput(b.starts_at)}</p>
                </div>
                <button onClick={() => removeBlock(b.id)} className="h-10 w-10 grid place-items-center border border-border hover:border-destructive hover:text-destructive shrink-0" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
