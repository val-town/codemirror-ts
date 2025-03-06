import { EditorView, type ViewUpdate } from "@codemirror/view";
import { tsFacet } from "../facet/tsFacet.js";
import { tsSyncAnnotation } from "./annotation.js";

/**
 * Configuration for the tsSync extension
 */
interface TsSyncConfig {
  /**
   * Given an update object decide whether to take it (true)
   * or to skip updating TypeScript with this.
   */
  filterUpdate: (update: ViewUpdate) => boolean;
}

/**
 * Sync updates from CodeMirror to the worker.
 */
export function tsSync(
  { filterUpdate = () => true }: TsSyncConfig = {
    filterUpdate: () => true,
  },
) {
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
    if (!filterUpdate(update)) {
      config.log?.("tsSync: update rejected by filterUpdate", { update });
      return;
    }
    first = false;

    config.log?.("tsSync: updating file", { path: config.path });
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
