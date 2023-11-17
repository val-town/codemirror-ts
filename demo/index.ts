import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import { tsDiagnostics } from "../src/diagnostics/index.js";
import { tsSync } from "../src/sync.js";

const fsMap = await createDefaultMapFromCDN(
  { target: ts.ScriptTarget.ES2022 },
  "3.7.3",
  true,
  ts,
);

const system = createSystem(fsMap);

const compilerOpts = {};
const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript({
      typescript: true,
    }),
    tsSync({ env, path: "index.ts" }),
    tsDiagnostics({ env, path: "index.ts" }),
  ],
  parent: document.querySelector("#editor")!,
});
