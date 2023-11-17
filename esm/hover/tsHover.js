import { hoverTooltip } from "@codemirror/view";
import { getHover } from "./getHover.js";
import { defaultRenderer } from "./renderTooltip.js";
export function tsHover({ env, path, renderTooltip = defaultRenderer, }) {
    return hoverTooltip(async (view, pos) => {
        const hoverData = getHover({
            env,
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
//# sourceMappingURL=tsHover.js.map