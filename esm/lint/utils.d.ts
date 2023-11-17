import { type Diagnostic as TSDiagnostic, type DiagnosticWithLocation } from "typescript";
import { type Diagnostic } from "@codemirror/lint";
/**
 * TypeScript has a set of diagnostic categories,
 * which maps roughly onto CodeMirror's categories.
 * Here, we do the mapping.
 */
export declare function tsCategoryToSeverity(diagnostic: Pick<DiagnosticWithLocation, "category" | "code">): Diagnostic["severity"];
/**
 * Not all TypeScript diagnostic relate to specific
 * ranges in source code: here we filter for those that
 * do.
 */
export declare function isDiagnosticWithLocation(diagnostic: TSDiagnostic): diagnostic is DiagnosticWithLocation;
/**
 * Get the message for a diagnostic. TypeScript
 * is kind of weird: messageText might have the message,
 * or a pointer to the message. This follows the chain
 * to get a string, regardless of which case we're in.
 */
export declare function tsDiagnosticMessage(diagnostic: Pick<TSDiagnostic, "messageText">): string;
/**
 * TypeScript and CodeMirror have slightly different
 * ways of representing diagnostics. This converts
 * from one to the other.
 */
export declare function convertTSDiagnosticToCM(d: DiagnosticWithLocation): Diagnostic;
//# sourceMappingURL=utils.d.ts.map