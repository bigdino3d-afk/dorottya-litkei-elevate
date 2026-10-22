// Browser-only download helpers.
import JSZip from "jszip";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function deliverFile(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type });
  const touch = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return;
    }
  }
  downloadBlob(blob, filename);
}

/** Navigates to a signed URL that carries a download header (works on iOS too). */
export function openDownloadUrl(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function textFileName(title: string) {
  return `${title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "copy"}.txt`;
}

export type ZipItem = { name: string; url?: string | null; text?: string | null };

export async function buildZip(items: ZipItem[], onProgress?: (done: number, total: number) => void): Promise<Blob> {
  const zip = new JSZip();
  const used = new Set<string>();
  const unique = (n: string) => {
    let name = n;
    let i = 2;
    while (used.has(name)) {
      const dot = n.lastIndexOf(".");
      name = dot > 0 ? `${n.slice(0, dot)}-${i}${n.slice(dot)}` : `${n}-${i}`;
      i++;
    }
    used.add(name);
    return name;
  };
  let done = 0;
  for (const item of items) {
    if (item.url) {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`Could not fetch ${item.name}`);
      zip.file(unique(item.name), await res.blob());
    } else if (item.text) {
      zip.file(unique(item.name), item.text);
    }
    done++;
    onProgress?.(done, items.length);
  }
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
