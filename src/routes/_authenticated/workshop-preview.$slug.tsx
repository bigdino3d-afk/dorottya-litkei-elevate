import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { WorkshopLanding, type LandingPage, type LandingWorkshop } from "@/components/workshops/WorkshopLanding";
import type { KitAsset, Lang } from "@/lib/workshop-content";

export const Route = createFileRoute("/_authenticated/workshop-preview/$slug")({
  head: () => ({ meta: [{ title: "Preview — Workshop page" }, { name: "robots", content: "noindex" }] }),
  component: PreviewPage,
});

function PreviewPage() {
  const { slug } = Route.useParams();
  const { isAdmin } = useAdmin();
  const [lang, setLang] = useState<Lang>("en");
  const [data, setData] = useState<{ page: LandingPage; workshops: LandingWorkshop[]; assets: KitAsset[] } | null | undefined>(undefined);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data: page } = await supabase.from("workshop_pages").select("*").eq("slug", slug).maybeSingle();
      if (!page) return setData(null);
      const { data: ws } = await supabase.from("workshops").select("*").eq("page_id", page.id).neq("status", "archived").order("sort_order");
      const ids = (ws ?? []).map((w) => w.id);
      const { data: assets } = ids.length
        ? await supabase.from("workshop_assets").select("*").in("workshop_id", ids).in("asset_type", ["info_sheet", "video"])
        : { data: [] };
      setData({ page: page as unknown as LandingPage, workshops: (ws ?? []) as unknown as LandingWorkshop[], assets: (assets ?? []) as KitAsset[] });
    })();
  }, [isAdmin, slug]);

  if (isAdmin === false) return <div className="pt-40 pb-24 container-luxe text-center">Admin access required.</div>;
  if (data === undefined) return <div className="pt-40 pb-24 container-luxe text-center text-muted-foreground">Loading preview…</div>;
  if (data === null) return <div className="pt-40 pb-24 container-luxe text-center">No page with this address.</div>;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-wrap items-center gap-3 bg-gold text-ink px-5 py-3 shadow-luxe text-xs tracking-[0.16em] uppercase">
        <span>Preview · {data.page.status as string} · dashed = not public</span>
        {data.page.languages?.includes("el") && (
          <button onClick={() => setLang(lang === "en" ? "el" : "en")} className="underline">{lang === "en" ? "View Greek" : "View English"}</button>
        )}
        <Link to="/manage-workshops" className="underline">Back to editor</Link>
      </div>
      <div className="pt-20 bg-ink">
        <WorkshopLanding page={data.page} workshops={data.workshops.filter((w) => w.status !== "archived")} assets={data.assets} lang={lang} preview />
      </div>
    </>
  );
}
