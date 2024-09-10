import { linter, Diagnostic } from "@codemirror/lint";
import { tsFacetWorker } from "../index.js";

/**
 * Binds the TypeScript `lint()` method with TypeScript's
 * semantic and syntactic diagnostics. You can use
 * the `getLints` method for a lower-level interface
 * to the same data.
 */
export function tsLinterWorker({
  diagnosticCodesToIgnore,
}: { diagnosticCodesToIgnore?: number[] } = {}) {
  return linter(async (view): Promise<readonly Diagnostic[]> => {
    const config = view.state.facet(tsFacetWorker);
    return config
      ? config.worker.getLints({
          path: config.path,
          diagnosticCodesToIgnore: diagnosticCodesToIgnore || [],
        })
      : [];
  });
}
