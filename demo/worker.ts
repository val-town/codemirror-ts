import {
  VirtualTypeScriptEnvironment,
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Comlink from "comlink";
import { createOrUpdateFile } from "../src/sync/update.js";
import { getLints } from "../src/lint/getLints.js";
import { CompletionContext } from "@codemirror/autocomplete";
import { getAutocompletion } from "../src/autocomplete/getAutocompletion.js";
import { getHover } from "../src/hover/getHover.js";

let env: VirtualTypeScriptEnvironment;

const obj = {
  counter: 0,
  async initialize() {
    const fsMap = await createDefaultMapFromCDN(
      { target: ts.ScriptTarget.ES2022 },
      "3.7.3",
      false,
      ts,
    );
    const system = createSystem(fsMap);
    const compilerOpts = {};
    env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);
  },
  updateFile({ path, code }: { path: string; code: string }) {
    if (!env) return;
    createOrUpdateFile(env, path, code);
  },
  getLints({ path }: { path: string }) {
    if (!env) return;
    return getLints({ env, path });
  },
  getAutocompletion({
    path,
    context,
  }: {
    path: string;
    context: Pick<CompletionContext, "pos" | "explicit">;
  }) {
    if (!env) return;
    return getAutocompletion({ env, path, context });
  },
  getHover({ path, pos }: { path: string; pos: number }) {
    if (!env) return;
    return getHover({ env, path, pos });
  },
};

Comlink.expose(obj);
