import { describe, it, expect } from "vitest";

describe("use-swipe", () => {
  it("exports useSwipe hook", async () => {
    const mod = await import("@/hooks/use-swipe");
    expect(mod.useSwipe).toBeDefined();
    expect(typeof mod.useSwipe).toBe("function");
  });
});

describe("use-offline", () => {
  it("exports useOffline hook", async () => {
    const mod = await import("@/hooks/use-offline");
    expect(mod.useOffline).toBeDefined();
    expect(typeof mod.useOffline).toBe("function");
  });
});

describe("use-push", () => {
  it("exports usePush hook", async () => {
    const mod = await import("@/hooks/use-push");
    expect(mod.usePush).toBeDefined();
    expect(typeof mod.usePush).toBe("function");
  });
});
