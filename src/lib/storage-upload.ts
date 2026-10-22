// Browser upload to the private marketing-kit bucket with real progress reporting.
import { supabase } from "@/integrations/supabase/client";

export const KIT_BUCKET = "workshop-assets";
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export const ACCEPTED_TYPES =
  ".jpg,.jpeg,.png,.webp,.pdf,.mp4,.zip,.txt,.md,.rtf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,video/mp4,application/zip,text/plain";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "pdf", "mp4", "zip", "txt", "md", "rtf", "doc", "docx"];

export function validateUpload(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) return `“${file.name}” is not a supported file type (JPG, PNG, WebP, PDF, MP4, ZIP, TXT, DOCX).`;
  if (file.size > MAX_UPLOAD_BYTES) return `“${file.name}” is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 50 MB per file.`;
  if (file.size === 0) return `“${file.name}” is empty.`;
  return null;
}

export async function uploadWithProgress(path: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired — please sign in again.");
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const url = `${base}/storage/v1/object/${KIT_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("cache-control", "3600");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      let msg = `Upload failed (${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.message) msg = `Upload failed: ${body.message}`;
      } catch {
        /* ignore */
      }
      if (xhr.status === 413) msg = "Upload failed: the file is larger than the storage limit.";
      if (xhr.status === 403) msg = "Upload failed: this account is not allowed to upload (admin access required).";
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error("Upload failed: network error. Check your connection and try again."));
    xhr.send(file);
  });
}

export async function readMediaSize(file: File): Promise<{ width: number; height: number } | null> {
  const url = URL.createObjectURL(file);
  try {
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { width: img.naturalWidth, height: img.naturalHeight };
    }
    if (file.type.startsWith("video/")) {
      return await new Promise((resolve) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => resolve({ width: v.videoWidth, height: v.videoHeight });
        v.onerror = () => resolve(null);
        v.src = url;
      });
    }
    return null;
  } catch {
    return null;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}
