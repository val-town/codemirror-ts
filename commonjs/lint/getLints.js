"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLints = void 0;
const utils_js_1 = require("./utils.js");
function getLints({ env, path, }) {
    // Don't crash if the relevant file isn't created yet.
    const exists = env.getSourceFile(path);
    if (!exists)
        return [];
    const syntaticDiagnostics = env.languageService.getSyntacticDiagnostics(path);
    const semanticDiagnostics = env.languageService.getSemanticDiagnostics(path);
    const diagnostics = [...syntaticDiagnostics, ...semanticDiagnostics].filter(utils_js_1.isDiagnosticWithLocation);
    return diagnostics.map(utils_js_1.convertTSDiagnosticToCM);
}
exports.getLints = getLints;
//# sourceMappingURL=getLints.js.map