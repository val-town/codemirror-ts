"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTSDiagnosticToCM = exports.tsDiagnosticMessage = exports.isDiagnosticWithLocation = exports.tsCategoryToSeverity = void 0;
const typescript_1 = require("typescript");
/**
 * TypeScript has a set of diagnostic categories,
 * which maps roughly onto CodeMirror's categories.
 * Here, we do the mapping.
 */
function tsCategoryToSeverity(diagnostic) {
    if (diagnostic.code === 7027) {
        // Unreachable code detected
        return "warning";
    }
    switch (diagnostic.category) {
        case typescript_1.DiagnosticCategory.Error:
            return "error";
        case typescript_1.DiagnosticCategory.Message:
            return "info";
        case typescript_1.DiagnosticCategory.Warning:
            return "warning";
        case typescript_1.DiagnosticCategory.Suggestion:
            return "info";
    }
}
exports.tsCategoryToSeverity = tsCategoryToSeverity;
/**
 * Not all TypeScript diagnostic relate to specific
 * ranges in source code: here we filter for those that
 * do.
 */
function isDiagnosticWithLocation(diagnostic) {
    return !!(diagnostic.file &&
        typeof diagnostic.start === "number" &&
        typeof diagnostic.length === "number");
}
exports.isDiagnosticWithLocation = isDiagnosticWithLocation;
/**
 * Get the message for a diagnostic. TypeScript
 * is kind of weird: messageText might have the message,
 * or a pointer to the message. This follows the chain
 * to get a string, regardless of which case we're in.
 */
function tsDiagnosticMessage(diagnostic) {
    if (typeof diagnostic.messageText === "string") {
        return diagnostic.messageText;
    }
    // TODO: go through linked list
    return diagnostic.messageText.messageText;
}
exports.tsDiagnosticMessage = tsDiagnosticMessage;
/**
 * TypeScript and CodeMirror have slightly different
 * ways of representing diagnostics. This converts
 * from one to the other.
 */
function convertTSDiagnosticToCM(d) {
    // We add some code at the end of the document, but we can't have a
    // diagnostic in an invalid range
    const start = d.start;
    const message = tsDiagnosticMessage(d);
    return {
        from: start,
        to: start + d.length,
        message: message,
        severity: tsCategoryToSeverity(d),
    };
}
exports.convertTSDiagnosticToCM = convertTSDiagnosticToCM;
//# sourceMappingURL=utils.js.map