import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { createOrUpdateFile } from "../sync/update.js";
import { getLints } from "../lint/getLints.js";
import { type CompletionContext } from "@codemirror/autocomplete";
import { getAutocompletion } from "../autocomplete/getAutocompletion.js";
import { getHover } from "../hover/getHover.js";
import { type Remote } from "comlink";

/**
 * The shape of the output of something like
 *
 * ```ts
 * Comlink.wrap(new Worker(…));
 * ```
 *
 * Most TypeScript environments won’t be able to figure out
 * the types of a `Worker` instance, so this is a helper
 * for casting.
 */
export type WorkerShape = Remote<ReturnType<typeof createWorker>>;

/**
 * Create a worker with `WorkerShape`, given an initializer
 * method. You might want to customize how your TypeScript
 * environment is set up, so the initializer can do all
 * of that: this then gives you an object that can be
 * passed to `Comlink.expose`.
 */
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
