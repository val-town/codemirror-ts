import { EditorView } from "@codemirror/view";
import type { HoverInfo } from "../hover/getHover.js";
import { tsFacet } from "../facet/tsFacet.js";

/**
 * The default setting for the goto handler: this will
 * 'go to' code defined in the same file, and select it.
 * Returns true if it handled this case and the code
 * was in the same file.
 */
export function defaultGotoHandler(
  currentPath: string,
  hoverData: HoverInfo,
  view: EditorView,
) {
  const definition = [
    ...(hoverData.typeDef ? hoverData.typeDef : []),
    ...(hoverData.def ? hoverData.def : [])
  ]?.at(0);

  if (definition && currentPath === definition.fileName) {
    const tr = view.state.update({
      selection: {
        anchor: definition.textSpan.start,
        head: definition.textSpan.start + definition.textSpan.length,
      },
    });
    view.dispatch(tr);
    return true;
  }
}

type ToGoOptions = {
  gotoHandler?: typeof defaultGotoHandler;
};

/**
 * Supports 'going to' a variable definition by meta or
 * ctrl-clicking on it.
 *
 * @example
 * tsGotoWorker()
 */
export function tsGoto(
  opts: ToGoOptions = { gotoHandler: defaultGotoHandler },
) {
  return EditorView.domEventHandlers({
    click: (event, view) => {
      const config = view.state.facet(tsFacet);
      if (!config?.worker || !opts.gotoHandler) return false;

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
          config.log?.("tsGoto: going to location", { hoverData });
          // In reality, we enforced that opts.gotoHandler
          // is non-nullable earlier, but TypeScript knows
          // that in this callback, that theoretically could
          // have changed.
          if (hoverData && opts.gotoHandler) {
            opts.gotoHandler(config.path, hoverData, view);
          }
        });

      return true;
    },
  });
}
