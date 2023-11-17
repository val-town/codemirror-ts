"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsHoverWorker = void 0;
const view_1 = require("@codemirror/view");
const renderTooltip_js_1 = require("./renderTooltip.js");
function tsHoverWorker({ worker, path, renderTooltip = renderTooltip_js_1.defaultRenderer, }) {
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
//# sourceMappingURL=tsHoverWorker.js.map