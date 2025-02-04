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
  tsLinterWorker,
  tsHover,
  tsAutocomplete,
  tsSync,
  tsFacet,
  tsGoto,
  tsTwoslash,
} from "../src/index.js";
import * as Comlink from "comlink";
import { WorkerShape } from "../src/worker.js";

function renderDisplayParts(dp: ts.SymbolDisplayPart[]) {
  const div = document.createElement("div");
  for (const part of dp) {
    const span = div.appendChild(document.createElement("span"));
    span.className = `quick-info-${part.kind}`;
    span.innerText = part.text;
  }
  return div;
}

(async () => {
  const path = "index.ts";

  // TODO: this is the one place where we can't use .js urls
  const innerWorker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });
  const worker = Comlink.wrap(innerWorker) as WorkerShape;
  await worker.initialize();

  let editor = new EditorView({
    doc: `let hasAnError: string = 10;

function increment(num: number) {
  return num + 1;
  //     ^?
}

increment('not a number');`,
    extensions: [
      basicSetup,
      javascript({
        typescript: true,
        jsx: true,
      }),
      tsFacet.of({ worker, path }),
      tsSync(),
      tsLinterWorker(),
      autocompletion({
        override: [
          tsAutocomplete({
            renderAutocomplete(raw) {
              return () => {
                const div = document.createElement("div");
                if (raw.documentation) {
                  const description = div.appendChild(
                    document.createElement("div"),
                  );
                  description.appendChild(
                    renderDisplayParts(raw.documentation),
                  );
                }
                if (raw?.displayParts) {
                  const dp = div.appendChild(document.createElement("div"));
                  dp.appendChild(renderDisplayParts(raw.displayParts));
                }
                return { dom: div };
              };
            },
          }),
        ],
      }),
      tsHover(),
      tsGoto(),
      tsTwoslash(),
    ],
    parent: document.querySelector("#editor-worker")!,
  });
})().catch((e) => console.error(e));
