import {
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Fs from "node:fs";

const fsMap = new Map<string, string>(
  JSON.parse(Fs.readFileSync(new URL("./cdn.json", import.meta.url), "utf8")),
);

const system = createSystem(fsMap);

export function getEnv() {
  return createVirtualTypeScriptEnvironment(system, [], ts, {
    lib: ["es2022"],
  });
}
