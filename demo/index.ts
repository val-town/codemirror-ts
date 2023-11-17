import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import { tsDiagnostics } from "../src/diagnostics/index.js";
import { tsHover } from "../src/hover/index.js";
import { tsAutocomplete } from "../src/autocomplete/index.js";
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

const path = "index.ts";

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript({
      typescript: true,
      jsx: true,
    }),
    tsSync({ env, path }),
    tsDiagnostics({ env, path }),
    autocompletion({
      override: [tsAutocomplete({ env, path })],
    }),
    tsHover({
      env,
      path,
      renderTooltip: (info) => {
        const div = document.createElement("div");
        div.innerText = JSON.stringify(info);
        return { dom: div };
      },
    }),
  ],
  parent: document.querySelector("#editor")!,
});
