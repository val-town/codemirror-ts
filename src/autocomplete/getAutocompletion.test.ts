import { describe, expect, it } from "vitest";
import { getAutocompletion } from "./getAutocompletion.js";
import {
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Fs from "node:fs";

const fsMap = new Map<string, string>(
  JSON.parse(
    Fs.readFileSync(new URL("../../test/cdn.json", import.meta.url), "utf8"),
  ),
);

const system = createSystem(fsMap);

describe("getAutocompletion", () => {
  it("null", async () => {
    const env = createVirtualTypeScriptEnvironment(system, [], ts, {
      lib: ["es2022"],
    });

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
    const env = createVirtualTypeScriptEnvironment(system, [], ts, {
      lib: ["es2022"],
    });

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
