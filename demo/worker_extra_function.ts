import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import * as Comlink from "comlink";
import ts from "typescript";
import { createWorker } from "../src/worker/createWorker.js";
import type { Remote } from "comlink";

const _env = (async () => {
  const fsMap = await createDefaultMapFromCDN(
    { target: ts.ScriptTarget.ES2022 },
    ts.version,
    false,
    ts,
  );
  const system = createSystem(fsMap);
  return createVirtualTypeScriptEnvironment(system, [], ts, {
    lib: ["ES2022"],
  });
})();

const exposed = {
  async getTranspiledFile(path: string) {
    const env = await _env;
    const file = env.getSourceFile(path);
    if (!file) throw new Error(`File not found for path ${path}`);
    return ts.transpileModule(file.text, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.None,
      },
    });
  },
  worker: createWorker({
    env: _env,
  }),
};

export type Exposed = Remote<typeof exposed>;

Comlink.expose(exposed);
