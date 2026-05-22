import { describe, it, expect } from "vitest";

describe("getUserFromSupabaseId", () => {
  it("is defined and exported", async () => {
    const mod = await import("@/lib/auth/utils");
    expect(mod.getUserFromSupabaseId).toBeDefined();
    expect(typeof mod.getUserFromSupabaseId).toBe("function");
  });
});
