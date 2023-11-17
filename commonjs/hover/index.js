"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsHoverWorker = exports.tsHover = void 0;
const view_1 = require("@codemirror/view");
const getHover_js_1 = require("./getHover.js");
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
function tsHover({ env, path, renderTooltip = defaultRenderer, }) {
    return (0, view_1.hoverTooltip)(async (view, pos) => {
        const hoverData = (0, getHover_js_1.getHover)({
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
exports.tsHover = tsHover;
function tsHoverWorker({ worker, path, renderTooltip = defaultRenderer, }) {
    return (0, view_1.hoverTooltip)(async (view, pos) => {
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
exports.tsHoverWorker = tsHoverWorker;
//# sourceMappingURL=index.js.map