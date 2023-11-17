"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsLinterWorker = void 0;
const lint_1 = require("@codemirror/lint");
function tsLinterWorker({ worker, path, }) {
    return (0, lint_1.linter)(async (_view) => {
        return worker.getLints({ path });
    });
}
exports.tsLinterWorker = tsLinterWorker;
//# sourceMappingURL=linterWorker.js.map