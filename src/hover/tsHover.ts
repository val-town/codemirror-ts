import { type Tooltip, hoverTooltip } from "@codemirror/view";
import { tsFacet } from "../index.js";
import { type TooltipRenderer, defaultRenderer } from "./renderTooltip.js";

/**
 * This binds the CodeMirror `hoverTooltip` method
 * with a code that pulls types and documentation
 * from the TypeScript environment.
 */
export function tsHover({
  renderTooltip = defaultRenderer,
}: {
  renderTooltip?: TooltipRenderer;
} = {}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const config = view.state.facet(tsFacet);
    if (!config?.worker) return null;
    const hoverData = await config.worker.getHover({
      path: config.path,
      pos,
    });

    if (!hoverData) {
      config.log?.("tsHover: no hover data found at location", { pos });
      return null;
    }

    return {
      pos: hoverData.start,
      end: hoverData.end,
      create: () => renderTooltip(hoverData, view),
    };
  });
}
