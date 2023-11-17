import { linter, Diagnostic } from "@codemirror/lint";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { convertTSDiagnosticToCM, isDiagnosticWithLocation } from "./utils.js";

export function getDiagnostics({
  env,
  path,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
}) {
  // Don't crash if the relevant file isn't created yet.
  const exists = env.getSourceFile(path);
  if (!exists) return [];

  const syntaticDiagnostics = env.languageService.getSyntacticDiagnostics(path);
  const semanticDiagnostics = env.languageService.getSemanticDiagnostics(path);

  const diagnostics = [...syntaticDiagnostics, ...semanticDiagnostics].filter(
    isDiagnosticWithLocation,
  );

  return diagnostics.map(convertTSDiagnosticToCM);
}

export function tsLinter({
  env,
  path,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
}) {
  return linter(async (view): Promise<readonly Diagnostic[]> => {
    return getDiagnostics({
      env,
      path,
    });
  });
}
