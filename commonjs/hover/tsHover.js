"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsHover = void 0;
const view_1 = require("@codemirror/view");
const getHover_js_1 = require("./getHover.js");
const renderTooltip_js_1 = require("./renderTooltip.js");
function tsHover({ env, path, renderTooltip = renderTooltip_js_1.defaultRenderer, }) {
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
//# sourceMappingURL=tsHover.js.map