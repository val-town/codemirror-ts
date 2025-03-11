import { Facet, combineConfig } from "@codemirror/state";
import type { WorkerShape } from "../worker/createWorker.js";

/**
 * Use this facet if you intend to run your TypeScript
 * virtual environment within a web worker.
 *
 * This is how the ts-related extensions are
 * configured: this facet sets the path of the file
 * and the environment to use, and the rest of
 * the extensions, like tsLint and tsAutocomplete,
 * pull those settings automatically from editor state.
 */
export const tsFacet = Facet.define<
  {
    path: string;
    worker: Omit<WorkerShape, "initialize">;
    log?: (...args: unknown[]) => void;
  },
  FacetConfig
>({
  combine(configs) {
    return combineConfig(configs, {});
  },
});

export type FacetConfig = {
  path: string;
  worker: Omit<WorkerShape, "initialize">;
  log?: (...args: unknown[]) => void;
} | null;
