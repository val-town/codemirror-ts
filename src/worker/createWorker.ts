import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { createOrUpdateFile } from "../sync/update.js";
import { getLints } from "../lint/getLints.js";
import { type CompletionContext } from "@codemirror/autocomplete";
import { getAutocompletion } from "../autocomplete/getAutocompletion.js";
import { getHover } from "../hover/getHover.js";
import { type Remote } from "comlink";

export type WorkerShape = Remote<ReturnType<typeof createWorker>>;

export function createWorker(
  initializer: () =>
    | VirtualTypeScriptEnvironment
    | Promise<VirtualTypeScriptEnvironment>,
) {
  let env: VirtualTypeScriptEnvironment;

  return {
    async initialize() {
      env = await initializer();
    },
    updateFile({ path, code }: { path: string; code: string }) {
      if (!env) return;
      createOrUpdateFile(env, path, code);
    },
    getLints({ path }: { path: string }) {
      if (!env) return [];
      return getLints({ env, path });
    },
    getAutocompletion({
      path,
      context,
    }: {
      path: string;
      context: Pick<CompletionContext, "pos" | "explicit">;
    }) {
      if (!env) return null;
      return getAutocompletion({ env, path, context });
    },
    getHover({ path, pos }: { path: string; pos: number }) {
      if (!env) return;
      return getHover({ env, path, pos });
    },
  };
}
