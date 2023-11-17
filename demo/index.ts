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
  tsLinterWorker,
  tsHover,
  tsHoverWorker,
  tsAutocomplete,
  tsAutocompleteWorker,
  tsSync,
  tsSyncWorker,
} from "../src/index.js";
import * as Comlink from "comlink";

/*
(async () => {
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
      }),
    ],
    parent: document.querySelector("#editor")!,
  });
})();
*/

(async () => {
  const path = "index.ts";

  // TODO: this is the one place where we can't use .js urls
  const innerWorker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });
  const worker = Comlink.wrap(innerWorker);
  await worker.initialize();

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
      tsSyncWorker({ worker, path }),
      tsLinterWorker({ worker, path }),
      autocompletion({
        override: [tsAutocompleteWorker({ worker, path })],
      }),
      tsHoverWorker({
        worker,
        path,
      }),
    ],
    parent: document.querySelector("#editor")!,
  });
})().catch((e) => console.error(e));
