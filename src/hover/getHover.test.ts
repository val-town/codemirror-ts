import { describe, expect, it } from "vitest";
import { getEnv } from "../../test/env.js";
import { getHover } from "./getHover.js";

describe("getHover", () => {
  it("null", async () => {
    const env = getEnv();

    const name = "/foo.ts";
    const content = "const x = 'hi'.";
    env.createFile(name, content);

    const hover = getHover({
      env,
      path: name,
      pos: content.length,
    });

    expect(hover).toBeNull();
  });
});
