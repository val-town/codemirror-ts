import type { CompletionContext } from "@codemirror/autocomplete";
import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import type { Remote } from "comlink";
import { getAutocompletion } from "../autocomplete/getAutocompletion.js";
import { getHover } from "../hover/getHover.js";
import { getLints } from "../lint/getLints.js";
import { createOrUpdateFile } from "../sync/update.js";

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

interface InitializerOptions {
  env: VirtualTypeScriptEnvironment | Promise<VirtualTypeScriptEnvironment>;
  onFileUpdated?: (
    env: VirtualTypeScriptEnvironment,
    path: string,
    code: string,
  ) => unknown;
}

/**
 * Create a worker with `WorkerShape`, given an initializer
 * method. You might want to customize how your TypeScript
 * environment is set up, so the initializer can do all
 * of that: this then gives you an object that can be
 * passed to `Comlink.expose`.
 */
export function createWorker(options: InitializerOptions) {
  let env: VirtualTypeScriptEnvironment;
  let initialized = false;

  return {
    async initialize() {
      if (!initialized) {
        env = await options.env;
        initialized = true;
      }
    },
    updateFile({ path, code }: { path: string; code: string }) {
      if (!env) return;
      if (createOrUpdateFile(env, path, code)) {
        options.onFileUpdated?.(env, path, code);
      }
    },
    getLints({
      path,
      diagnosticCodesToIgnore,
    }: {
      path: string;
      diagnosticCodesToIgnore: number[];
    }) {
      if (!env) return [];
      return getLints({ env, path, diagnosticCodesToIgnore });
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
    getEnv() {
      return env;
    },
  };
}
