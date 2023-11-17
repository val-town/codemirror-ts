import { convertTSDiagnosticToCM, isDiagnosticWithLocation } from "./utils.js";
export function getLints({ env, path, }) {
    // Don't crash if the relevant file isn't created yet.
    const exists = env.getSourceFile(path);
    if (!exists)
        return [];
    const syntaticDiagnostics = env.languageService.getSyntacticDiagnostics(path);
    const semanticDiagnostics = env.languageService.getSemanticDiagnostics(path);
    const diagnostics = [...syntaticDiagnostics, ...semanticDiagnostics].filter(isDiagnosticWithLocation);
    return diagnostics.map(convertTSDiagnosticToCM);
}
//# sourceMappingURL=getLints.js.map