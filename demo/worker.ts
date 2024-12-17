import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Comlink from "comlink";
import { createWorker } from "../src/worker/createWorker.js";

Comlink.expose(
  createWorker({
    env: (async function () {
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
    })(),
  }),
);
