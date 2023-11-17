"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsLinter = void 0;
const lint_1 = require("@codemirror/lint");
const getLints_js_1 = require("./getLints.js");
function tsLinter({ env, path, }) {
    return (0, lint_1.linter)(async (view) => {
        return (0, getLints_js_1.getLints)({
            env,
            path,
        });
    });
}
exports.tsLinter = tsLinter;
//# sourceMappingURL=tsLinter.js.map