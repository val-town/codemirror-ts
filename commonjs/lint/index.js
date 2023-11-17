"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsLinter = exports.getLints = void 0;
const lint_1 = require("@codemirror/lint");
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
function tsLinter({ env, path, }) {
    return (0, lint_1.linter)(async (view) => {
        return getLints({
            env,
            path,
        });
    });
}
exports.tsLinter = tsLinter;
//# sourceMappingURL=index.js.map