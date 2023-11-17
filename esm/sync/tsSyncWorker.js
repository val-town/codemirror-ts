import { EditorView } from "@codemirror/view";
/**
 * Sync updates from CodeMirror to the worker.
 */
export function tsSyncWorker({ worker, path, }) {
    // TODO: this is a weak solution to the cold start problem.
    // If you boot up a CodeMirror instance, we want the initial
    // value to get loaded into CodeMirror. We do get a change event,
    // but it surprisingly doesn't have `docChanged: true` on it,
    // so this is a rough heuristic to just accept the first event
    // regardless of whether it looks significant.
    let first = true;
    return EditorView.updateListener.of((update) => {
        if (!update.docChanged && !first)
            return;
        first = false;
        worker.updateFile({ path, code: update.state.doc.toString() });
    });
}
//# sourceMappingURL=tsSyncWorker.js.map