import { describe, expect, it } from "vitest";
import { tsLinter } from "./tsLinter.js";

describe("tsLinter", () => {
  it("base", async () => {
    expect(tsLinter()).toBeTruthy();
  });
});
