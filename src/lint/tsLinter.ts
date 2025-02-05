import { type Diagnostic, linter, type LintSource } from "@codemirror/lint";
import { tsFacet } from "../index.js";

/**
 * The underlying LintSource implementation, if you
 * want to construct a linter() object yourself.
 */
export const tsLintSource: LintSource = async (
  view,
): Promise<readonly Diagnostic[]> => {
  const config = view.state.facet(tsFacet);
  return config?.worker
    ? config.worker.getLints({
        path: config.path,
      })
    : [];
};

/**
 * Binds the TypeScript `lint()` method with TypeScript's
 * semantic and syntactic diagnostics. You can use
 * the `getLints` method for a lower-level interface
 * to the same data.
 */
export function tsLinter() {
  return linter(tsLintSource);
}
