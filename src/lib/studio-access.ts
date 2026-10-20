// Pure rules for studio marketing-kit access. Shared by server functions and tests.

export type StudioAccessRecord = {
  revoked_at: string | null;
  expires_at: string | null;
  categories: string[];
  asset_ids: string[];
};

export type KitAssetRecord = {
  id: string;
  category: string;
  visibility: string;
  published: boolean;
};

/** A grant works only while it is neither revoked nor past its expiry date. */
export function isAccessActive(access: StudioAccessRecord, now: Date = new Date()): boolean {
  if (access.revoked_at) return false;
  if (access.expires_at && new Date(access.expires_at).getTime() <= now.getTime()) return false;
  return true;
}

/**
 * Unpublished assets are never visible. Public assets are visible to every studio.
 * Restricted assets are visible only when the grant covers their category or names them explicitly.
 */
export function canStudioSeeAsset(access: StudioAccessRecord, asset: KitAssetRecord): boolean {
  if (!asset.published) return false;
  if (asset.visibility === "public") return true;
  return access.categories.includes(asset.category) || access.asset_ids.includes(asset.id);
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function generateAccessToken(): string {
  return Array.from(randomBytes(24), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateAccessCode(): string {
  const bytes = randomBytes(8);
  const chars = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4)}`;
}

export function normalizeAccessCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function hashAccessCode(token: string, code: string): Promise<string> {
  const input = new TextEncoder().encode(`${token}:${normalizeAccessCode(code)}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
