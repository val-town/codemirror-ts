import { linter, Diagnostic } from "@codemirror/lint";
import { getLints } from "./getLints.js";
import { tsFacet } from "../facet/tsFacet.js";

export function tsLinter() {
  return linter(async (view): Promise<readonly Diagnostic[]> => {
    const config = view.state.facet(tsFacet);
    return config ? getLints(config) : [];
  });
}
