import { linter, Diagnostic } from "@codemirror/lint";
import { tsFacetWorker } from "../index.js";

export function tsLinterWorker() {
  return linter(async (view): Promise<readonly Diagnostic[]> => {
    const config = view.state.facet(tsFacetWorker);
    return config ? config.worker.getLints({ path: config.path }) : [];
  });
}
