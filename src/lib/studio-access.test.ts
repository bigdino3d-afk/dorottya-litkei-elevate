import { describe, expect, it } from "vitest";
import { canStudioSeeAsset, hashAccessCode, isAccessActive, safeEqual } from "./studio-access";

const grant = { revoked_at: null, expires_at: null, categories: ["acrobatic"], asset_ids: ["x1"] };

describe("studio access rules", () => {
  it("a revoked link no longer works", () => {
    expect(isAccessActive({ ...grant, revoked_at: "2026-01-01T00:00:00Z" })).toBe(false);
  });

  it("an expired link no longer works", () => {
    expect(isAccessActive({ ...grant, expires_at: "2026-01-01T00:00:00Z" }, new Date("2026-02-01"))).toBe(false);
    expect(isAccessActive({ ...grant, expires_at: "2026-03-01T00:00:00Z" }, new Date("2026-02-01"))).toBe(true);
  });

  it("unpublished files are hidden even from studios that were granted them", () => {
    expect(canStudioSeeAsset(grant, { id: "x1", category: "acrobatic", visibility: "restricted", published: false })).toBe(false);
  });

  it("restricted files of a category the studio was not granted stay hidden", () => {
    expect(canStudioSeeAsset(grant, { id: "s1", category: "spinning", visibility: "restricted", published: true })).toBe(false);
    expect(canStudioSeeAsset(grant, { id: "a1", category: "acrobatic", visibility: "restricted", published: true })).toBe(true);
  });

  it("a file picked individually is visible even outside the granted categories", () => {
    expect(canStudioSeeAsset({ ...grant, categories: [] }, { id: "x1", category: "spinning", visibility: "restricted", published: true })).toBe(true);
  });

  it("the access code must match the link it was issued for", async () => {
    const h = await hashAccessCode("token-a", "ABCD-2345");
    expect(safeEqual(h, await hashAccessCode("token-a", "abcd 2345"))).toBe(true);
    expect(safeEqual(h, await hashAccessCode("token-b", "ABCD-2345"))).toBe(false);
    expect(safeEqual(h, await hashAccessCode("token-a", "ABCD-2346"))).toBe(false);
  });
});
