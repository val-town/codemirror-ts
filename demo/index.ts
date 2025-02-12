import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, basicSetup } from "codemirror";
import * as Comlink from "comlink";
import type ts from "typescript";
import {
  tsAutocomplete,
  tsFacet,
  tsGoto,
  tsHover,
  tsLinter,
  tsSync,
  tsTwoslash,
} from "../src/index.js";
import type { WorkerShape } from "../src/worker.js";
import type { Exposed } from "./worker_extra_function.js";

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

  const editor = new EditorView({
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
      tsLinter(),
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

(async () => {
  const path = "index.ts";

  // TODO: this is the one place where we can't use .js urls
  const innerWorker = new Worker(new URL("./worker_ata.ts", import.meta.url), {
    type: "module",
  });
  const worker = Comlink.wrap(innerWorker) as WorkerShape;
  await worker.initialize();

  const editor = new EditorView({
    doc: `import { min } from "simple-statistics";

const minimumValue = min([1, 2, 3]);`,
    extensions: [
      basicSetup,
      javascript({
        typescript: true,
        jsx: true,
      }),
      tsFacet.of({ worker, path }),
      tsSync(),
      tsLinter(),
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
    parent: document.querySelector("#editor-worker-ata")!,
  });
})().catch((e) => console.error(e));

(async () => {
  const path = "index.ts";

  // TODO: this is the one place where we can't use .js urls
  const innerWorker = new Worker(
    new URL("./worker_extra_function.ts", import.meta.url),
    {
      type: "module",
    },
  );
  const w = Comlink.wrap(innerWorker) as Exposed;
  const worker = w.worker as unknown as WorkerShape;
  await worker.initialize();

  const editor = new EditorView({
    doc: `enum X { Y = 'Y' };
console.log(X.Y);`,
    extensions: [
      basicSetup,
      javascript({
        typescript: true,
        jsx: true,
      }),
      tsFacet.of({ worker, path }),
      tsSync(),
      tsLinter(),
      autocompletion({
        override: [tsAutocomplete()],
      }),
      tsHover(),
      tsGoto(),
      tsTwoslash(),
      EditorView.updateListener.of((_update) => {
        w.getTranspiledFile(path).then((code) => {
          (document.querySelector(
            "#editor-worker-extra-output",
          ) as HTMLPreElement)!.innerText = code.outputText;
        });
      }),
    ],
    parent: document.querySelector("#editor-worker-extra")!,
  });
})().catch((e) => console.error(e));
