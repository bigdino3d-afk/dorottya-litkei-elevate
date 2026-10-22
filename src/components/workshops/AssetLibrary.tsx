import { useMemo, useState } from "react";
import { Archive, Check, Copy, Download, FileText, Film, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ASSET_TYPES,
  CATEGORY_LABEL,
  KIT_FILTERS,
  assetMatchesFilter,
  fileKind,
  formatBytes,
  isImage,
  safeFileName,
  type KitAsset,
  type KitFilter,
} from "@/lib/workshop-content";
import { buildZip, deliverFile, downloadBlob, openDownloadUrl, textFileName, type ZipItem } from "@/lib/download";

function AssetThumb({ a }: { a: KitAsset }) {
  const src = a.previewUrl || (isImage(a) ? a.url : null);
  if (src) {
    return <img src={src} alt={`Preview of ${a.title}`} loading="lazy" className="h-full w-full object-contain" />;
  }
  if (a.mime_type?.startsWith("video/") && a.url) {
    return <video src={a.url} preload="metadata" muted playsInline controls className="h-full w-full object-contain bg-ink" aria-label={a.title} />;
  }
  if (a.text_content && !a.storage_path) {
    return (
      <div className="h-full w-full p-5 text-left overflow-hidden">
        <p className="font-serif text-sm leading-relaxed text-foreground/80 line-clamp-[8] whitespace-pre-line">{a.text_content}</p>
      </div>
    );
  }
  const Icon = a.mime_type?.includes("zip") ? Archive : a.mime_type?.startsWith("video/") ? Film : a.mime_type?.startsWith("image/") ? ImageIcon : FileText;
  return (
    <div className="h-full w-full grid place-items-center text-muted-foreground">
      <div className="text-center">
        <Icon className="h-8 w-8 mx-auto" strokeWidth={1.2} />
        <p className="mt-2 eyebrow">{fileKind(a.mime_type, a.file_name)}</p>
      </div>
    </div>
  );
}

function AssetCard({ a }: { a: KitAsset }) {
  const [copied, setCopied] = useState(false);
  const type = ASSET_TYPES[a.asset_type]?.label ?? "Material";
  const kind = a.storage_path ? fileKind(a.mime_type, a.file_name) : "Text";
  const dims = a.width && a.height ? `${a.width} × ${a.height} px` : a.mime_type?.includes("pdf") ? "PDF document" : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(a.text_content ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — select the text and copy it manually.");
    }
  }

  return (
    <article className="flex flex-col border border-border bg-background">
      <div className="aspect-[4/3] bg-cream overflow-hidden">
        <AssetThumb a={a} />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow">
          <span className="text-gold">{CATEGORY_LABEL[a.category] ?? a.category}</span>
          <span>{type}</span>
          {a.language !== "en" && <span>{a.language.toUpperCase()}</span>}
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug">{a.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {[kind, dims, formatBytes(a.size_bytes)].filter(Boolean).join(" · ")}
        </p>
        {a.description && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.description}</p>}
        {a.instructions && (
          <p className="mt-3 text-xs leading-relaxed border-l-2 border-gold pl-3 text-foreground/75">{a.instructions}</p>
        )}
        <div className="mt-auto pt-5 flex flex-wrap gap-2">
          {a.storage_path && a.url && (
            <button type="button" onClick={() => openDownloadUrl(a.url!)} className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-primary-foreground eyebrow hover:bg-gold hover:text-ink transition-colors" aria-label={`Download ${a.title}`}>
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          )}
          {a.storage_path && !a.url && <span className="text-xs text-muted-foreground">File unavailable</span>}
          {a.text_content && (
            <>
              <button type="button" onClick={copy} className="inline-flex items-center gap-2 h-10 px-4 border border-border eyebrow hover:border-gold hover:text-gold transition-colors">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy text"}
              </button>
              {!a.storage_path && (
                <button type="button" onClick={() => deliverFile(new Blob([a.text_content ?? ""], { type: "text/plain;charset=utf-8" }), textFileName(a.title))} className="inline-flex items-center gap-2 h-10 px-4 border border-border eyebrow hover:border-gold hover:text-gold transition-colors" aria-label={`Download ${a.title} as text`}>
                  <Download className="h-3.5 w-3.5" /> .txt
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function ZipButton({ label, items, filename }: { label: string; items: ZipItem[]; filename: string }) {
  const [state, setState] = useState<{ status: "idle" | "building" | "ready" | "error"; done: number; blob?: Blob }>({ status: "idle", done: 0 });
  if (items.length === 0) return null;
  if (state.status === "ready" && state.blob) {
    return (
      <button type="button" onClick={() => { downloadBlob(state.blob!, filename); setState({ status: "idle", done: 0 }); }} className="inline-flex items-center gap-2 h-11 px-5 bg-gold text-ink eyebrow">
        <Download className="h-4 w-4" /> Save ZIP ({formatBytes(state.blob.size)})
      </button>
    );
  }
  return (
    <button
      type="button"
      disabled={state.status === "building"}
      onClick={async () => {
        setState({ status: "building", done: 0 });
        try {
          const blob = await buildZip(items, (done) => setState((s) => ({ ...s, done })));
          setState({ status: "ready", done: items.length, blob });
        } catch {
          setState({ status: "error", done: 0 });
          toast.error("The ZIP package could not be prepared. Please try again.");
        }
      }}
      className="inline-flex items-center gap-2 h-11 px-5 border border-ink eyebrow hover:bg-ink hover:text-primary-foreground transition-colors disabled:opacity-60"
    >
      {state.status === "building" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
      {state.status === "building" ? `Preparing ${state.done}/${items.length}…` : `${label} · ${items.length} files`}
    </button>
  );
}

export function zipItemsFor(assets: KitAsset[]): ZipItem[] {
  return assets
    .filter((a) => a.asset_type !== "zip" && (a.url || (a.text_content && !a.storage_path)))
    .map((a) => (a.storage_path && a.url
      ? { name: safeFileName(a.file_name || a.title), url: a.url }
      : { name: textFileName(a.title), text: a.text_content }));
}

export function AssetLibrary({ assets, emptyText }: { assets: KitAsset[]; emptyText: string }) {
  const [filter, setFilter] = useState<KitFilter>("all");
  const shown = useMemo(() => assets.filter((a) => assetMatchesFilter(a, filter)), [assets, filter]);
  const acro = assets.filter((a) => a.category === "acrobatic" || a.category === "general");
  const spin = assets.filter((a) => a.category === "spinning" || a.category === "general");

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter materials">
        {KIT_FILTERS.map((f) => {
          const count = assets.filter((a) => assetMatchesFilter(a, f.id)).length;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-10 px-4 rounded-full border text-xs tracking-[0.18em] uppercase transition-colors ${filter === f.id ? "bg-ink text-primary-foreground border-ink" : "border-border hover:border-gold"}`}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <ZipButton label="Acrobatic package" items={zipItemsFor(acro)} filename="dorottya-litkei-acrobatic-pole-tricks-kit.zip" />
        <ZipButton label="Spinning package" items={zipItemsFor(spin)} filename="dorottya-litkei-spinning-pole-kit.zip" />
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => <AssetCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
