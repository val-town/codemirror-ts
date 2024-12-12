import { describe, expect, it } from "vitest";
import { getHover } from "./getHover.js";
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

describe("getHover", () => {
  it("null", async () => {
    const env = createVirtualTypeScriptEnvironment(system, [], ts, {
      lib: ["es2022"],
    });

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
