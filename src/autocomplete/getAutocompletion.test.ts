import { describe, expect, it } from "vitest";
import { getEnv } from "../../test/env.js";
import { getAutocompletion } from "./getAutocompletion.js";

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

  it("codeAction", async () => {
    const env = getEnv();

    const bname = "/bfoo.ts";
    const bcontent = "export const zzzz = 'hi'.";
    env.createFile(bname, bcontent);

    const name = "/foo.ts";
    const content = "const x = z";
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
      from: expect.any(Number),
      options: expect.any(Array),
    });

    const auto = completions?.options.find((c) => c.codeActions);

    expect(auto).toBeTruthy();
  });
});
