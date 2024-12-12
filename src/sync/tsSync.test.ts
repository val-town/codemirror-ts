import { expect, test } from "vitest";
import { tsSync } from "./tsSync";

test("tsSync", () => {
  expect(tsSync()).toBeTruthy();
});
