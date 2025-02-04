import { EditorView } from "@codemirror/view";
import { tsFacet } from "../index.js";
import { tsSyncAnnotation } from "./annotation.js";

/**
 * Sync updates from CodeMirror to the worker.
 */
export function tsSync() {
  // TODO: this is a weak solution to the cold start problem.
  // If you boot up a CodeMirror instance, we want the initial
  // value to get loaded into CodeMirror. We do get a change event,
  // but it surprisingly doesn't have `docChanged: true` on it,
  // so this is a rough heuristic to just accept the first event
  // regardless of whether it looks significant.
  let first = true;
  return EditorView.updateListener.of((update) => {
    const config = update.view.state.facet(tsFacet);
    if (!config?.worker) return;
    if (!update.docChanged && !first) return;
    first = false;

    config.worker
      .updateFile({
        path: config.path,
        code: update.state.doc.toString(),
      })
      .then(() => {
        update.view.dispatch({
          annotations: [tsSyncAnnotation.of({ path: config.path })],
        });
      });
  });
}
