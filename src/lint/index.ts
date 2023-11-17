import { linter, Diagnostic } from "@codemirror/lint";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { getLints } from "./getLints.js";

export function tsLinter({
  env,
  path,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
}) {
  return linter(async (view): Promise<readonly Diagnostic[]> => {
    return getLints({
      env,
      path,
    });
  });
}
