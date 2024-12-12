import { describe, expect, it } from "vitest";
import { getAutocompletion } from "./getAutocompletion.js";
import { getEnv } from "../../test/env.js";

describe("getAutocompletion", () => {
  it("null", async () => {
    const env = getEnv();

    await expect(
      getAutocompletion({
        env,
        path: "./hi.ts",
        context: {
          pos: 0,
          explicit: true,
        },
      }),
    ).resolves.toEqual(null);
  });

  it("completion", async () => {
    const env = getEnv();

    const name = "/foo.ts";
    const content = "const x = 'hi'.";
    env.createFile(name, content);

    const completions = await getAutocompletion({
      env,
      path: name,
      context: {
        pos: content.length,
        explicit: true,
      },
    });

    expect(completions).toMatchObject({
      from: content.length,
      options: expect.any(Array),
    });
  });
});
