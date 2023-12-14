import { hoverTooltip, Tooltip } from "@codemirror/view";
import { defaultRenderer, type TooltipRenderer } from "./renderTooltip.js";
import { tsFacetWorker } from "../index.js";

export function tsHoverWorker({
  renderTooltip = defaultRenderer,
}: {
  renderTooltip?: TooltipRenderer;
} = {}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const config = view.state.facet(tsFacetWorker);
    if (!config) return null;
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
