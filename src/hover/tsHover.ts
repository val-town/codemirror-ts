import { hoverTooltip, Tooltip } from "@codemirror/view";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { getHover } from "./getHover.js";
import { defaultRenderer, TooltipRenderer } from "./renderTooltip.js";

export function tsHover({
  env,
  path,
  renderTooltip = defaultRenderer,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  renderTooltip?: TooltipRenderer;
}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const hoverData = getHover({
      env,
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
