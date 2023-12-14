import { combineConfig, Facet } from "@codemirror/state";
import { type WorkerShape } from "../worker.js";

export const tsFacetWorker = Facet.define<
  {
    path: string;
    worker: WorkerShape;
  },
  {
    path: string;
    worker: WorkerShape;
  } | null
>({
  combine(configs) {
    return combineConfig(configs, {});
  },
});
