import {
  type Diagnostic as TSDiagnostic,
  type DiagnosticWithLocation,
  DiagnosticCategory,
} from "typescript";
import { type Diagnostic } from "@codemirror/lint";

/**
 * TypeScript has a set of diagnostic categories,
 * which maps roughly onto CodeMirror's categories.
 * Here, we do the mapping.
 */
export function tsCategoryToSeverity(
  diagnostic: Pick<DiagnosticWithLocation, "category" | "code">,
): Diagnostic["severity"] {
  if (diagnostic.code === 7027) {
    // Unreachable code detected
    return "warning";
  }
  switch (diagnostic.category) {
    case DiagnosticCategory.Error:
      return "error";
    case DiagnosticCategory.Message:
      return "info";
    case DiagnosticCategory.Warning:
      return "warning";
    case DiagnosticCategory.Suggestion:
      return "info";
  }
}

/**
 * Not all TypeScript diagnostic relate to specific
 * ranges in source code: here we filter for those that
 * do.
 */
export function isDiagnosticWithLocation(
  diagnostic: TSDiagnostic,
): diagnostic is DiagnosticWithLocation {
  return !!(
    diagnostic.file &&
    typeof diagnostic.start === "number" &&
    typeof diagnostic.length === "number"
  );
}
