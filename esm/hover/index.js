import { hoverTooltip, } from "@codemirror/view";
import { getHover } from "./getHover.js";
const defaultRenderer = (info) => {
    const div = document.createElement("div");
    if (info.quickInfo?.displayParts) {
        for (let part of info.quickInfo.displayParts) {
            const span = div.appendChild(document.createElement("span"));
            span.className = `quick-info-${part.kind}`;
            span.innerText = part.text;
        }
    }
    return { dom: div };
};
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
//# sourceMappingURL=index.js.map