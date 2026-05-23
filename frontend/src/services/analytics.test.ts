import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("swallows network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(trackEvent({ eventType: "visit" })).resolves.toBeUndefined();
  });
});
