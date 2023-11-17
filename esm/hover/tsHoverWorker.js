import { hoverTooltip } from "@codemirror/view";
import { defaultRenderer } from "./renderTooltip.js";
export function tsHoverWorker({ worker, path, renderTooltip = defaultRenderer, }) {
    return hoverTooltip(async (view, pos) => {
        const hoverData = await worker.getHover({
            path,
            pos,
        });
        if (!hoverData)
            return null;
        return {
            pos: hoverData.start,
            end: hoverData.end,
            create: () => renderTooltip(hoverData, view),
        };
    });
}
//# sourceMappingURL=tsHoverWorker.js.map