"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsHover = exports.getHover = void 0;
const view_1 = require("@codemirror/view");
async function getHover({ env, path, pos, }) {
    const sourcePos = pos;
    if (sourcePos === null)
        return null;
    const quickInfo = env.languageService.getQuickInfoAtPosition(path, sourcePos);
    if (!quickInfo)
        return null;
    const start = quickInfo.textSpan.start;
    const typeDef = env.languageService.getTypeDefinitionAtPosition(path, sourcePos) ??
        env.languageService.getDefinitionAtPosition(path, sourcePos);
    return {
        start,
        end: start + quickInfo.textSpan.length,
        typeDef,
        quickInfo,
    };
}
exports.getHover = getHover;
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
        const hoverData = await getHover({
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
//# sourceMappingURL=index.js.map