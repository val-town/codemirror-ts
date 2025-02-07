import { setupTypeAcquisition } from "@typescript/ata";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import * as Comlink from "comlink";
import ts from "typescript";
import { createWorker } from "../src/worker/createWorker.js";

const worker = createWorker({
  env: (async () => {
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
  onFileUpdated(_env, _path, code) {
    ata(code);
  },
});

const ata = setupTypeAcquisition({
  projectName: "My ATA Project",
  typescript: ts,
  logger: console,
  delegate: {
    receivedFile: (code: string, path: string) => {
      worker.getEnv().createFile(path, code);
    },
  },
});

Comlink.expose(worker);
