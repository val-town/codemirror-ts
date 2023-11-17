import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import {
  tsLinter,
  tsHover,
  type HoverInfo,
  tsAutocomplete,
  tsSync,
} from "../src/index.js";

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
  doc: `let hasAnError: string = 10;

function increment(num: number) {
  return num + 1;
}

increment('not a number');`,
  extensions: [
    basicSetup,
    javascript({
      typescript: true,
      jsx: true,
    }),
    tsSync({ env, path }),
    tsLinter({ env, path }),
    autocompletion({
      override: [tsAutocomplete({ env, path })],
    }),
    tsHover({
      env,
      path,
      renderTooltip(info: HoverInfo) {
        const div = document.createElement("div");
        if (info.quickInfo) {
          for (let part of info.quickInfo.displayParts) {
            const span = div.appendChild(document.createElement("span"));
            span.className = `quick-info-${part.kind}`;
            span.innerText = part.text;
          }
        }
        return { dom: div };
      },
    }),
  ],
  parent: document.querySelector("#editor")!,
});
