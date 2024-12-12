import { describe, expect, it } from "vitest";
import { getLints } from "./getLints.js";
import { getEnv } from "../../test/env.js";

describe("getLints", () => {
  it("getting a lint", async () => {
    const env = getEnv();

    const name = "/foo.ts";
    const content = "const x = 'hi'.";
    env.createFile(name, content);

    const lints = getLints({
      env,
      path: name,
      diagnosticCodesToIgnore: [],
    });

    expect(lints).toMatchInlineSnapshot(`
      [
        {
          "from": 15,
          "message": "Identifier expected.",
          "severity": "error",
          "to": 15,
        },
      ]
    `);
  });
});
