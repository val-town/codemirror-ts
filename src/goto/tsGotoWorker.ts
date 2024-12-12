import { EditorView } from "@codemirror/view";
import { tsFacetWorker } from "../index.js";

/**
 * Supports 'going to' a variable definition by meta or
 * ctrl-clicking on it.
 */
export function tsGotoWorker() {
  return EditorView.domEventHandlers({
    click: (event, view) => {
      const config = view.state.facet(tsFacetWorker);
      if (!config?.worker) return false;

      // TODO: maybe this should be _just_ meta?
      // I think ctrl should probably be preserved.
      // Need to check what VS Code does
      if (!(event.metaKey || event.ctrlKey)) return false;

      const pos = view.posAtCoords({
        x: event.clientX,
        y: event.clientY,
      });

      if (pos === null) return;

      config.worker
        .getHover({
          path: config.path,
          pos,
        })
        .then((hoverData) => {
          const definition = hoverData?.typeDef?.at(0);

          if (definition) {
            if (config.path === definition.fileName) {
              const tr = view.state.update({
                selection: {
                  anchor: definition.textSpan.start,
                  head: definition.textSpan.start + definition.textSpan.length,
                },
              });
              view.dispatch(tr);
            }
          }
        });

      return true;
    },
  });
}
