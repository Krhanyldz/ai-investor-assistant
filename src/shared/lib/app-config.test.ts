import { describe, expect, it } from "vitest";
import { appConfig } from "@/config/app";

describe("appConfig", () => {
  it("exposes the base app metadata", () => {
    expect(appConfig.appName).toBe("AI Investor Assistant");
    expect(appConfig.appDescription).toContain("investing workflow");
    expect(appConfig.supportEmail).toContain("@ai-investor-assistant.dev");
  });
});
