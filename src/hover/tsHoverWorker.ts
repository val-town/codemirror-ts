import { hoverTooltip, Tooltip } from "@codemirror/view";
import { type WorkerShape } from "../worker.js";
import { defaultRenderer, type TooltipRenderer } from "./renderTooltip.js";

export function tsHoverWorker({
  worker,
  path,
  renderTooltip = defaultRenderer,
}: {
  worker: WorkerShape;
  path: string;
  renderTooltip?: TooltipRenderer;
}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const hoverData = await worker.getHover({
      path,
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
