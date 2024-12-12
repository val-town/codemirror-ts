import { describe, expect, it } from "vitest";
import { tsLinterWorker } from "./tsLinterWorker.js";

describe("tsLinter", () => {
  it("base", async () => {
    expect(tsLinterWorker()).toBeTruthy();
  });
});
