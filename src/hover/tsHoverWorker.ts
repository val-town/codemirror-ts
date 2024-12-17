import { type Tooltip, hoverTooltip } from "@codemirror/view";
import { tsFacetWorker } from "../index.js";
import { type TooltipRenderer, defaultRenderer } from "./renderTooltip.js";

/**
 * This binds the CodeMirror `hoverTooltip` method
 * with a code that pulls types and documentation
 * from the TypeScript environment.
 */
export function tsHoverWorker({
  renderTooltip = defaultRenderer,
}: {
  renderTooltip?: TooltipRenderer;
} = {}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const config = view.state.facet(tsFacetWorker);
    if (!config?.worker) return null;
    const hoverData = await config.worker.getHover({
      path: config.path,
      pos,
    });

    if (!hoverData) return null;

    return {
      pos: hoverData.start,
      end: hoverData.end,
      create: () => renderTooltip(hoverData, view),
    };
  });
}
