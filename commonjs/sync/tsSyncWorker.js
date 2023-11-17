"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsSyncWorker = void 0;
const view_1 = require("@codemirror/view");
/**
 * Sync updates from CodeMirror to the worker.
 */
function tsSyncWorker({ worker, path, }) {
    // TODO: this is a weak solution to the cold start problem.
    // If you boot up a CodeMirror instance, we want the initial
    // value to get loaded into CodeMirror. We do get a change event,
    // but it surprisingly doesn't have `docChanged: true` on it,
    // so this is a rough heuristic to just accept the first event
    // regardless of whether it looks significant.
    let first = true;
    return view_1.EditorView.updateListener.of((update) => {
        if (!update.docChanged && !first)
            return;
        first = false;
        worker.updateFile({ path, code: update.state.doc.toString() });
    });
}
exports.tsSyncWorker = tsSyncWorker;
//# sourceMappingURL=tsSyncWorker.js.map